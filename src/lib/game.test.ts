import { describe, expect, it } from "vitest";
import {
  applyFoodItem,
  applyStationAction,
  clampStat,
  clearStoredGameStats,
  decayStats,
  decodeSharedGameStats,
  encodeSharedGameStats,
  GAME_STATS_STORAGE_KEY,
  gameStations,
  initialGameStats,
  readStoredGameStats,
  moodForStats,
  normalizeGameStats,
  resolveKuromiSprite,
  stateFromStats,
  type GameState,
  writeStoredGameStats,
} from "./game";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

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

    expect(resolveKuromiSprite(bathing)).toContain("mandi");
  });

  it("defines station title assets and map positions", () => {
    expect(gameStations).toHaveLength(3);
    expect(gameStations.map((station) => station.id)).toEqual(["bed", "bath", "toy"]);
    expect(gameStations.every((station) => station.titleAsset.includes("title"))).toBe(true);
    expect(gameStations.every((station) => station.position.x >= 0 && station.position.x <= 100)).toBe(true);
    expect(gameStations.every((station) => station.position.y >= 0 && station.position.y <= 100)).toBe(true);
    expect(gameStations.every((station) => station.spritePosition.y > station.position.y)).toBe(true);
    expect(gameStations.find((station) => station.id === "bed")?.position.y).toBeLessThan(30);
    expect(gameStations.find((station) => station.id === "toy")?.position).toMatchObject({ x: 29, y: 62 });
    expect(gameStations.find((station) => station.id === "bath")?.position.x).toBe(66);
    expect(gameStations.find((station) => station.id === "bath")?.position.y).toBe(66);
  });

  it("normalizes imported stats before using them", () => {
    expect(
      normalizeGameStats({
        hunger: 240,
        energy: -40,
        cleanliness: 34.7,
        happiness: "88",
        experience: Number.NaN,
      }),
    ).toEqual({
      hunger: 100,
      energy: 0,
      cleanliness: 35,
      happiness: initialGameStats.happiness,
      experience: initialGameStats.experience,
    });
  });

  it("round-trips stats through a compact share payload", () => {
    const stats = { hunger: 55, energy: 45, cleanliness: 95, happiness: 72, experience: 12 };
    const encoded = encodeSharedGameStats(stats);

    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodeSharedGameStats(encoded)).toEqual(stats);
  });

  it("ignores invalid shared stat payloads", () => {
    expect(decodeSharedGameStats("not-json")).toBeNull();
    expect(decodeSharedGameStats("")).toBeNull();
  });

  it("reads, writes, and clears stored stats", () => {
    const storage = new MemoryStorage();
    const stats = { hunger: 10, energy: 20, cleanliness: 30, happiness: 40, experience: 50 };

    writeStoredGameStats(storage, stats);

    expect(storage.getItem(GAME_STATS_STORAGE_KEY)).toBeTruthy();
    expect(readStoredGameStats(storage)).toEqual(stats);

    clearStoredGameStats(storage);
    expect(readStoredGameStats(storage)).toBeNull();
  });

  it("drops corrupted stored stats", () => {
    const storage = new MemoryStorage();
    storage.setItem(GAME_STATS_STORAGE_KEY, "{broken");

    expect(readStoredGameStats(storage)).toBeNull();
    expect(storage.getItem(GAME_STATS_STORAGE_KEY)).toBeNull();
  });

  it("creates a fresh game state from imported stats", () => {
    const imported = stateFromStats({ ...initialGameStats, hunger: 8 });

    expect(imported).toEqual({
      stats: { ...initialGameStats, hunger: 8 },
      mood: "sad",
      activeAction: null,
      activeStation: null,
    });
  });
});
