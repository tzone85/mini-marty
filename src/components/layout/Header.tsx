"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="text-2xl" aria-hidden="true">
            🤖
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Mini Marty
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex gap-4">
            {NAV_ITEMS.map((item) => {
              const current = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center gap-1 rounded px-1 text-sm transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-blue-400 ${
                      current
                        ? "font-semibold text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <span className="text-base" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <ThemeToggle />
    </header>
  );
}
