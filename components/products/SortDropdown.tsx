"use client";

import { Select } from "@base-ui/react/select";
import { FiChevronDown, FiCheck } from "react-icons/fi";

import { sortOptions, type SortKey } from "./types";

// A dropdown rendered and styled by the site itself (Base UI), not the
// browser's native <select> popup — so it looks the same on every OS and
// matches the store's design. Keyboard/focus/typeahead handled by Base UI.
export default function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (next: SortKey) => void;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="hidden shrink-0 sm:inline">Sort by</span>
      <Select.Root
        items={sortOptions}
        value={value}
        onValueChange={(next) => {
          if (next) onChange(next as SortKey);
        }}
      >
        <Select.Trigger className="flex min-w-[9.5rem] cursor-pointer select-none items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none transition-colors hover:border-gray-300 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 data-[popup-open]:border-brand data-[popup-open]:ring-2 data-[popup-open]:ring-brand/20">
          <Select.Value />
          <Select.Icon className="text-gray-400 transition-transform duration-200 data-[popup-open]:rotate-180">
            <FiChevronDown size={16} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            className="z-50 outline-none"
            sideOffset={6}
            alignItemWithTrigger={false}
          >
            <Select.Popup className="min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 text-sm text-gray-900 shadow-lg shadow-black/5 outline-none transition-[transform,opacity] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
              {sortOptions.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className="grid cursor-pointer select-none grid-cols-[1.1rem_1fr] items-center gap-2 px-3 py-2 outline-none data-[selected]:font-semibold data-highlighted:bg-brand/10 data-highlighted:text-brand-dark"
                >
                  <Select.ItemIndicator className="col-start-1 text-brand">
                    <FiCheck size={15} />
                  </Select.ItemIndicator>
                  <Select.ItemText className="col-start-2">
                    {opt.label}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
