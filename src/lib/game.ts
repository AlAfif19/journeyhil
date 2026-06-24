import type { GameActionId } from "../data/journey";

export type GameStats = {
  hunger: number;
  energy: number;
  cleanliness: number;
  happiness: number;
  experience: number;
};

export type GameMood = "happy" | "sad" | "sleepy" | "dirty" | "angry";

export const initialGameStats: GameStats = {
  hunger: 82,
  energy: 78,
  cleanliness: 86,
  happiness: 88,
  experience: 0,
};

export function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function decayStats(stats: GameStats): GameStats {
  return {
    ...stats,
    hunger: clampStat(stats.hunger - 5),
    energy: clampStat(stats.energy - 3),
    cleanliness: clampStat(stats.cleanliness - 4),
    happiness: clampStat(stats.happiness - 2),
  };
}

export function applyGameAction(stats: GameStats, actionId: GameActionId): GameStats {
  if (actionId === "eat") {
    return {
      ...stats,
      hunger: clampStat(stats.hunger + 40),
      happiness: clampStat(stats.happiness + 10),
    };
  }

  if (actionId === "sleep") {
    return { ...stats, energy: clampStat(stats.energy + 35) };
  }

  if (actionId === "bath") {
    return { ...stats, cleanliness: clampStat(stats.cleanliness + 50) };
  }

  if (actionId === "play") {
    return { ...stats, happiness: clampStat(stats.happiness + 30) };
  }

  return { ...stats, experience: clampStat(stats.experience + 20) };
}

export function moodForStats(stats: GameStats): GameMood {
  if (stats.hunger < 25) return "sad";
  if (stats.energy < 25) return "sleepy";
  if (stats.cleanliness < 25) return "dirty";
  if (stats.happiness < 25) return "angry";
  return "happy";
}
