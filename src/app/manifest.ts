import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mini Marty",
    short_name: "Mini Marty",
    description: "Virtual programming environment for the Marty robot",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1220",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
