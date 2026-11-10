import { useEffect, useState } from "react";

/** True when the visitor's computer is set to dark mode (the site follows it). */
export function useDark() {
  const q = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const [dark, setDark] = useState(!!q?.matches);
  useEffect(() => {
    if (!q) return;
    const on = (e) => setDark(e.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return dark;
}
