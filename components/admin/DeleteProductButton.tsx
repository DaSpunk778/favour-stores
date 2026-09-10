"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { FiTrash2, FiLoader } from "react-icons/fi";

import { deleteProductAction } from "@/app/admin/actions";

// The confirm button lives inside the <form>, so useFormStatus reports the
// delete's pending state (spinner) without threading anything down.
function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
    >
      {pending ? (
        <FiLoader size={13} className="animate-spin" />
      ) : (
        <FiTrash2 size={13} />
      )}
      {pending ? "Deleting…" : "Confirm"}
    </button>
  );
}

// Two-step delete: a quiet "Delete" first, then an inline "Sure?" confirm so a
// stray click can't wipe a product. The confirm submits deleteProductAction.
export default function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${name}`}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        <FiTrash2 size={13} />
        Delete
      </button>
    );
  }

  return (
    <form
      action={deleteProductAction}
      className="inline-flex items-center gap-1.5"
    >
      <input type="hidden" name="id" value={id} />
      <span className="text-xs text-gray-500">Sure?</span>
      <ConfirmButton />
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100"
      >
        Cancel
      </button>
    </form>
  );
}
