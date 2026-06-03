"use client";

import Link from "next/link";

export function HelpMenu() {
  return (
    <Link
      href="/docs"
      className="rounded-md px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
      data-testid="help-menu-link"
      aria-label="Help & Documentation"
    >
      ?
    </Link>
  );
}
