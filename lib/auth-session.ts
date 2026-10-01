import {  jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretValue = process.env.SESSION_SECRET;
if (!secretValue) {
    throw new Error("SESSION_SECRET is not set in .env.local");
}
const secret = new TextEncoder().encode(secretValue);
const COOKIE_NAME = "session";

export async function createSession(userId: number) {
    const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

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
        const { payload } = await jwtVerify(token, secret);
        return payload as { userId: number}
    } catch {
        return null;
    }
}

export async function destroySession() {
    (await cookies()).delete(COOKIE_NAME);
}