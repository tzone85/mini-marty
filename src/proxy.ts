import { NextResponse, type NextRequest } from "next/server";

export function proxy(_req: NextRequest) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://cdn.jsdelivr.net https://*.ingest.sentry.io https://vitals.vercel-insights.com",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const res = NextResponse.next();
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons).*)"],
};
