"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSidebarSections } from "@/lib/sidebar-config";

export function Sidebar() {
  const pathname = usePathname();
  const sections = getSidebarSections(pathname);

  return (
    <aside className="w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {section.title}
          </h3>
          <ul className="space-y-1">
            {section.items.map((item) =>
              item.href ? (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block cursor-pointer rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li
                  key={item.label}
                  className="cursor-default rounded px-2 py-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  {item.label}
                </li>
              ),
            )}
          </ul>
        </div>
      ))}
    </aside>
  );
}
