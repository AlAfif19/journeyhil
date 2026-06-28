import { ArrowDown, Gamepad2, Heart, Instagram, MapPin, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { assetPaths } from "../data/assets";
import {
  GALLERY_BATCH_SIZE,
  galleryItems,
  initialGalleryItems,
  journeyProfile,
  storyBeats,
  themeOverlays,
  timelineItems,
  type ThemeKey,
} from "../data/journey";

const themeCopy: Record<ThemeKey, { label: string; storyTitle: string; timelineTitle: string }> = {
  magical: {
    label: "Magical Kuromi Journey",
    storyTitle: "A constellation of little memories",
    timelineTitle: "Journey phases",
  },
  pixel: {
    label: "Pixel Kuromi House Adventure",
    storyTitle: "Quest log",
    timelineTitle: "Level map",
  },
  scrapbook: {
    label: "Elegant Scrapbook Kuromi",
    storyTitle: "Diary notes",
    timelineTitle: "Saved pages",
  },
};

export function HeroSection({ theme }: { theme: ThemeKey }) {
  return (
    <section className="hero-section" id="top">
      <DecorativeOverlays theme={theme} area="hero" />
      <div className="hero-copy">
        <span className="theme-kicker">
          <Sparkles aria-hidden="true" size={18} />
          {themeCopy[theme].label}
        </span>
        <h1>Journey of Hilfia Qisthi Amalia</h1>
        <p>A beautiful story of growth and memories</p>
        <div className="hero-actions">
          <a href="#journey">
            <ArrowDown aria-hidden="true" size={18} />
            Explore journey
          </a>
          <a href="#game">
            <Gamepad2 aria-hidden="true" size={18} />
            Play Kuromi game
          </a>
        </div>
      </div>
      <figure className="hero-photo-frame">
        <img src={assetPaths.photos.hero} alt="Hilfia Qisthi Amalia in a black outfit" decoding="async" />
      </figure>
    </section>
  );
}

export function AboutSection({ theme }: { theme: ThemeKey }) {
  return (
    <section className="section-wrap about-section" id="about">
      <div className="section-heading">
        <span>{theme === "pixel" ? "Profile card" : "About Hilfia"}</span>
        <h2>{journeyProfile.name}</h2>
      </div>
      <div className="about-grid">
        <article className="profile-card">
          <img src={assetPaths.photos.clean} alt="Hilfia in a soft portrait" loading="lazy" />
          <div>
            <p>
              <MapPin aria-hidden="true" size={16} />
              {journeyProfile.city}
            </p>
            <p>{journeyProfile.birthDate}</p>
            <p>
              <Instagram aria-hidden="true" size={16} />
              {journeyProfile.instagram}
            </p>
          </div>
        </article>
        <div className="favorite-panel">
          <h3>Favorites</h3>
          <div className="favorite-chips">
            {journeyProfile.favorites.map((favorite) => (
              <span key={favorite}>{favorite}</span>
            ))}
          </div>
          <dl>
            <div>
              <dt>Game</dt>
              <dd>{journeyProfile.favoriteGame}</dd>
            </div>
            <div>
              <dt>Character</dt>
              <dd>{journeyProfile.favoriteCharacter}</dd>
            </div>
            <div>
              <dt>Hobby</dt>
              <dd>{journeyProfile.hobby}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function StorySection({ theme }: { theme: ThemeKey }) {
  return (
    <section className="section-wrap story-section" id="journey">
      <div className="section-heading">
        <span>{themeCopy[theme].storyTitle}</span>
        <h2>How the story grew closer</h2>
      </div>
      <div className="story-list">
        {storyBeats.map((beat, index) => (
          <article key={beat} className="story-note">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{beat}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TimelineSection({ theme }: { theme: ThemeKey }) {
  return (
    <section className="section-wrap timeline-section" id="timeline" data-theme={theme}>
      <div className="section-heading">
        <span>{themeCopy[theme].timelineTitle}</span>
        <h2>From school, campus, organizations, and memories</h2>
      </div>
      <div className="timeline-path">
        {timelineItems.map((item, index) => (
          <article className={`timeline-event timeline-event-${index + 1}`} key={`${item.phase}-${item.title}`}>
            <div className="timeline-node">
              <span>{index + 1}</span>
            </div>
            <figure className={`timeline-media timeline-media-${index + 1}`}>
              <img src={item.image} alt={`Dokumentasi ${item.title}`} loading="lazy" decoding="async" />
            </figure>
            <div className="timeline-copy">
              <span>{item.phase}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function GallerySection({ theme }: { theme: ThemeKey }) {
  const scrollboxRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(initialGalleryItems.length);
  const visibleItems = useMemo(() => galleryItems.slice(0, visibleCount), [visibleCount]);
  const loopItems = useMemo(() => visibleItems.slice(0, Math.min(6, visibleItems.length)), [visibleItems]);
  const hasMoreItems = visibleCount < galleryItems.length;

  useEffect(() => {
    const scrollbox = scrollboxRef.current;
    if (!scrollbox || visibleItems.length < 8 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const intervalId = window.setInterval(() => {
      const loopPoint = scrollbox.scrollHeight / 2;
      if (scrollbox.scrollTop >= loopPoint - scrollbox.clientHeight) {
        scrollbox.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      scrollbox.scrollBy({ top: Math.max(220, scrollbox.clientHeight * 0.42), behavior: "smooth" });
    }, 2_600);

    return () => window.clearInterval(intervalId);
  }, [visibleItems.length]);

  return (
    <section className="section-wrap gallery-section" id="gallery">
      <DecorativeOverlays theme={theme} area="gallery" />
      <div className="section-heading">
        <span>{theme === "scrapbook" ? "Polaroid memories" : theme === "pixel" ? "Inventory album" : "Floating gallery"}</span>
        <h2>Photos, activities, and saved assets in one story wall</h2>
      </div>
      <div className="gallery-scrollbox" aria-label="Complete photo archive" ref={scrollboxRef}>
        <div className="gallery-masonry">
          {[...visibleItems, ...loopItems].map((item, index) => (
            <GalleryCard item={item} key={`${item.src}-${item.caption}-${index}`} />
          ))}
        </div>
      </div>
      {hasMoreItems ? (
        <button
          type="button"
          className="gallery-load-more"
          onClick={() => setVisibleCount((current) => Math.min(current + GALLERY_BATCH_SIZE, galleryItems.length))}
        >
          More memories
        </button>
      ) : null}
    </section>
  );
}

function GalleryCard({ item, compact = false }: { item: (typeof galleryItems)[number]; compact?: boolean }) {
  return (
    <figure className={`gallery-card ${compact ? "gallery-card-compact" : ""}`}>
      {item.kind === "video" ? (
        <video src={item.src} aria-label={item.alt} muted loop playsInline preload="none" />
      ) : (
        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
      )}
      <figcaption>
        <Heart aria-hidden="true" size={15} />
        {item.caption}
      </figcaption>
    </figure>
  );
}

function DecorativeOverlays({ theme, area }: { theme: ThemeKey; area: "hero" | "gallery" }) {
  return (
    <div className={`decorative-overlays decorative-overlays-${area}`} aria-hidden="true">
      {themeOverlays[theme].map((src, index) => (
        <img
          className={`overlay-asset overlay-asset-${index + 1}`}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          key={`${src}-${area}`}
        />
      ))}
    </div>
  );
}
