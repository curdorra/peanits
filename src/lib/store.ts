"use client";

import { useSyncExternalStore } from "react";

/** A tiny localStorage-backed store usable with useSyncExternalStore. */
export function createStore<T extends object>(key: string, initial: T) {
  let cache: T = initial;
  let raw: string | null = null;
  const listeners = new Set<() => void>();

  function read(): T {
    if (typeof window === "undefined") return initial;
    let r: string | null = null;
    try {
      r = localStorage.getItem(key);
    } catch {}
    if (r === raw) return cache;
    raw = r;
    try {
      cache = r ? { ...initial, ...JSON.parse(r) } : initial;
    } catch {
      cache = initial;
    }
    return cache;
  }

  function write(next: T) {
    raw = JSON.stringify(next);
    cache = next;
    try {
      localStorage.setItem(key, raw);
    } catch {}
    listeners.forEach((l) => l());
  }

  function subscribe(l: () => void) {
    listeners.add(l);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) l();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  }

  return {
    get: read,
    set: write,
    update: (fn: (s: T) => T) => write(fn(read())),
    reset: () => write(initial),
    use: () => useSyncExternalStore(subscribe, read, () => initial),
  };
}
