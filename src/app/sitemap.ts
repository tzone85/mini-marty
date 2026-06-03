import type { MetadataRoute } from "next";

const ROUTES = [
  "/",
  "/block-editor",
  "/python-editor",
  "/tutorials",
  "/challenges",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mini-marty.vercel.app";
  return ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
