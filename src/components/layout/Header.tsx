"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { HelpMenu } from "@/features/docs/components/HelpMenu";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-6">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          Mini Marty
        </span>
        <nav>
          <ul className="flex gap-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    pathname === item.path
                      ? "font-semibold text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <HelpMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}
