import { getCurrentUser } from "@/lib/dal";
import HeaderClient from "./HeaderClient";

// Server component: reads the session on the server, then hands the (non-secret)
// user data to the client header. All existing `<Header />` call sites keep working.
export default async function Header() {
    const user = await getCurrentUser();
    return <HeaderClient user={user} />;
}
