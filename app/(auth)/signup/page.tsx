"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiCheckCircle} from "react-icons/fi";
import { signupAction, type AuthState } from "@/app/actions/auth";
import AuthField from "@/components/auth/AuthField";
import SubmitButton from "@/components/auth/SubmitButton";
import { TiShoppingCart } from "react-icons/ti";

const initialState: AuthState = { ok: false };

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-black/5 ring-1 ring-inset ring-white/50 p-7 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-4xl bg-brand/10 text-brand ring-1 ring-inset ring-brand/20">
            <TiShoppingCart size={36} />
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Join Favour Stores for faster checkout and order tracking.
          </p>
        </div>

        {state.ok && state.message && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm font-medium text-brand-dark">
            <FiCheckCircle size={16} className="shrink-0" />
            {state.message}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <AuthField
            label="Full name"
            name="name"
            type="text"
            placeholder="Ada Obi"
            autoComplete="name"
            icon={<FiUser size={16} />}
            defaultValue={state.values?.name}
            error={state.errors?.name}
          />

          <AuthField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            icon={<FiMail size={16} />}
            defaultValue={state.values?.email}
            error={state.errors?.email}
          />

          <AuthField
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            icon={<FiLock size={16} />}
            error={state.errors?.password}
          />

          <AuthField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            icon={<FiLock size={16} />}
            error={state.errors?.confirmPassword}
          />

          <div className="flex flex-col gap-1">
            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="terms"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand accent-brand focus:ring-brand/30"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-medium text-brand hover:text-brand-dark">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-brand hover:text-brand-dark">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {state.errors?.terms && (
              <p className="text-xs font-medium text-red-500">{state.errors.terms}</p>
            )}
          </div>

          <SubmitButton>Create account</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
