import { Bath, Bed, Gamepad2, GraduationCap, IceCreamBowl, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { assetPaths, gameObjectAssets, kuromiMoodSprites } from "../data/assets";
import { gameActions, type GameActionId, type ThemeKey } from "../data/journey";
import { applyGameAction, decayStats, initialGameStats, moodForStats, type GameMood, type GameStats } from "../lib/game";

const actionIcon = {
  eat: IceCreamBowl,
  sleep: Bed,
  bath: Bath,
  play: Gamepad2,
  study: GraduationCap,
} satisfies Record<GameActionId, typeof Sparkles>;

const targetPosition = {
  eat: "16%",
  sleep: "76%",
  bath: "58%",
  play: "36%",
  study: "68%",
} satisfies Record<GameActionId, string>;

const actionSprite = {
  eat: kuromiMoodSprites.eat,
  sleep: kuromiMoodSprites.sleepy,
  bath: kuromiMoodSprites.dirty,
  play: kuromiMoodSprites.play,
  study: kuromiMoodSprites.idle,
} satisfies Record<GameActionId, string>;

const moodSprite = {
  happy: kuromiMoodSprites.happy,
  sad: kuromiMoodSprites.sad,
  sleepy: kuromiMoodSprites.sleepy,
  dirty: kuromiMoodSprites.dirty,
  angry: kuromiMoodSprites.angry,
} satisfies Record<GameMood, string>;

const statLabels: { key: keyof Omit<GameStats, "experience">; label: string }[] = [
  { key: "hunger", label: "Hunger" },
  { key: "energy", label: "Energy" },
  { key: "cleanliness", label: "Cleanliness" },
  { key: "happiness", label: "Happiness" },
];

export function KuromiCareGame({ theme }: { theme: ThemeKey }) {
  const [stats, setStats] = useState<GameStats>(initialGameStats);
  const [activeAction, setActiveAction] = useState<GameActionId | null>(null);
  const mood = useMemo(() => moodForStats(stats), [stats]);
  const currentSprite = activeAction ? actionSprite[activeAction] : moodSprite[mood];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStats((current) => decayStats(current));
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  function handleAction(actionId: GameActionId) {
    setActiveAction(actionId);
    window.setTimeout(() => {
      setStats((current) => applyGameAction(current, actionId));
      setActiveAction(null);
    }, 380);
  }

  return (
    <div className={`kuromi-game kuromi-game-${theme}`}>
      <div className="game-heading">
        <span>Kuromi Care</span>
        <strong>{mood}</strong>
      </div>

      <div className="game-stage" aria-label="Kuromi room game area">
        <img className="room-art" src={assetPaths.game.room} alt="" aria-hidden="true" />
        <img
          className={`kuromi-sprite mood-${mood} ${activeAction ? "is-moving" : ""}`}
          src={currentSprite}
          alt={`Kuromi is ${mood}`}
          style={{ left: activeAction ? targetPosition[activeAction] : "48%" }}
        />
        <button className="game-object object-food" type="button" onClick={() => handleAction("eat")}>
          <img src={assetPaths.game.strawberry} alt="" />
          <span>Food</span>
        </button>
        <button className="game-object object-bed" type="button" onClick={() => handleAction("sleep")}>
          <img src={assetPaths.game.bed} alt="" />
          <span>Bed</span>
        </button>
        <button className="game-object object-bath" type="button" onClick={() => handleAction("bath")}>
          <img src={assetPaths.game.bathtub} alt="" />
          <span>Bath</span>
        </button>
      </div>

      <div className="stat-grid" aria-label="Kuromi care stats">
        {statLabels.map((stat) => (
          <div className="stat-row" key={stat.key}>
            <span>{stat.label}</span>
            <div className="stat-track" aria-hidden="true">
              <span style={{ width: `${stats[stat.key]}%` }} />
            </div>
            <strong>{stats[stat.key]}</strong>
          </div>
        ))}
        <div className="stat-row stat-experience">
          <span>Experience</span>
          <div className="stat-track" aria-hidden="true">
            <span style={{ width: `${stats.experience}%` }} />
          </div>
          <strong>{stats.experience}</strong>
        </div>
      </div>

      <div className="action-grid">
        {gameActions.map((action) => {
          const Icon = actionIcon[action.id];
          return (
            <button
              className={activeAction === action.id ? "active" : ""}
              key={action.id}
              type="button"
              onClick={() => handleAction(action.id)}
            >
              <Icon aria-hidden="true" size={18} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
      <div className="game-inventory" aria-label="Kuromi room object inventory">
        {gameObjectAssets.map((asset) => (
          <figure key={asset.src}>
            <img src={asset.src} alt="" loading="lazy" />
            <figcaption>{asset.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
