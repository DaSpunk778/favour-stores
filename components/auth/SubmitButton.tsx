"use client";

import { useFormStatus } from "react-dom";
import { FiLoader } from "react-icons/fi";

// Uses the form's pending status so we don't need to thread `pending` down
// from useActionState. Must be rendered inside the <form> it submits.
export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand text-white text-sm font-semibold py-3 shadow-lg shadow-brand/20 transition-all hover:bg-brand-dark active:translate-y-px disabled:opacity-60 disabled:pointer-events-none"
    >
      {pending && <FiLoader size={16} className="animate-spin" />}
      {pending ? "Please wait…" : children}
    </button>
  );
}
