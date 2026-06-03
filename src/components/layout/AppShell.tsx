"use client";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { SkipLink } from "@/components/system/SkipLink";
import { AttributionFooter } from "./AttributionFooter";

export function AppShell({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <SkipLink />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          id="main"
          tabIndex={-1}
          className="flex-1 overflow-y-auto bg-white p-0 focus:outline-none dark:bg-gray-900"
        >
          {children}
        </main>
      </div>
      <AttributionFooter />
    </div>
  );
}
