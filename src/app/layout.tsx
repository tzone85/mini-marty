import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mini-marty.vercel.app",
  ),
  title: { default: "Mini Marty", template: "%s · Mini Marty" },
  description:
    "Virtual programming environment for the Marty robot — code in Python or visual blocks.",
  openGraph: {
    title: "Mini Marty",
    description: "Learn to program by controlling a 3D virtual robot.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  applicationName: "Mini Marty",
  appleWebApp: {
    capable: true,
    title: "Mini Marty",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      </head>
      <body className="antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
