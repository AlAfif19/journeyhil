import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { ThemeKey } from "../data/journey";

const themeLabels: Record<ThemeKey, string> = {
  magical: "Magical",
  pixel: "Pixel",
  scrapbook: "Scrapbook",
};

export function ThemeShell({ theme, children }: { theme: ThemeKey; children: ReactNode }) {
  return (
    <div className={`theme-shell theme-${theme}`}>
      <header className="site-nav" aria-label="Theme navigation">
        <a className="brand-mark" href="/">
          <Sparkles aria-hidden="true" size={18} />
          <span>JourneyHil</span>
        </a>
        <nav className="theme-links">
          {(Object.keys(themeLabels) as ThemeKey[]).map((key) => (
            <a key={key} className={key === theme ? "active" : ""} href={`/theme/${key}`}>
              {themeLabels[key]}
            </a>
          ))}
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <span>JourneyHil</span>
        <span>A Kuromi-inspired story of growth and memories.</span>
      </footer>
    </div>
  );
}
