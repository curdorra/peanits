"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False while the server-rendered HTML is hydrating, true once browser-only data (localStorage) can be read. */
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);
