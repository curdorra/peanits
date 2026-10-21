import type { MetadataRoute } from "next";

// Makes peanits installable as an app (Chrome and Edge: the install icon in the address bar;
// Safari: File › Add to Dock). Installed from Chrome or Edge, the app can use a MIDI keyboard.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "peanits · sight-reading for pianists",
    short_name: "peanits",
    description: "Free sight-reading practice for pianists. Play the note you see; peanits listens.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#eaddcb",
    theme_color: "#eaddcb",
    categories: ["education", "music"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
