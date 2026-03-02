"use client";

import { usePathname } from "next/navigation";
import { getSidebarItems } from "@/lib/sidebar-config";

export function Sidebar() {
  const pathname = usePathname();
  const items = getSidebarItems(pathname);

  if (items.length === 0) return null;

  return (
    <aside className="w-48 shrink-0 border-r border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <button className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
