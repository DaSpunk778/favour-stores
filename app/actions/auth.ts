"use server";
//this matters because its where psswd ckecs and hashing, DB queries happens so the server makes the mechanism automatic.



// Auth server actions. Validation-only for now — there's no DB or session
// layer wired up yet, so these validate input server-side and return a typed
// state for `useActionState`. Swap the "// TODO: persist" blocks for real
// Sequelize + session logic once the User model exists.

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
  const email = getString(formData, "email");
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
  return {
    ok: true,
    message: "Signed in successfully. (Backend not wired up yet.)",
    values: { email },
  };
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
  return {
    ok: true,
    message: "Account created successfully. (Backend not wired up yet.)",
    values: { name, email },
  };
}
