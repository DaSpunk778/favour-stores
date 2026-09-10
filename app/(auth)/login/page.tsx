"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FiMail, FiLock, FiCheckCircle } from "react-icons/fi";
import { loginAction, type AuthState } from "@/app/actions/auth";
import AuthField from "@/components/auth/AuthField";
import SubmitButton from "@/components/auth/SubmitButton";
import { TiShoppingCart } from "react-icons/ti";

const initialState: AuthState = { ok: false };

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-black/5 ring-1 ring-inset ring-white/50 p-7 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-4xl bg-brand/10 text-brand ring-1 ring-inset ring-brand/20">
            <TiShoppingCart size={36} />
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to continue shopping with Favour Stores.
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
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            icon={<FiMail size={16} />}
            defaultValue={state.values?.email}
            error={state.errors?.email}
          />

          <div>
            <AuthField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              icon={<FiLock size={16} />}
              error={state.errors?.password}
            />
            <div className="mt-1.5 text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-brand hover:text-brand-dark transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <SubmitButton>Sign in</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
