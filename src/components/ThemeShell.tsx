import { Pause, Play, SkipForward } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { ThemeKey } from "../data/journey";

const soundtrack = [
  {
    title: "Kyurukyun Mode",
    src: "/assets/audio/kuromi-kyurukyunn-mode.mpeg",
  },
  {
    title: "Greedy Greedy",
    src: "/assets/audio/kuromi-greedy-greedy.mpeg",
  },
] as const;

export function ThemeShell({ theme, children }: { theme: ThemeKey; children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrack = soundtrack[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false));
    }
  }, [trackIndex]);

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }

  function playNext() {
    setTrackIndex((current) => (current + 1) % soundtrack.length);
    setIsPlaying(true);
  }

  return (
    <div className={`theme-shell theme-${theme}`}>
      <div className="music-player" aria-label="Kuromi soundtrack player">
        <audio ref={audioRef} src={currentTrack.src} onEnded={playNext} loop={false} preload="metadata" />
        <button type="button" onClick={togglePlayback} aria-label={isPlaying ? "Pause soundtrack" : "Play soundtrack"}>
          {isPlaying ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}
        </button>
        <span>{currentTrack.title}</span>
        <button type="button" onClick={playNext} aria-label="Next soundtrack">
          <SkipForward aria-hidden="true" size={18} />
        </button>
      </div>
      {children}
      <footer className="site-footer">
        <span>JourneyHil</span>
        <span>A Kuromi-inspired story of growth and memories.</span>
      </footer>
    </div>
  );
}
