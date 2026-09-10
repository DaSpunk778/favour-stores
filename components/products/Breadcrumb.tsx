import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

export type Crumb = { label: string; href?: string };

// Simple breadcrumb trail. The last crumb renders as plain text (current page).
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-brand transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-gray-900" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast && <FiChevronRight size={14} className="text-gray-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
