import { generatedAssets } from "./generatedAssets";
import { processedAssets } from "./processedAssets";

function findAsset(name: string, category?: (typeof generatedAssets)[number]["category"]) {
  const normalized = name.toLowerCase();
  const asset = generatedAssets.find((item) => {
    const matchesName = item.name.toLowerCase() === normalized || item.source.toLowerCase().includes(normalized);
    return matchesName && (!category || item.category === category);
  });

  if (!asset) {
    throw new Error(`Missing generated asset: ${name}`);
  }

  return asset.src;
}

function findProcessedAsset(name: string, category?: (typeof processedAssets)[number]["category"]) {
  const normalized = name.toLowerCase();
  const asset = processedAssets.find((item) => {
    const matchesName = item.name.toLowerCase() === normalized || item.source.toLowerCase().includes(normalized);
    return matchesName && (!category || item.category === category);
  });

  if (!asset) {
    throw new Error(`Missing processed asset: ${name}`);
  }

  return asset.src;
}

export const assetPaths = {
  photos: {
    hero: "/assets/photos/hero-hilfia-keren.jpeg",
    cutee: "/assets/photos/hilfia-cutee.jpeg",
    clean: "/assets/photos/hilfia-clean.jpeg",
    hmtl: "/assets/photos/hilfia-hmtl.jpeg",
    bocil: findAsset("hilfia bocil", "profile"),
  },
  gallery: {
    mentorAnak: "/assets/gallery/mentor-anak.jpg",
    cafe: "/assets/gallery/main-ke-cafe.jpg",
    taman: "/assets/gallery/main-di-taman.jpg",
    dpm: "/assets/gallery/foto-bareng-dpm.jpg",
    komisi: "/assets/gallery/komisi-1-lucu.jpg",
  },
  places: {
    smk: "/assets/places/smk-13-bandung.jpg",
    university: "/assets/places/universitas-kebangsaan.webp",
  },
  game: {
    room: "/assets/game/kuromi-room.png",
    kuromiPixel: findProcessedAsset("pixel kuromi idle", "game"),
    kuromi2d: findProcessedAsset("kuromi 2d idle", "overlay3d"),
    kuromiRunLeft: "/assets/processed/game/kuromi-run-left.gif",
    kuromiRunRight: "/assets/processed/game/kuromi-run-right.gif",
    assets: "/assets/game/game-assets.png",
    decor: "/assets/game/game-decor.png",
    bed: findProcessedAsset("bed", "game"),
    bathtub: findProcessedAsset("bathtub", "game"),
    strawberry: findProcessedAsset("strawberry", "game"),
    iceCream: findProcessedAsset("eskrim", "game"),
    doll: findProcessedAsset("doll", "game"),
    book: findProcessedAsset("title toy", "game"),
  },
} as const;

export const kuromiMoodSprites = {
  happy: findProcessedAsset("pixel kuromi happy", "game"),
  dirty: findProcessedAsset("pixel kuromi dirty", "game"),
  sleepy: findProcessedAsset("pixel kuromi sleep", "game"),
  sad: findProcessedAsset("pixel kuromi sad", "game"),
  angry: findProcessedAsset("kuromi 2d angry", "overlay3d"),
  idle: findProcessedAsset("pixel kuromi idle", "game"),
  eat: findProcessedAsset("pixel kuromi eat", "game"),
  play: findProcessedAsset("kuromi 2d play", "overlay3d"),
} as const;

export const overlayAssets = {
  magical: [
    findProcessedAsset("moon aset", "overlay3d"),
    findProcessedAsset("star aset", "overlay3d"),
    findProcessedAsset("claud aset", "overlay3d"),
    findProcessedAsset("love aset", "overlay3d"),
    findProcessedAsset("ribbon aset", "overlay3d"),
    findProcessedAsset("kuromi 2d idle", "overlay3d"),
    findProcessedAsset("kuromi 2d happy", "overlay3d"),
    findProcessedAsset("kuromi 2d angry", "overlay3d"),
    findProcessedAsset("kuromi 2d play", "overlay3d"),
    findProcessedAsset("kuromi 2d sit", "overlay3d"),
    findProcessedAsset("kuromi 2d sleep", "overlay3d"),
  ],
  pixel: [
    findProcessedAsset("kuromi 3d play", "overlay3d"),
    findProcessedAsset("bom", "game"),
    findProcessedAsset("kuromi doll", "game"),
    findProcessedAsset("cake", "game"),
  ],
  scrapbook: [
    findProcessedAsset("love aset", "overlay3d"),
    findProcessedAsset("ribbon aset", "overlay3d"),
    findProcessedAsset("kuromi aset", "overlay3d"),
    findProcessedAsset("kuromi 3d sit", "overlay3d"),
  ],
} as const;

export const allMediaAssets = generatedAssets;

export const allPhotoAssets = generatedAssets.filter((asset) => asset.category === "profile" || asset.category === "gallery");

export const gameObjectAssets = generatedAssets.filter((asset) => asset.kind === "image" && asset.category === "game");
export const processedGameObjectAssets = processedAssets.filter((asset) => asset.category === "game");

export { processedAssets };
