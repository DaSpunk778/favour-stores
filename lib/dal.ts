import { cache } from "react";
import { getSession } from "./auth-session";
import { User } from "./models";

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
};

/**
 * Reads the session cookie, verifies it, and loads the matching user.
 * Returns null when nobody is signed in. `cache` dedupes the DB hit so
 * multiple components can call this within a single render pass for free.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const user = await User.findByPk(session.userId, {
      // Only pull the non-secret fields the UI needs.
      attributes: ["id", "name", "email"],
    });
    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email };
  } catch (err) {
    console.error("Failed to load current user:", err);
    return null;
  }
});
