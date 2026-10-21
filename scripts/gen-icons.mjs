// One-off generator for the app icons (install, Dock, home screen). Run: node scripts/gen-icons.mjs
// A crotchet in ink on cream paper. Output is committed to public/.
import { writeFileSync } from "node:fs";
import { createElement as h } from "react";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

const PAPER = "#eaddcb";
const INK = "#2b241f";

// The note sits inside the central 80% so "maskable" crops (circles, squircles) never cut it.
const note = h(
  "svg",
  { width: "100%", height: "100%", viewBox: "0 0 100 100" },
  h("ellipse", { cx: 43, cy: 68, rx: 13, ry: 9.5, transform: "rotate(-22 43 68)", fill: INK }),
  h("rect", { x: 51.6, y: 22, width: 4.2, height: 44, rx: 1.5, fill: INK }),
);

async function icon(size, file) {
  const img = new ImageResponse(
    h("div", { style: { width: "100%", height: "100%", display: "flex", background: PAPER } }, note),
    { width: size, height: size },
  );
  writeFileSync(new URL(`../public/${file}`, import.meta.url), Buffer.from(await img.arrayBuffer()));
  console.log(`public/${file}`);
}

await icon(192, "icon-192.png");
await icon(512, "icon-512.png");
await icon(180, "apple-touch-icon.png");
