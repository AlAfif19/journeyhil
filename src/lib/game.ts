import { assetPaths, kuromiMoodSprites } from "../data/assets";
import type { GameActionId } from "../data/journey";

export type GameStats = {
  hunger: number;
  energy: number;
  cleanliness: number;
  happiness: number;
  experience: number;
};

export type GameMood = "happy" | "sad" | "sleepy" | "dirty" | "angry";
export type GameStationId = "food" | "bed" | "bath" | "toy" | "study";
export type FoodItemId = "strawberry" | "iceCream" | "cake" | "milk" | "pudding" | "donut" | "cookies" | "drink";

export type GameState = {
  stats: GameStats;
  mood: GameMood;
  activeAction: GameActionId | null;
  activeStation: GameStationId | null;
};

export type StatEffect = Partial<GameStats>;

export type FoodItem = {
  id: FoodItemId;
  label: string;
  asset: string;
  effect: StatEffect;
};

export type GameStation = {
  id: GameStationId;
  label: string;
  titleAsset: string;
  position: { x: number; y: number };
  action: GameActionId;
};

export const initialGameStats: GameStats = {
  hunger: 82,
  energy: 78,
  cleanliness: 86,
  happiness: 88,
  experience: 0,
};

export const initialGameState: GameState = {
  stats: initialGameStats,
  mood: "happy",
  activeAction: null,
  activeStation: null,
};

export const foodItems: FoodItem[] = [
  { id: "strawberry", label: "Strawberry", asset: assetPaths.game.strawberry, effect: { hunger: 18, happiness: 8 } },
  { id: "iceCream", label: "Ice Cream", asset: assetPaths.game.iceCream, effect: { hunger: 12, happiness: 22 } },
  { id: "cake", label: "Cake", asset: "/assets/processed/game/cake.png", effect: { hunger: 26, happiness: 14 } },
  { id: "milk", label: "Milk", asset: "/assets/processed/game/milk.png", effect: { hunger: 16, energy: 8 } },
  { id: "pudding", label: "Pudding", asset: "/assets/processed/game/pudding.png", effect: { hunger: 14, happiness: 16 } },
  { id: "donut", label: "Donut", asset: "/assets/processed/game/donut.png", effect: { hunger: 20, happiness: 12 } },
  { id: "cookies", label: "Cookies", asset: "/assets/processed/game/cookies.png", effect: { hunger: 14, happiness: 10 } },
  { id: "drink", label: "Drink", asset: "/assets/processed/game/drink.png", effect: { hunger: 8, energy: 10 } },
];

export const gameStations: GameStation[] = [
  { id: "food", label: "Food", titleAsset: "/assets/processed/game/title-food.png", position: { x: 23, y: 66 }, action: "eat" },
  { id: "bed", label: "Bed", titleAsset: "/assets/processed/game/title-bed.png", position: { x: 22, y: 24 }, action: "sleep" },
  { id: "bath", label: "Bath", titleAsset: "/assets/processed/game/title-bath.png", position: { x: 72, y: 62 }, action: "bath" },
  { id: "toy", label: "Toy", titleAsset: "/assets/processed/game/title-toy.png", position: { x: 50, y: 50 }, action: "play" },
  { id: "study", label: "Study", titleAsset: "/assets/processed/game/title-soap.png", position: { x: 78, y: 56 }, action: "study" },
];

export function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function applyEffects(stats: GameStats, effect: StatEffect): GameStats {
  return {
    hunger: clampStat(stats.hunger + (effect.hunger ?? 0)),
    energy: clampStat(stats.energy + (effect.energy ?? 0)),
    cleanliness: clampStat(stats.cleanliness + (effect.cleanliness ?? 0)),
    happiness: clampStat(stats.happiness + (effect.happiness ?? 0)),
    experience: clampStat(stats.experience + (effect.experience ?? 0)),
  };
}

export function decayStats(stats: GameStats): GameStats {
  return applyEffects(stats, {
    hunger: -5,
    energy: -3,
    cleanliness: -4,
    happiness: -2,
  });
}

export function moodForStats(stats: GameStats): GameMood {
  if (stats.cleanliness < 25) return "dirty";
  if (stats.hunger < 25) return "sad";
  if (stats.energy < 25) return "sleepy";
  if (stats.happiness < 25) return "angry";
  return "happy";
}

export function updateMood(state: Omit<GameState, "mood">): GameState {
  return {
    ...state,
    mood: moodForStats(state.stats),
  };
}

export function applyFoodItem(state: GameState, foodId: FoodItemId): GameState {
  const food = foodItems.find((item) => item.id === foodId);
  if (!food) return state;

  return updateMood({
    stats: applyEffects(state.stats, food.effect),
    activeAction: "eat",
    activeStation: "food",
  });
}

export function applyStationAction(state: GameState, stationId: GameStationId): GameState {
  if (stationId === "food") {
    return updateMood({
      stats: applyEffects(state.stats, { hunger: 40, happiness: 10 }),
      activeAction: "eat",
      activeStation: "food",
    });
  }

  if (stationId === "bed") {
    return updateMood({
      stats: applyEffects(state.stats, { energy: 35, happiness: 4 }),
      activeAction: "sleep",
      activeStation: "bed",
    });
  }

  if (stationId === "bath") {
    return updateMood({
      stats: applyEffects(state.stats, { cleanliness: 95, happiness: 8 }),
      activeAction: "bath",
      activeStation: "bath",
    });
  }

  if (stationId === "toy") {
    return updateMood({
      stats: applyEffects(state.stats, { happiness: 30, energy: -4 }),
      activeAction: "play",
      activeStation: "toy",
    });
  }

  return updateMood({
    stats: applyEffects(state.stats, { experience: 20, energy: -3 }),
    activeAction: "study",
    activeStation: "study",
  });
}

export function resolveKuromiSprite(state: Pick<GameState, "mood" | "activeAction">) {
  if (state.activeAction === "eat") return kuromiMoodSprites.eat;
  if (state.activeAction === "bath") return kuromiMoodSprites.happy;
  if (state.activeAction === "play") return kuromiMoodSprites.play;
  if (state.activeAction === "sleep") return kuromiMoodSprites.sleepy;

  if (state.mood === "dirty") return kuromiMoodSprites.dirty;
  if (state.mood === "sad") return kuromiMoodSprites.sad;
  if (state.mood === "sleepy") return kuromiMoodSprites.sleepy;
  if (state.mood === "angry") return kuromiMoodSprites.angry;
  return kuromiMoodSprites.happy;
}
