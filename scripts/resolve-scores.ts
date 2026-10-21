// Finds the IMSLP page for every piece we link to. Run: node scripts/resolve-scores.ts
// Output (src/content/scores.json) is committed, so the site never searches IMSLP at runtime.
// A piece maps to its work page when IMSLP has one; otherwise the link falls back to the composer's page.
// Pieces listed in OVERRIDES are checked by hand and skip the search.
import { writeFileSync } from "node:fs";
import { BOARDS } from "../src/content/boards.ts";
import { COMPOSERS } from "../src/content/composers.ts";

const OVERRIDES: Record<string, string> = {
  "Jean-Philippe Rameau|Les sauvages (from Pièces de clavecin)": "Nouvelles suites de pièces de clavecin, RCT 5-6 (Rameau, Jean-Philippe)",
  "Jean-Philippe Rameau|Les sauvages": "Nouvelles suites de pièces de clavecin, RCT 5-6 (Rameau, Jean-Philippe)",
  "Jean-Philippe Rameau|Les cyclopes": "Pièces de clavecin avec une méthode, RCT 2-4 (Rameau, Jean-Philippe)",
  "François Couperin|Les coucous bénévoles": "Pièces de clavecin, Livre 3 (Couperin, François)",
  "François Couperin|Les petits moulins à vent (The Little Windmills)": "Pièces de clavecin, Livre 3 (Couperin, François)",
  "François Couperin|Les petits moulins à vent": "Pièces de clavecin, Livre 3 (Couperin, François)",
  // Same works as matched elsewhere, worded differently in the composer pages.
  "Johann Sebastian Bach|Two-Part Invention No. 8 in F": "Invention in F major, BWV 779 (Bach, Johann Sebastian)",
  "Ludwig van Beethoven|German Dance in C": "12 German Dances, WoO 8 (Beethoven, Ludwig van)",
  "Franz Schubert|Moment musical in F minor": "Moments musicaux, D.780 (Schubert, Franz)",
  "Robert Schumann|Of Foreign Lands and Peoples": "Kinderszenen, Op.15 (Schumann, Robert)",
  "Clara Schumann|Scherzo from Quatre pièces fugitives": "4 Pièces fugitives, Op.15 (Schumann, Clara)",
  "Claude Debussy|The Little Shepherd (No. 5 from Children's Corner)": "Children's Corner, CD 119 (Debussy, Claude)",
  "Claude Debussy|The Little Shepherd (Children's Corner)": "Children's Corner, CD 119 (Debussy, Claude)",
  "Béla Bartók|Sorrow (For Children)": "For Children, Sz.42 (Bartók, Béla)",
};

const API = "https://imslp.org/api.php";
const wiki = (title: string) =>
  `https://imslp.org/wiki/${encodeURIComponent(title.replace(/ /g, "_")).replace(/%2C/g, ",").replace(/%3A/g, ":")}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function api(params: Record<string, string>) {
  const q = new URLSearchParams({ format: "json", ...params });
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${API}?${q}`, { headers: { "User-Agent": "peanits score resolver (build script)" } });
    await sleep(300);
    try {
      return JSON.parse(await res.text());
    } catch {
      if (attempt >= 3) throw new Error(`IMSLP did not answer: ${q}`);
      await sleep(3000 * (attempt + 1)); // throttled; back off
    }
  }
}

const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const surnameOf = (name: string) => name.split(" ").pop()!;

/** IMSLP names composers "Surname, Given" with its own spelling; find the category it actually uses. */
async function composerTag(name: string): Promise<string | null> {
  const parts = name.split(" ");
  const surname = parts.pop()!;
  const guess = `${surname}, ${parts.join(" ")}`;
  const hit = await api({ action: "query", titles: `Category:${guess}` });
  if (Object.keys(hit.query.pages).some((k) => Number(k) > 0)) return guess;
  const s = await api({ action: "query", list: "search", srnamespace: "14", srsearch: surname, srlimit: "20" });
  const first = norm(parts[0] ?? "").slice(0, 3);
  return (
    s.query.search
      .map((r: { title: string }) => r.title.replace(/^Category:/, ""))
      .find((t: string) => norm(t).startsWith(norm(surname)) && norm(t).includes(first)) ?? null
  );
}

/** Work pages listed in a composer's category. IMSLP's lists are incomplete, so this only backs up search. */
async function worksOf(tag: string): Promise<string[]> {
  const titles: string[] = [];
  let cont: Record<string, string> = {};
  do {
    const r = await api({ action: "query", list: "categorymembers", cmtitle: `Category:${tag}`, cmlimit: "500", cmnamespace: "0", ...cont });
    titles.push(...r.query.categorymembers.map((m: { title: string }) => m.title));
    cont = r.continue ? { cmcontinue: r.continue.cmcontinue } : {};
  } while (cont.cmcontinue);
  return titles;
}

// Catalogue numbers, written the way IMSLP writes them ("Op.68", "K.545", "BWV 779", "Hob.XVI:35").
const CATALOGUES: [RegExp, (m: RegExpMatchArray) => string[]][] = [
  [/Op\. ?(\d+)(?: No\. ?(\d+))?/, (m) => (m[2] ? [`Op.${m[1]} No.${m[2]}`, `Op.${m[1]}`] : [`Op.${m[1]}`])],
  [/\bKp?\. ?(\d+[a-z]*)/, (m) => [`K.${m[1]}`]],
  [/BWV (\d+)/, (m) => [`BWV ${m[1]}`]],
  [/HWV (\d+)/, (m) => [`HWV ${m[1]}`]],
  [/Hob\. ?([IVX]+[a-z]?:\w+)/, (m) => [`Hob.${m[1]}`]],
  [/\bD\. ?(\d+)/, (m) => [`D.${m[1]}`]],
  [/\bZ\. ?T ?(\d+)/, (m) => [`ZT ${m[1]}`, `Z.T${m[1]}`]],
  [/\bZ\. ?(\d+)/, (m) => [`Z.${m[1]}`, `ZT ${m[1]}`]],
  [/\bS\. ?(\d+)/, (m) => [`S.${m[1]}`]],
  [/Wq\. ?(\d+(?:\/\d+)?)/, (m) => [`Wq.${m[1]}`]],
  [/WoO ?(\d+)/, (m) => [`WoO ${m[1]}`]],
];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Does an IMSLP page title carry this catalogue number, alone or inside a range like "BWV 772-801"? */
function hasCatalogue(page: string, cat: string): boolean {
  const name = page.replace(/\s*\([^()]*\)$/, "");
  if (new RegExp(`${esc(cat)}(?![\\w:]| Anh)`).test(name)) return true;
  const [, prefix, num] = cat.match(/^(.*?)(\d+)$/) ?? [];
  if (!prefix) return false;
  const range = name.match(new RegExp(`${esc(prefix)}(\\d+)[-–](\\d+)`));
  return !!range && +num >= +range[1] && +num <= +range[2];
}

const STOP = new Set(["from", "the", "and", "for", "in", "no", "op", "vol", "movt", "1st", "2nd", "3rd", "4th", "major", "minor", "pieces"]);
/** The significant words of the collection a piece belongs to, or of the piece itself, accents kept (IMSLP's search needs them). */
function keywords(title: string): string[] {
  const from = title.match(/from (?:the )?([^)]+)\)/i)?.[1];
  const base = (from ?? title.replace(/\(.*?\)/g, "")).replace(/,? ?\b(Op|Kp?|BWV|HWV|Hob|D|Z|S|Wq|WoO|KK|Anh)\b\.? ?(?:T ?)?[\dIVX].*$/, "");
  return base
    .split(/[^\p{L}\d]+/u)
    .filter((w) => w.length > 1 && !STOP.has(norm(w)) && !/^[a-g]$/i.test(w));
}

type Hit = { title: string; snippet?: string };

/** "(Schumann, Clara)" is not "(Schumann, Robert)": check the surname and the start of the first given name. */
function byComposer(page: string, name: string): boolean {
  const who = norm(page.match(/\(([^()]*)\)$/)?.[1] ?? "");
  const given = norm(name.split(" ")[0]).slice(0, 3);
  return who.startsWith(norm(surnameOf(name))) && who.split(" ").slice(1).some((w) => w.startsWith(given));
}

/** The key, IMSLP style: "in B♭" → "b flat major"; "in G minor" → "g minor". */
function keyOf(title: string): string | null {
  const m = title.match(/\bin ([A-G])(♭|♯)?( minor)?\b/);
  if (!m) return null;
  return norm(`${m[1]}${m[2] === "♭" ? " flat" : m[2] === "♯" ? " sharp" : ""} ${m[3] ? "minor" : "major"}`);
}
const KEY_IN = /\b([a-g](?: flat| sharp)? (?:major|minor))\b/;

/** Reject pages in another key, or another number of a numbered set ("Consolation 1" for "Consolation No. 5"). */
function consistent(page: string, title: string): boolean {
  const name = norm(page.replace(/\s*\([^()]*\)$/, ""));
  const key = keyOf(title);
  const pageKey = name.match(KEY_IN)?.[1];
  if (key && pageKey && pageKey !== key) return false;
  // Only a set number of its own ("Consolation No. 5"), not the "No." of an opus ("Op. 119 No. 1").
  const no = title.replace(/\(.*?\)/g, "").match(/(?<!(?:Op|IIa|IVb)\. ?\d*\s?)\bNo\. ?(\d+)/)?.[1];
  const pageNo = name.replace(/\bop \d+ no \d+/, "").match(/\bno ?(\d+)\b/)?.[1];
  if (no && pageNo && no !== pageNo) return false;
  return true;
}

async function search(q: string): Promise<Hit[]> {
  const s = await api({ action: "query", list: "search", srsearch: q, srlimit: "20", srprop: "snippet" });
  return s.query.search;
}

async function workPage(name: string, works: string[], title: string): Promise<string | null> {
  const surname = surnameOf(name);
  const words = keywords(title);
  const ids = CATALOGUES.flatMap(([re, f]) => {
    const m = title.match(re);
    return m ? f(m) : [];
  });

  // 1. A catalogue number is the surest match. Search for it with a few short queries (IMSLP needs every word to match).
  for (const id of ids) {
    const queries = [`${id} ${surname}`, `${id.replace(".", ". ")} ${surname}`, `${words.slice(0, 3).join(" ")} ${surname}`];
    for (const q of queries) {
      const hit = (await search(q)).find((r) => byComposer(r.title, name) && hasCatalogue(r.title, id) && consistent(r.title, title));
      if (hit) return hit.title;
    }
    const listed = works.filter((w) => hasCatalogue(w, id) && consistent(w, title)).sort((a, b) => a.length - b.length)[0];
    if (listed) return listed;
  }
  if (ids.length) return null; // it has a number IMSLP doesn't know; a word match would likely be the wrong piece

  // 2. No number: IMSLP's text search knows English alternative titles. Accept a page by this composer
  //    whose title or text mentions most of the words we asked for.
  if (!words.length) return null;
  for (const q of [`${words.join(" ")} ${surname}`, `${words.slice(0, 2).join(" ")} ${surname}`]) {
    for (const r of await search(q)) {
      if (!byComposer(r.title, name) || !consistent(r.title, title)) continue;
      const text = norm(r.title + " " + (r.snippet ?? "").replace(/<[^>]+>/g, ""));
      const key = keyOf(title);
      if (key && !text.includes(key)) continue; // without a catalogue number, the key must be confirmed
      if (words.filter((w) => text.includes(norm(w))).length / words.length >= 0.6) return r.title;
    }
  }
  return null;
}

const pieces = new Map<string, { composer: string; title: string }>();
for (const b of Object.values(BOARDS)) for (const g of b.grades) for (const p of g.pieces) pieces.set(`${p.composer}|${p.title}`, p);
for (const c of COMPOSERS) for (const s of c.start) pieces.set(`${c.name}|${s.title}`, { composer: c.name, title: s.title });

const tags = new Map<string, string | null>();
const works = new Map<string, string[]>();
const out: { composers: Record<string, string>; pieces: Record<string, string> } = { composers: {}, pieces: {} };
let found = 0;

for (const [key, p] of pieces) {
  if (!tags.has(p.composer)) {
    const t = await composerTag(p.composer);
    tags.set(p.composer, t);
    if (t) {
      out.composers[p.composer] = wiki(`Category:${t}`);
      works.set(t, await worksOf(t));
    } else console.warn(`No IMSLP composer page for ${p.composer}`);
  }
  const tag = tags.get(p.composer);
  const page = OVERRIDES[key] ?? (await workPage(p.composer, tag ? works.get(tag)! : [], p.title));
  if (page) {
    out.pieces[key] = wiki(page);
    found++;
    console.log(`✓ ${p.composer} – ${p.title}  →  ${page}`);
  } else console.log(`· composer page only: ${p.composer} – ${p.title}`);
}

writeFileSync(new URL("../src/content/scores.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(`\n${found} of ${pieces.size} pieces have a direct IMSLP page; ${Object.keys(out.composers).length} composer pages.`);
