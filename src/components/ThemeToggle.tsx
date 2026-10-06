"use client";

export default function ThemeToggle() {
  function flip() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("peanits-theme", next);
    } catch {}
  }
  return (
    <button className="tbtn" onClick={flip} aria-label="Switch between light and dark theme">
      Light / Dark
    </button>
  );
}
