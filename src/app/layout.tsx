import Link from "next/link";
import type { Metadata } from "next";
import { EB_Garamond, Noto_Music } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import ThemeToggle from "@/components/ThemeToggle";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Only used for ♭ ♯ ♮ and other music symbols that EB Garamond lacks.
const music = Noto_Music({ variable: "--font-music", weight: "400", subsets: ["music"], adjustFontFallback: false });

export const metadata: Metadata = {
  title: { default: "peanits · free sight-reading for pianists", template: "%s · peanits" },
  description:
    "Free sight-reading practice for pianists. Play the note you see; peanits listens through your microphone or MIDI keyboard. Graded lessons, guides and history.",
};

// Runs before first paint so there is no flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('peanits-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${garamond.variable} ${music.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
        <footer className="site-foot">
          <div className="wrap foot-row">
            <span>Free, forever. Made by Yirschen.</span>
            <Link className="tbtn" href="/about">About</Link>
            <a className="tbtn" href="https://ko-fi.com/yirschen" target="_blank" rel="noopener noreferrer">
              Support on Ko-fi
            </a>
            <ThemeToggle />
          </div>
        </footer>
      </body>
    </html>
  );
}
