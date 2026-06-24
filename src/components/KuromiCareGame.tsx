import { Bath, Bed, Gamepad2, GraduationCap, IceCreamBowl, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { assetPaths } from "../data/assets";
import { gameActions, type GameActionId, type ThemeKey } from "../data/journey";
import { applyGameAction, decayStats, initialGameStats, moodForStats, type GameStats } from "../lib/game";

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
          src={theme === "pixel" ? assetPaths.game.kuromiPixel : assetPaths.game.kuromi2d}
          alt={`Kuromi is ${mood}`}
          style={{ left: activeAction ? targetPosition[activeAction] : "48%" }}
        />
        <div className="game-object object-food">Food</div>
        <div className="game-object object-bed">Bed</div>
        <div className="game-object object-bath">Bath</div>
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
    </div>
  );
}
