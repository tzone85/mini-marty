"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white p-0 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
