"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMyGrade } from "@/lib/myGrade";

// Paths that have no page of their own; Back skips past them.
const PARENT_OVERRIDES: [RegExp, string][] = [
  [/^\/practice\/sight-reading\/[^/]+\/[^/]+$/, "/practice/sight-reading"],
  [/^\/practice\/unit\/[^/]+$/, "/practice/notes"],
];

/** The page one level up: /grades/abrsm/3 → /grades/abrsm. */
function parentOf(path: string): string {
  for (const [re, to] of PARENT_OVERRIDES) if (re.test(path)) return to;
  const up = path.replace(/\/[^/]+\/?$/, "");
  return up || "/";
}

export default function SiteHeader() {
  const path = usePathname();
  const router = useRouter();
  // Pages seen in this tab. If we arrived from inside peanits, Back retraces your steps;
  // if this is the first page (a link, a bookmark), it goes one level up instead of leaving the site.
  const visited = useRef(0);
  useEffect(() => {
    visited.current++;
  }, [path]);

  const mine = useMyGrade();
  // Each tab owns the paths under it; Today also owns the session it starts.
  const links = [
    { href: "/", label: "Today", owns: (p: string) => p === "/" || p.startsWith("/session") },
    { href: "/practice", label: "Practise", owns: (p: string) => p.startsWith("/practice") },
    { href: mine?.href ?? "/grades", label: "My grade", owns: (p: string) => p.startsWith("/grades") },
    { href: "/learn", label: "Library", owns: (p: string) => p.startsWith("/learn") },
    { href: "/settings", label: "Settings", owns: (p: string) => p.startsWith("/settings") },
  ];
  const back = () => (visited.current > 1 ? router.back() : router.push(parentOf(path)));

  return (
    <header className="site-head">
      <div className="wrap">
        <div className="row" style={{ gap: 22, alignItems: "baseline" }}>
          <Link href="/" className="wordmark">
            peanits
          </Link>
          {path !== "/" && (
            <button type="button" className="tbtn" onClick={back}>
              ← Back
            </button>
          )}
        </div>
        <nav className="nav" aria-label="Main">
          {links.map((l) => (
            <Link key={l.label} href={l.href} aria-current={l.owns(path) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
