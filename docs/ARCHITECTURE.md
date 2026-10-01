# Architecture — Auth, Account & Orders

This document maps the files that make up the **authentication**, **account**, and
**orders/checkout** features, and explains what each one does and how they fit
together. It's aimed at a developer reading the code for the first time.

## The big picture

```
Browser ──┬─ Header (shows login/signup OR account menu)
          │
          ├─ /checkout  ── reads the client cart (zustand) ──┐
          │                                                   │
          └─ /account/* ── protected pages (require login)    │
                                                              │
                        placeOrder() server action ◄──────────┘
                               │
                   lib/order-store.ts (data layer)
                               │
                   Sequelize models (lib/models.ts)
                               │
                        Postgres (Supabase)
```

Two important design facts:

1. **The product catalog lives in a JSON file** (`lib/product-store.ts`), while
   **users and orders live in Postgres**. Because there is no products table,
   order line items **snapshot** the product's name/price/image at purchase time
   instead of foreign-keying to it. Editing or deleting a product never rewrites
   a customer's past order.
2. **Prices are re-resolved on the server** at checkout (`createOrder` looks each
   product up again from the catalog). The client only sends `productId` +
   `quantity`, so it can't tamper with prices.

---

## Folder structure

```
favour-stores/
├── models/                          # Sequelize model DEFINITIONS (DB schema shapes, plain JS)
│   ├── order.js                     # Order model (one checkout)
│   ├── orderItem.js                 # OrderItem model (one line in an order)
│   ├── user.js                      # (existing) User model
│   └── category.js                  # (existing) Category model
│
├── migrations/                      # sequelize-cli migrations (create the real DB tables)
│   ├── 20261001090000-create-order.js
│   └── 20261001090100-create-order-item.js
│
├── lib/                             # Server/client helpers & data access
│   ├── models.ts                    # Instantiates models + wires associations
│   ├── auth-session.ts              # JWT session cookie (create / read / destroy)
│   ├── dal.ts                       # getCurrentUser() — who is signed in
│   ├── order-store.ts               # All order DB reads/writes (data access layer)
│   ├── use-hydrated.ts              # Client hook to avoid hydration mismatches
│   ├── db.ts                        # (existing) Sequelize connection to Postgres
│   ├── product-store.ts             # (existing) JSON-file product catalog
│   ├── products.ts                  # (existing) Product type + formatters (formatNaira)
│   └── cart-store.ts                # (existing) zustand cart (localStorage)
│
├── app/
│   ├── actions/
│   │   ├── auth.ts                  # login / signup / logout server actions
│   │   └── orders.ts               # placeOrder() server action
│   │
│   ├── account/                     # Signed-in "My Account" area (protected)
│   │   ├── layout.tsx               # Auth gate + shared shell
│   │   ├── page.tsx                 # Overview: profile + recent orders
│   │   └── orders/
│   │       ├── page.tsx             # Full orders list
│   │       └── [id]/page.tsx        # Single order detail
│   │
│   └── checkout/
│       └── page.tsx                 # Checkout route (server wrapper)
│
└── components/
    ├── Layout/
    │   ├── Header.tsx               # Server wrapper: fetches the user
    │   └── HeaderClient.tsx         # Header UI (account menu, search, cart)
    ├── account/
    │   ├── AccountNav.tsx           # Sidebar nav with active-link highlighting
    │   └── OrderStatusBadge.tsx     # Coloured status pill
    └── checkout/
        └── CheckoutClient.tsx       # Cart review + "Place order"
```

---

## What each file does

### Database layer — `models/` + `migrations/`

| File | Role |
|---|---|
| `models/order.js` | Defines the **Order** table: `userId`, `status` (enum: `pending`/`paid`/`shipped`/`delivered`/`cancelled`), `total` (DECIMAL). |
| `models/orderItem.js` | Defines **OrderItem**: `orderId`, `productId` (soft reference, not a FK), and the **snapshot** fields `name` / `price` / `image` / `quantity`. |
| `migrations/…-create-order.js` | Creates the `Orders` table — FK to `Users`, cascade delete, enum type. |
| `migrations/…-create-order-item.js` | Creates the `OrderItems` table — FK to `Orders`, cascade delete. |

> Run migrations with `npx sequelize-cli db:migrate`; undo the last one with
> `npx sequelize-cli db:migrate:undo`.

### Data & session layer — `lib/`

| File | Role |
|---|---|
| `lib/models.ts` | Instantiates every model against the shared connection (`lib/db.ts`) and declares associations: `User 1─* Order 1─* OrderItem` (items aliased `items`, cascade delete). |
| `lib/auth-session.ts` | Signs/verifies the JWT session cookie: `createSession`, `getSession`, `destroySession`. |
| `lib/dal.ts` | `getCurrentUser()` — reads the session and loads the user's `{ id, name, email }` (never the password hash). Cached per request. The single source of "who is logged in." |
| `lib/order-store.ts` | Order data-access layer: `getOrdersForUser`, `getOrderForUser` (scoped by `userId` so no one can load another user's order), and `createOrder` (re-resolves prices server-side, writes order + items in a transaction). Returns plain objects safe to pass to Client Components. |
| `lib/use-hydrated.ts` | Client hook returning `false` on the server + first client render, then `true`. Gate localStorage-backed state (the cart) with this to prevent hydration errors. |

### Server actions — `app/actions/`

| File | Role |
|---|---|
| `app/actions/auth.ts` | `loginAction`, `signupAction`, `logoutAction`. Validate input, hash/verify passwords, manage the session cookie. |
| `app/actions/orders.ts` | `placeOrder(lines)` — checks the session, calls `createOrder`, revalidates the orders page, and returns `{ ok, orderId }` or an error. Does **not** redirect, so the client can clear the cart first. |

### Account UI — `app/account/` (protected)

| File | Role |
|---|---|
| `layout.tsx` | The gate: redirects to `/login` if not signed in; renders header, sidebar, and footer around every account page. |
| `page.tsx` | Overview — profile card + a short recent-orders preview. |
| `orders/page.tsx` | Full list of the user's orders (date, status, item count, total). |
| `orders/[id]/page.tsx` | One order's detail — line items with images + grand total. 404s on an unknown or non-owned id. |

### Checkout UI

| File | Role |
|---|---|
| `app/checkout/page.tsx` | Server wrapper: adds header/footer and passes whether the user is logged in. |
| `components/checkout/CheckoutClient.tsx` | Reads the zustand cart, lists items (with remove), shows the total, and calls `placeOrder`. Mobile-responsive; hydration-safe via `useHydrated`. |

### Shared components — `components/`

| File | Role |
|---|---|
| `Layout/Header.tsx` | Server component — fetches the current user, hands it to `HeaderClient`. Keeps all existing `<Header />` call sites working unchanged. |
| `Layout/HeaderClient.tsx` | All header interactivity: login/signup buttons vs. account dropdown (name/email → My account / My orders / Logout), full-width search overlay, and a hydration-safe cart badge linking to `/checkout`. |
| `account/AccountNav.tsx` | Sidebar links with active-route highlighting (`usePathname`). |
| `account/OrderStatusBadge.tsx` | Maps each order status to a label + colour; shared by the list and detail pages. |

---

## Request flows

**Logging in**
`login form → loginAction (app/actions/auth.ts) → verify password → createSession (cookie) → redirect`.
On the next render, `Header.tsx` calls `getCurrentUser()` and shows the account menu.

**Placing an order**
`/checkout → CheckoutClient reads cart → placeOrder(lines) → createOrder (transaction: Order + OrderItems, prices resolved server-side) → client clears cart → redirect to /account/orders/[id]`.

**Viewing orders**
`/account/* → layout gate (getCurrentUser or redirect) → page calls getOrdersForUser / getOrderForUser (scoped to the user) → render`.
