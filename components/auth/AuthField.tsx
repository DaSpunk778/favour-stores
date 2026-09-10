"use client";

import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type AuthFieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  icon?: React.ReactNode;
};

// A single labelled input styled to match the store's glassy aesthetic.
// Password fields get a show/hide toggle. Errors render inline and set
// aria-invalid so screen readers announce the problem.
export default function AuthField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  defaultValue,
  error,
  icon,
}: AuthFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [revealed, setRevealed] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border bg-white/70 backdrop-blur px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
            icon ? "pl-10" : ""
          } ${isPassword ? "pr-10" : ""} ${
            error
              ? "border-red-400 ring-2 ring-red-100 focus:border-red-500"
              : "border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {revealed ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
