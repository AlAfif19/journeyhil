import { KuromiCareGame } from "../components/KuromiCareGame";
import { AboutSection, GallerySection, HeroSection, StorySection, TimelineSection } from "../components/sections";
import { ThemeShell } from "../components/ThemeShell";
import type { ThemeKey } from "../data/journey";

export function ThemePage({ theme }: { theme: ThemeKey }) {
  return (
    <ThemeShell theme={theme}>
      <HeroSection theme={theme} />
      <AboutSection theme={theme} />
      <StorySection theme={theme} />
      <TimelineSection theme={theme} />
      <GallerySection theme={theme} />
      <section id="game" className="section-wrap">
        <KuromiCareGame theme={theme} />
      </section>
    </ThemeShell>
  );
}
