"use client";

import { useId } from "react";

// Small, consistent form primitives for the admin dashboard. Styling matches
// the store's inputs (see components/auth/AuthField) but tuned for a clean
// dashboard: a text/number/date field, a select, a textarea, and a toggle.
// Kept here so every admin form looks the same and there's one place to change.

const inputBase =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all";

function inputCls(error?: string) {
  return `${inputBase} ${
    error
      ? "border-red-400 ring-2 ring-red-100 focus:border-red-500"
      : "border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
  }`;
}

function Label({
  id,
  children,
  required,
}: {
  id: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

function HintOrError({
  id,
  hint,
  error,
}: {
  id: string;
  hint?: string;
  error?: string;
}) {
  if (error)
    return (
      <p id={`${id}-error`} className="text-xs font-medium text-red-500">
        {error}
      </p>
    );
  if (hint) return <p className="text-xs text-gray-500">{hint}</p>;
  return null;
}

type TextFieldProps = {
  label: string;
  name: string;
  type?: "text" | "url" | "date" | "number";
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  min?: number;
  step?: number | string;
  list?: string;
  inputMode?: "text" | "numeric" | "decimal";
};

export function TextField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  hint,
  error,
  required,
  min,
  step,
  list,
  inputMode,
}: TextFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label id={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        step={step}
        list={list}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputCls(error)}
      />
      <HintOrError id={id} hint={hint} error={error} />
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  placeholder,
  hint,
  error,
  required,
}: SelectFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label id={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputCls(error)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <HintOrError id={id} hint={hint} error={error} />
    </div>
  );
}

type TextareaFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  rows?: number;
};

export function TextareaField({
  label,
  name,
  defaultValue,
  placeholder,
  hint,
  error,
  rows = 4,
}: TextareaFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label id={id}>{label}</Label>
      <textarea
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputCls(error)} resize-y leading-relaxed`}
      />
      <HintOrError id={id} hint={hint} error={error} />
    </div>
  );
}

type ToggleFieldProps = {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
};

// An on/off switch backed by a real checkbox (submits "on" when checked, just
// like a native checkbox, so the server action reads it the same way).
export function ToggleField({
  label,
  name,
  defaultChecked,
  hint,
}: ToggleFieldProps) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer">
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/30" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </span>
    </label>
  );
}
