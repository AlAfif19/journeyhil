import { Sparkles } from "lucide-react";
import { assetPaths } from "../data/assets";

const themes = [
  { href: "/theme/magical", title: "Magical", detail: "Dreamy stars, moonlight, and soft Kuromi elegance." },
  { href: "/theme/pixel", title: "Pixel", detail: "A playful profile screen with quest-like memories." },
  { href: "/theme/scrapbook", title: "Scrapbook", detail: "Diary pages, polaroids, stickers, and saved moments." },
];

export function ThemeChooser() {
  return (
    <main className="theme-chooser">
      <section className="chooser-hero">
        <div>
          <span className="theme-kicker">
            <Sparkles aria-hidden="true" size={18} />
            JourneyHil
          </span>
          <h1>Choose Hilfia's journey theme</h1>
          <p>Three complete versions of one Kuromi-inspired story.</p>
        </div>
        <img src={assetPaths.photos.hero} alt="Hilfia Qisthi Amalia" />
      </section>
      <nav className="chooser-grid" aria-label="Theme choices">
        {themes.map((theme) => (
          <a href={theme.href} key={theme.href}>
            <strong>{theme.title}</strong>
            <span>{theme.detail}</span>
          </a>
        ))}
      </nav>
    </main>
  );
}
