import { describe, expect, it } from "vitest";
import {
  applyFoodItem,
  applyStationAction,
  clampStat,
  decayStats,
  gameStations,
  initialGameStats,
  moodForStats,
  resolveKuromiSprite,
  type GameState,
} from "./game";

describe("game stat helpers", () => {
  it("clamps stat values between 0 and 100", () => {
    expect(clampStat(140)).toBe(100);
    expect(clampStat(-12)).toBe(0);
  });

  it("applies Kuromi care actions and keeps values in range", () => {
    const tired = { ...initialGameStats, energy: 80 };
    expect(applyStationAction({ stats: tired, mood: "happy", activeAction: null, activeStation: null }, "bed").stats.energy).toBe(100);

    const playful = applyStationAction({ stats: initialGameStats, mood: "happy", activeAction: null, activeStation: null }, "toy");
    expect(playful.stats.happiness).toBe(100);
  });

  it("decays only the visible care stats every interval", () => {
    expect(decayStats({ hunger: 5, energy: 3, cleanliness: 2, happiness: 1, experience: 40 })).toEqual({
      hunger: 0,
      energy: 0,
      cleanliness: 0,
      happiness: 0,
      experience: 40,
    });
  });

  it("chooses the first low-stat mood in priority order", () => {
    expect(moodForStats({ ...initialGameStats, hunger: 10 })).toBe("sad");
    expect(moodForStats({ ...initialGameStats, energy: 10 })).toBe("sleepy");
    expect(moodForStats(initialGameStats)).toBe("happy");
  });

  it("gives different foods different stat effects", () => {
    const baseState = {
      stats: { ...initialGameStats, hunger: 30, happiness: 30 },
      mood: "happy",
      activeAction: null,
      activeStation: null,
    } satisfies GameState;

    const strawberry = applyFoodItem(baseState, "strawberry").stats;
    const iceCream = applyFoodItem(baseState, "iceCream").stats;
    const cake = applyFoodItem(baseState, "cake").stats;

    expect(strawberry).not.toEqual(iceCream);
    expect(cake).not.toEqual(strawberry);
    expect(strawberry.hunger).toBeGreaterThan(baseState.stats.hunger);
    expect(iceCream.happiness).toBeGreaterThan(strawberry.happiness);
  });

  it("bath cleans dirty Kuromi and does not keep dirty as active sprite", () => {
    const dirtyState = {
      stats: { ...initialGameStats, cleanliness: 5, happiness: 45 },
      mood: "dirty",
      activeAction: null,
      activeStation: null,
    } satisfies GameState;

    const cleaned = applyStationAction(dirtyState, "bath");

    expect(cleaned.stats.cleanliness).toBeGreaterThan(80);
    expect(cleaned.mood).toBe("happy");
    expect(resolveKuromiSprite(cleaned)).not.toContain("dirty");
  });

  it("uses action sprite priority without mapping bath to dirty", () => {
    const bathing = {
      stats: { ...initialGameStats, cleanliness: 5 },
      mood: "dirty",
      activeAction: "bath" as const,
      activeStation: "bath" as const,
    } satisfies GameState;

    expect(resolveKuromiSprite(bathing)).toContain("happy");
  });

  it("defines station title assets and map positions", () => {
    expect(gameStations).toHaveLength(3);
    expect(gameStations.map((station) => station.id)).toEqual(["bed", "bath", "toy"]);
    expect(gameStations.every((station) => station.titleAsset.includes("title"))).toBe(true);
    expect(gameStations.every((station) => station.position.x >= 0 && station.position.x <= 100)).toBe(true);
    expect(gameStations.every((station) => station.position.y >= 0 && station.position.y <= 100)).toBe(true);
    expect(gameStations.every((station) => station.spritePosition.y > station.position.y)).toBe(true);
    expect(gameStations.find((station) => station.id === "bed")?.position.y).toBeLessThan(30);
    expect(gameStations.find((station) => station.id === "toy")?.position).toMatchObject({ x: 29, y: 72 });
    expect(gameStations.find((station) => station.id === "bath")?.position.x).toBeGreaterThan(70);
  });
});
