import { describe, expect, it } from "vitest";
import { applyGameAction, clampStat, decayStats, initialGameStats, moodForStats } from "./game";

describe("game stat helpers", () => {
  it("clamps stat values between 0 and 100", () => {
    expect(clampStat(140)).toBe(100);
    expect(clampStat(-12)).toBe(0);
  });

  it("applies Kuromi care actions and keeps values in range", () => {
    const hungry = { ...initialGameStats, hunger: 70, happiness: 95 };
    expect(applyGameAction(hungry, "eat")).toMatchObject({ hunger: 100, happiness: 100 });

    const tired = { ...initialGameStats, energy: 80 };
    expect(applyGameAction(tired, "sleep").energy).toBe(100);

    const studying = applyGameAction(initialGameStats, "study");
    expect(studying.experience).toBe(20);
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
});
