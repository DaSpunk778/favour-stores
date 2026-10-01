"use client";

import { createContext, useContext } from "react";

// Minimal client-readable auth state. The session cookie is httpOnly (not
// readable from JS), so client components can't check auth on their own — the
// root layout reads it on the server and feeds it in here via <AuthProvider>.
// Components then call useAuth() to react to it (e.g. gate "add to cart").
const AuthContext = createContext<{ isAuthed: boolean }>({ isAuthed: false });

export function AuthProvider({
  isAuthed,
  children,
}: {
  isAuthed: boolean;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={{ isAuthed }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
