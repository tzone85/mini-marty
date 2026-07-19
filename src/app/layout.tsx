import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { AppShell } from "@/components/layout/AppShell";
import { AnalyticsProvider } from "./components/Analytics";

export const metadata: Metadata = {
  title: "Mini Marty",
  description: "Visual programming environment for the Marty robot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
