import { describe, expect, it } from "vitest";
import { generatedAssets } from "./generatedAssets";
import { processedAssets } from "./processedAssets";
import { kuromiMoodSprites, overlayAssets } from "./assets";
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
    expect(kuromiMoodSprites.sad).toBe("/assets/processed/game/pixel-kuromi-sad.png");
    expect(kuromiMoodSprites.angry).toContain("angry");
  });

  it("gives every timeline event an image", () => {
    expect(timelineItems).toHaveLength(10);
    expect(timelineItems[0]?.title).toBe("Hilfia Kecil");
    expect(timelineItems[0]?.image).toContain("hilfia-bocil");
    expect(timelineItems.every((item) => Boolean(item.image))).toBe(true);
  });

  it("generates processed transparent assets for Magical overlays and game UI", () => {
    expect(processedAssets.length).toBeGreaterThan(20);
    expect(processedAssets.some((asset) => asset.category === "overlay3d")).toBe(true);
    expect(processedAssets.some((asset) => asset.category === "game")).toBe(true);
    expect(processedAssets.every((asset) => asset.src.includes("/assets/processed/"))).toBe(true);
  });

  it("uses processed ornaments and Kuromi 2D assets for Magical section overlays", () => {
    expect(overlayAssets.magical.length).toBeGreaterThanOrEqual(7);
    expect(overlayAssets.magical.every((asset) => asset.includes("/assets/processed/overlay3d/"))).toBe(true);
    expect(overlayAssets.magical.some((asset) => asset.includes("kuromi-2d"))).toBe(true);
  });
});
