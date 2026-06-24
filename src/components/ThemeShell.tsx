import type { ReactNode } from "react";
import type { ThemeKey } from "../data/journey";

export function ThemeShell({ theme, children }: { theme: ThemeKey; children: ReactNode }) {
  return (
    <div className={`theme-shell theme-${theme}`}>
      {children}
      <footer className="site-footer">
        <span>JourneyHil</span>
        <span>A Kuromi-inspired story of growth and memories.</span>
      </footer>
    </div>
  );
}
