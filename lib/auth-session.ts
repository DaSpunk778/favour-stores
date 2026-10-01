import {  jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "session";

// Resolve the signing key lazily (on first use) rather than at module load.
// Throwing at import time breaks `next build` on hosts where the secret is only
// provided at runtime; deferring it keeps the build working while still failing
// loudly the moment auth is actually used without a configured secret.
function getSecret() {
    const secretValue = process.env.SESSION_SECRET;
    if (!secretValue) {
        throw new Error(
            "SESSION_SECRET is not set. Add it to your environment variables (Netlify: Site configuration → Environment variables; local: .env.local)."
        );
    }
    return new TextEncoder().encode(secretValue);
}

export async function createSession(userId: number) {
    const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());

    (await cookies()).set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function getSession() {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return payload as { userId: number}
    } catch {
        return null;
    }
}

export async function destroySession() {
    (await cookies()).delete(COOKIE_NAME);
}