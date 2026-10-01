"use server";
//this matters because its where psswd ckecs and hashing, DB queries happens so the server makes the mechanism automatic.
import { redirect } from "next/navigation";
import { UniqueConstraintError } from "sequelize";
import { User } from "@/lib/models";
import { createSession, destroySession } from "@/lib/auth-session";




// state for `useActionState`. Swap the "// TODO: persist" blocks for real

export type AuthState = {
  ok: boolean;
  message?: string;
  // Field-level errors keyed by input name.
  //Record<string, string> : where every key and value are string 
  errors?: Record<string, string>; 
  // Echo back non-secret values so the form can repopulate after a failed submit.
  values?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //the email regex

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = getString(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");

  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values: { email } };
  }

  // TODO: persist — look up the user, verify the hashed password, create a
  // session cookie, then redirect("/"). For now we just acknowledge success.
  // return {
  //   ok: true,
  //   message: "Signed in successfully. (Backend not wired up yet.)",
  //   values: { email },
  // };

  let userId: number;
  try {
    const user = await User.findOne({ where: { email }});
    if (!user || !(await user.validatePassword(password))) {
      return { ok: false, message: "Invalid email or password.", values: { email} };
    }
    userId = user.id;
  } catch (err) {
    console.error("Login failes:", err);
    return { ok: false, message: "something went wromg. Try again.", values: { email} };
  }

  await createSession(userId);
  redirect("/");
}

export async function signupAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const acceptedTerms = formData.get("terms") === "on";

  const errors: Record<string, string> = {};

  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = "Password must include a letter and a number.";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!acceptedTerms) {
    errors.terms = "Please accept the terms to continue.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values: { name, email } };
  }

  // TODO: persist — check the email isn't taken, hash the password, create the
  // user row + session cookie, then redirect("/"). Stubbed for now.
  // return {
  //   ok: true,
  //   message: "Account created successfully. (Backend not wired up yet.)",
  //   values: { name, email },
  // };

  let userId: number;
  try {
    const existing = await User.findOne({ where: { email }});
    if (existing) {
      return {
        ok: false,
        errors: { email: "An account with this email already exists." },
        values: { name, email },
      };
    }
    const user = await User.create({ name, email, password });
    userId = user.id;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return {
        ok: false,
        errors: { email: "An account with this email already exists." },
        values: { name, email },
      };
    };
    console.error("signup failed:", err);
    return { ok: false, message: "Something went wrong. Try again.", values: { name, email } };
  }
  await createSession(userId);
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login")
}
