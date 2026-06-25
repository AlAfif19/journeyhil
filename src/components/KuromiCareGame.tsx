import { Bath, Bed, Gamepad2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { assetPaths } from "../data/assets";
import type { ThemeKey } from "../data/journey";
import {
  applyFoodItem,
  applyStationAction,
  decayStats,
  foodItems,
  gameStations,
  initialGameState,
  moodForStats,
  resolveKuromiSprite,
  type FoodItemId,
  type GameStationActionId,
  type GameStationId,
  type GameStats,
} from "../lib/game";

const actionIcon = {
  sleep: Bed,
  bath: Bath,
  play: Gamepad2,
} satisfies Record<GameStationActionId, typeof Sparkles>;

const statLabels: { key: keyof Omit<GameStats, "experience">; label: string }[] = [
  { key: "hunger", label: "Hunger" },
  { key: "energy", label: "Energy" },
  { key: "cleanliness", label: "Cleanliness" },
  { key: "happiness", label: "Happiness" },
];

const stationByAction = {
  sleep: "bed",
  bath: "bath",
  play: "toy",
} satisfies Record<GameStationActionId, GameStationId>;

export function KuromiCareGame({ theme }: { theme: ThemeKey }) {
  const [state, setState] = useState(initialGameState);
  const spritePosition = useMemo(
    () => gameStations.find((station) => station.id === state.activeStation)?.spritePosition ?? { x: 50, y: 54 },
    [state.activeStation],
  );
  const currentSprite = resolveKuromiSprite(state);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setState((current) => {
        const stats = decayStats(current.stats);
        return { ...current, stats, mood: moodForStats(stats), activeAction: null, activeStation: null };
      });
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  function clearActionSoon() {
    window.setTimeout(() => {
      setState((current) => ({
        ...current,
        activeAction: null,
        activeStation: null,
        mood: moodForStats(current.stats),
      }));
    }, 580);
  }

  function handleStation(stationId: GameStationId) {
    setState((current) => applyStationAction(current, stationId));
    clearActionSoon();
  }

  function handleFood(foodId: FoodItemId) {
    setState((current) => applyFoodItem(current, foodId));
    clearActionSoon();
  }

  function handleAction(actionId: GameStationActionId) {
    handleStation(stationByAction[actionId]);
  }

  return (
    <div className={`kuromi-game kuromi-game-${theme}`}>
      <div className="game-heading">
        <span>Kuromi Care</span>
        <strong>{state.mood}</strong>
      </div>

      <div className="game-stage" aria-label="Kuromi room game area">
        <img className="room-art" src={assetPaths.game.room} alt="" aria-hidden="true" />
        <img
          className={`kuromi-sprite mood-${state.mood} ${state.activeAction ? "is-moving" : ""}`}
          src={currentSprite}
          alt={`Kuromi is ${state.mood}`}
          style={{ left: `${spritePosition.x}%`, bottom: `${100 - spritePosition.y}%` }}
        />
        {gameStations.map((station) => (
          <button
            className={`station-title station-${station.id} ${state.activeStation === station.id ? "active" : ""}`}
            key={station.id}
            type="button"
            onClick={() => handleStation(station.id)}
            style={{ left: `${station.position.x}%`, top: `${station.position.y}%` }}
          >
            <img src={station.titleAsset} alt={station.label} />
          </button>
        ))}
      </div>

      <div className="food-shelf" aria-label="Food item choices">
        {foodItems.map((food) => (
          <button key={food.id} type="button" onClick={() => handleFood(food.id)}>
            <img src={food.asset} alt="" />
            <span>{food.label}</span>
          </button>
        ))}
      </div>

      <div className="stat-grid" aria-label="Kuromi care stats">
        {statLabels.map((stat) => (
          <div className="stat-row" key={stat.key}>
            <span>{stat.label}</span>
            <div className="stat-track" aria-hidden="true">
              <span style={{ width: `${state.stats[stat.key]}%` }} />
            </div>
            <strong>{state.stats[stat.key]}</strong>
          </div>
        ))}
      </div>

      <div className="action-grid">
        {gameStations.map((station) => {
          const Icon = actionIcon[station.action];
          return (
            <button
              className={state.activeStation === station.id ? "active" : ""}
              key={station.id}
              type="button"
              onClick={() => handleAction(station.action)}
            >
              <Icon aria-hidden="true" size={18} />
              <span>{station.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
