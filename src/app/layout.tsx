import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: "peanits · free sight-reading for pianists", template: "%s · peanits" },
  description:
    "Free sight-reading practice for pianists. Play the note you see; peanits listens through your microphone or MIDI keyboard. Graded lessons, guides and history.",
};

// Runs before first paint so there is no flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('peanits-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={garamond.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
        <footer className="site-foot">
          <div className="wrap">
            Free, forever. Made by Yirschen.
            <br />
            Everything runs in your browser; your audio never leaves your device.
          </div>
        </footer>
      </body>
    </html>
  );
}
