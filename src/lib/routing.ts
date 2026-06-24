import type { ThemeKey } from "../data/journey";

export type AppRoute = { kind: "chooser" } | { kind: "theme"; theme: ThemeKey } | { kind: "not-found" };

export function resolveRoute(pathname: string): AppRoute {
  if (pathname === "/" || pathname === "") return { kind: "chooser" };
  if (pathname === "/theme/magical") return { kind: "theme", theme: "magical" };
  if (pathname === "/theme/pixel") return { kind: "theme", theme: "pixel" };
  if (pathname === "/theme/scrapbook") return { kind: "theme", theme: "scrapbook" };
  return { kind: "not-found" };
}
