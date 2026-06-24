import { generatedAssets } from "./generatedAssets";

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

export const assetPaths = {
  photos: {
    hero: "/assets/photos/hero-hilfia-keren.jpeg",
    cutee: "/assets/photos/hilfia-cutee.jpeg",
    clean: "/assets/photos/hilfia-clean.jpeg",
    hmtl: "/assets/photos/hilfia-hmtl.jpeg",
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
    kuromiPixel: "/assets/game/kuromi-pixel.png",
    kuromi2d: "/assets/game/kuromi-2d.png",
    assets: "/assets/game/game-assets.png",
    decor: "/assets/game/game-decor.png",
    bed: findAsset("bed", "game"),
    bathtub: findAsset("bathtub", "game"),
    strawberry: findAsset("strawberry", "game"),
    iceCream: findAsset("eskrim", "game"),
    doll: findAsset("doll", "game"),
    book: findAsset("title toy", "game"),
  },
} as const;

export const kuromiMoodSprites = {
  happy: findAsset("pixel kuromi happy", "game"),
  dirty: findAsset("pixel kuromi dirty", "game"),
  sleepy: findAsset("pixel kuromi sleep", "game"),
  sad: findAsset("pixel kuromi sad", "game"),
  angry: findAsset("kuromi 2d angry", "overlay3d"),
  idle: findAsset("pixel kuromi idle", "game"),
  eat: findAsset("pixel kuromi eat", "game"),
  play: findAsset("kuromi 2d play", "overlay3d"),
} as const;

export const overlayAssets = {
  magical: [
    findAsset("moon aset", "overlay3d"),
    findAsset("star aset", "overlay3d"),
    findAsset("claud aset", "overlay3d"),
    findAsset("kuromi 3d stand", "overlay3d"),
  ],
  pixel: [
    findAsset("kuromi 3d play", "overlay3d"),
    findAsset("bom", "game"),
    findAsset("kuromi doll", "game"),
    findAsset("cake", "game"),
  ],
  scrapbook: [
    findAsset("love aset", "overlay3d"),
    findAsset("ribbon aset", "overlay3d"),
    findAsset("kuromi aset", "overlay3d"),
    findAsset("kuromi 3d sit", "overlay3d"),
  ],
} as const;

export const allMediaAssets = generatedAssets;

export const allPhotoAssets = generatedAssets.filter((asset) => asset.category === "profile" || asset.category === "gallery");

export const gameObjectAssets = generatedAssets.filter((asset) => asset.kind === "image" && asset.category === "game");
