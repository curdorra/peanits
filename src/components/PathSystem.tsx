import { createPen, hlPath } from "@/lib/pencil";
import type { Unit } from "@/lib/curriculum";

const M = 150; // measure width
const L = 44; // left margin (brace + barline)
const R = 16;
const YS = [40, 50, 60, 70, 80];

type Pen = ReturnType<typeof createPen>;
const CLOUD = "M30,30 c0,-7 9,-8 12,-3 c3,-6 13,-4 12,3 z";

// Each scene lives in a 150-wide measure and is drawn across the five staff lines.
const SCENES: ((p: Pen) => string)[] = [
  (p) =>
    p.curve("M0,74 C25,56 55,56 80,72 S125,62 150,76") +
    '<path class="pn2" d="M0,88 C40,82 90,92 150,86"/>' +
    p.curve("M96,40 a12,12 0 0 1 24,0") + p.curve("M101,40 a7,7 0 0 1 14,0") + p.curve(CLOUD),
  (p) =>
    p.poly([[0, 80], [30, 52], [48, 66], [78, 38], [110, 76], [126, 64], [150, 80]], 0.5) +
    [52, 58, 64, 70].map((y, i) => p.line(88 + i * 4, y, 104 - i * 1.5, y, "hh", 0.3)).join("") +
    p.curve("M70,38 l-5,8 l5,-2 l3,5 l4,-5 l3,2 z") + p.curve("M96,24 q5,-5 10,0 q5,-5 10,0"),
  (p) =>
    p.curve("M0,76 q6,-6 12,0 t12,0 t12,0 t12,0 t12,0 t12,0 t12,0 t12,0") +
    p.poly([[104, 80], [114, 80], [111, 46], [107, 46]], 0.3, true) + p.poly([[105, 46], [113, 46], [109, 38]], 0.3, true) +
    p.line(100, 40, 88, 36, "pn2", 0.3) + p.line(118, 40, 130, 36, "pn2", 0.3) + p.curve("M20,34 q4,-4 8,0 q4,-4 8,0") + p.curve(CLOUD),
  (p) =>
    [18, 44, 70, 100, 126]
      .map((x, i) => p.poly([[x - 9, 80], [x + 9, 80], [x, 56 - (i % 2) * 6]], 0.3, true) + p.line(x, 80, x, 86, "pn", 0.2))
      .join("") + p.line(0, 86, 150, 86, "pn2", 0.8),
  (p) =>
    p.poly([[0, 80], [0, 64], [14, 64], [14, 56], [30, 56], [30, 70], [44, 70], [44, 48], [60, 48], [60, 62], [74, 62], [74, 52], [92, 52], [92, 72], [108, 72], [108, 58], [124, 58], [124, 66], [150, 66], [150, 80]], 0.4) +
    [[22, 62], [22, 66], [50, 54], [50, 58], [82, 58], [116, 64]].map(([x, y]) => p.line(x, y, x + 5, y, "hh", 0.2)).join(""),
];

export default function PathSystem({
  units,
  passed,
  offset,
  label,
}: {
  units: Unit[];
  passed: Record<string, boolean>;
  offset: number; // index of the first unit in the overall curriculum, keeps scenes varied
  label: string;
}) {
  const n = units.length;
  const W = L + M * n + R;
  const pen = createPen(1000 + offset * 97);
  let s = "";
  for (const y of YS) s += pen.line(L, y, L + M * n, y, "st", 0.3);
  for (let i = 0; i <= n; i++) {
    s += `<path class="st${i === n ? " heavy" : ""}" d="${hlPath(L + M * i, 40, L + M * i, 80, pen.next(), 0.3)}"/>`;
  }
  s += `<path class="st" d="M${L - 8},40 C${L - 22},40 ${L - 10},58 ${L - 24},60 C${L - 10},62 ${L - 22},80 ${L - 8},80"/>`;
  units.forEach((u, i) => {
    const x = L + M * i;
    if (passed[u.id]) {
      s += `<g transform="translate(${x},0)">${SCENES[(offset + i) % SCENES.length](createPen(5000 + (offset + i) * 31))}</g>`;
    }
    const cx = x + M / 2;
    s += `<text class="sysl" x="${cx}" y="108">${i + 1}${passed[u.id] ? " ✓" : ""}</text>`;
  });
  return (
    <svg
      className="sys"
      viewBox={`0 0 ${W} 124`}
      role="img"
      aria-label={`${label}: ${units.filter((u) => passed[u.id]).length} of ${n} units complete`}
      style={{ width: "100%", maxWidth: Math.round(W * 1.15), height: "auto", overflow: "visible" }}
      dangerouslySetInnerHTML={{ __html: s }}
    />
  );
}
