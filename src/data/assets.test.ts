import { describe, expect, it } from "vitest";
import { generatedAssets } from "./generatedAssets";
import { processedAssets } from "./processedAssets";
import { assetPaths, kuromiMoodSprites, overlayAssets } from "./assets";
import { galleryItems, storyBeats, timelineItems } from "./journey";

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
    expect(kuromiMoodSprites.bath).toContain("pixel-kuromi-mandi");
    expect(assetPaths.game.kuromiBath).toContain("pixel-kuromi-mandi");
    expect(assetPaths.game.kuromiRunLeft).toContain("kuromi-run-left.gif");
    expect(assetPaths.game.kuromiRunRight).toContain("kuromi-run-right.gif");
  });

  it("gives every timeline event an image", () => {
    expect(timelineItems).toHaveLength(10);
    expect(timelineItems[0]?.title).toBe("Hilfia Kecil");
    expect(timelineItems[0]?.image).toContain("hilfia-bocil");
    expect(timelineItems[1]?.image).toContain("pap-hilfia-kepagn-2");
    expect(timelineItems[5]?.image).toContain("open-house-tlw");
    expect(timelineItems[6]?.title).toBe("Kegiatan Kepanitiaan dan Organisasi");
    expect(timelineItems[8]?.image).toContain("hilfia-pengenalan-ring-1");
    expect(timelineItems.every((item) => Boolean(item.image))).toBe(true);
  });

  it("keeps the fourth story beat focused on growth dynamics", () => {
    expect(storyBeats[3]).toBe("Selama proses ini, banyak dinamika dan halangan yang hadir, namun semuanya menjadi bagian dari proses bertumbuh.");
  });

  it("shortens the clean hero candidate gallery caption", () => {
    expect(galleryItems.find((item) => item.src.includes("hilfia-clean-bisa-jadi-hero"))?.caption).toBe("Hilfia");
  });

  it("generates processed transparent assets for Magical overlays and game UI", () => {
    expect(processedAssets.length).toBeGreaterThan(20);
    expect(processedAssets.some((asset) => asset.category === "overlay3d")).toBe(true);
    expect(processedAssets.some((asset) => asset.category === "game")).toBe(true);
    expect(processedAssets.every((asset) => asset.src.includes("/assets/processed/"))).toBe(true);
  });

  it("uses processed ornaments and Kuromi 2D assets for Magical section overlays", () => {
    expect(overlayAssets.magical.length).toBeGreaterThanOrEqual(11);
    expect(overlayAssets.magical.every((asset) => asset.includes("/assets/processed/overlay3d/"))).toBe(true);
    expect(overlayAssets.magical.some((asset) => asset.includes("kuromi-2d"))).toBe(true);
    expect(overlayAssets.magical).toEqual(
      expect.arrayContaining([
        expect.stringContaining("kuromi-2d-angry"),
        expect.stringContaining("kuromi-2d-play"),
        expect.stringContaining("kuromi-2d-sit"),
        expect.stringContaining("kuromi-2d-sleep"),
      ]),
    );
  });
});
