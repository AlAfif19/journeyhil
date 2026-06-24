import { describe, expect, it } from "vitest";
import { generatedAssets } from "./generatedAssets";
import { kuromiMoodSprites } from "./assets";
import { timelineItems } from "./journey";

describe("asset coverage", () => {
  it("includes the full raw media library in the generated manifest", () => {
    expect(generatedAssets.length).toBeGreaterThan(70);
    expect(generatedAssets.some((asset) => asset.category === "overlay3d")).toBe(true);
    expect(generatedAssets.some((asset) => asset.category === "game")).toBe(true);
    expect(generatedAssets.some((asset) => asset.category === "gallery")).toBe(true);
    expect(generatedAssets.some((asset) => asset.category === "profile")).toBe(true);
  });

  it("defines mood-specific Kuromi sprites for the game character", () => {
    expect(kuromiMoodSprites.happy).toContain("happy");
    expect(kuromiMoodSprites.dirty).toContain("dirty");
    expect(kuromiMoodSprites.sleepy).toContain("sleep");
    expect(kuromiMoodSprites.sad).toContain("sad");
    expect(kuromiMoodSprites.angry).toContain("angry");
  });

  it("gives every timeline event an image", () => {
    expect(timelineItems).toHaveLength(9);
    expect(timelineItems.every((item) => Boolean(item.image))).toBe(true);
  });
});
