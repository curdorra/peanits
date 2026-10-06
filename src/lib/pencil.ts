// Hand-drawn stroke helpers. Everything is deterministic (seeded), so server and client
// render identical paths. Classes pn / pn2 / hh are defined in globals.css.
export type Pt = [number, number];

export function rng(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f1 = (n: number) => n.toFixed(1);

/** Catmull-Rom spline through points, as cubic Béziers. */
export function cr(p: Pt[]): string {
  let d = `M${f1(p[0][0])},${f1(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i],
      p1 = p[i],
      p2 = p[i + 1],
      p3 = p[i + 2] || p2;
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return d;
}

/** A slightly wobbly straight line. */
export function hlPath(x1: number, y1: number, x2: number, y2: number, seed: number, j = 0.8): string {
  const r = rng(seed);
  const L = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) || 1;
  const n = Math.max(2, Math.round(L / 24));
  const nx = -(y2 - y1) / L,
    ny = (x2 - x1) / L;
  const p: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n,
      o = (r() - 0.5) * 2 * j;
    p.push([x1 + (x2 - x1) * t + nx * o, y1 + (y2 - y1) * t + ny * o]);
  }
  return cr(p);
}

/** A wobbly ellipse/squircle whose ends overshoot like a pen circling something. Client-only (uses sin/cos). */
export function blobPath(w: number, h: number, n: number, seed: number, j = 1.2): string {
  const r = rng(seed),
    a = w / 2,
    b = h / 2;
  const N = Math.max(14, Math.round((w + h) / 9));
  const t0 = r() * 6.283,
    ph1 = r() * 6.283,
    ph2 = r() * 6.283,
    e = 2 / n;
  const p: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const t = t0 + ((6.283 + 0.35) * i) / N,
      c = Math.cos(t),
      s = Math.sin(t);
    const wob = j * (0.6 * Math.sin(3 * t + ph1) + 0.4 * Math.sin(5 * t + ph2)) + (r() - 0.5) * 0.4;
    p.push([a + a * Math.sign(c) * Math.abs(c) ** e + wob * c, b + b * Math.sign(s) * Math.abs(s) ** e + wob * s]);
  }
  return cr(p);
}

/** A pen with its own seed counter, producing SVG markup strings. */
export function createPen(start = 1) {
  let uid = start;
  const next = () => uid++;
  const line = (x1: number, y1: number, x2: number, y2: number, cls = "pn", j = 0.5) =>
    `<path class="${cls}" d="${hlPath(x1, y1, x2, y2, next(), j)}"/>`;
  const poly = (p: Pt[], j = 0.6, close = false) => {
    let a = "",
      b = "";
    const n = close ? p.length : p.length - 1;
    for (let i = 0; i < n; i++) {
      const [x1, y1] = p[i],
        [x2, y2] = p[(i + 1) % p.length];
      a += hlPath(x1, y1, x2, y2, next(), j) + " ";
      b += hlPath(x1, y1, x2, y2, next(), j * 1.6) + " ";
    }
    return `<path class="pn" d="${a}"/><path class="pn2" d="${b}"/>`;
  };
  const curve = (d: string) => `<path class="pn" d="${d}"/><path class="pn2" d="${d}" transform="translate(.7,-.6)"/>`;
  return { next, line, poly, curve };
}
