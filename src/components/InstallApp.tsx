"use client";

import { useEffect, useState } from "react";

// Chrome and Edge fire this when the site can be installed; it isn't in the DOM typings.
type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

let deferred: InstallPrompt | null = null;
const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // we show our own button instead of the browser's mini-bar
    deferred = e as InstallPrompt;
    listeners.forEach((l) => l());
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    listeners.forEach((l) => l());
  });
}

type Env = { installed: boolean; safari: boolean; ios: boolean };

function detect(): Env {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  return {
    installed: matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true,
    safari: /Safari\//.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua),
    ios,
  };
}

/** "Get the app": an install button where the browser offers one, and honest instructions where it doesn't. */
export default function InstallApp() {
  const [env, setEnv] = useState<Env | null>(null);
  const [canPrompt, setCanPrompt] = useState(false);

  useEffect(() => {
    const sync = () => {
      setEnv(detect());
      setCanPrompt(!!deferred);
    };
    sync();
    listeners.add(sync);
    return () => void listeners.delete(sync);
  }, []);

  if (!env) return null;

  if (env.installed) {
    return <p className="muted">You&apos;re using the peanits app. Updates arrive by themselves.</p>;
  }

  if (canPrompt) {
    return (
      <div className="stack" style={{ gap: 12, alignItems: "flex-start" }}>
        <p className="muted" style={{ maxWidth: "52ch" }}>
          Install peanits as an app: its own window and Dock or taskbar icon, it opens offline, and MIDI keyboards work.
        </p>
        <button
          className="btn solid"
          onClick={async () => {
            await deferred?.prompt();
            deferred = null;
            setCanPrompt(false);
          }}
        >
          <span>Install peanits</span>
        </button>
      </div>
    );
  }

  if (env.ios) {
    return (
      <p className="muted" style={{ maxWidth: "52ch" }}>
        Tap Share, then <b>Add to Home Screen</b>. The app works with the microphone and on-screen keys; Apple doesn&apos;t let
        websites or web apps on iPhone and iPad use MIDI keyboards.
      </p>
    );
  }

  if (env.safari) {
    return (
      <div className="stack" style={{ gap: 10 }}>
        <p className="muted" style={{ maxWidth: "56ch" }}>
          <b>With a MIDI keyboard:</b> open peanits in Chrome or Edge, then click the install icon at the right of the address bar
          (or ⋮ › Cast, save and share › Install). You get a peanits app in your Dock that works with MIDI. Your progress doesn&apos;t
          move across browsers, so start fresh there.
        </p>
        <p className="muted" style={{ maxWidth: "56ch" }}>
          <b>With the microphone only:</b> in Safari, choose File › Add to Dock. Safari can&apos;t use MIDI keyboards, even as an app.
        </p>
      </div>
    );
  }

  return (
    <p className="muted" style={{ maxWidth: "52ch" }}>
      Look for an install icon at the right of your address bar, or Install in the browser menu. If there isn&apos;t one, peanits works
      just as well here in the browser.
    </p>
  );
}
