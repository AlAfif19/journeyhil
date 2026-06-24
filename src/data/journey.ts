import { allPhotoAssets, assetPaths, overlayAssets } from "./assets";

export type ThemeKey = "magical" | "pixel" | "scrapbook";
export type TimelineItem = {
  phase: string;
  title: string;
  detail: string;
  image: string;
};
export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  category: "profile" | "memory" | "organization" | "school";
  kind?: "image" | "video";
};
export type GameActionId = "eat" | "sleep" | "bath" | "play" | "study";
export type GameStatKey = "hunger" | "energy" | "cleanliness" | "happiness" | "experience";

export const journeyProfile = {
  name: "Hilfia Qisthi Amalia",
  birthDate: "06 Desember 2023",
  city: "Bandung",
  favorites: ["Strawberry", "Sale Pisang", "Ice Cream"],
  favoriteGame: "Mobile Legends",
  favoriteCharacter: "Kuromi",
  hobby: "Menempel stiker",
  instagram: "@hilfiaqisthii",
};

export const storyBeats = [
  "Awal bertemu sebagai mentor dan anggota kelompok.",
  "Bertemu beberapa kali untuk main dan ngobrol lebih dekat.",
  "Pernah mengajak makan, tapi obrolannya terlalu lama sampai lupa makan.",
  "Akhirnya makanan dibelikan saja, dan ceritanya jadi salah satu memori manis.",
  "Semakin dekat, semakin banyak pengalaman bersama yang layak disimpan.",
];

export const timelineItems: TimelineItem[] = [
  { phase: "Phase 1", title: "Bandung", detail: "06 Desember 2023", image: assetPaths.photos.cutee },
  {
    phase: "Phase 2",
    title: "SMK Negeri 13 Bandung",
    detail: "Jurusan Kimia Analis",
    image: assetPaths.places.smk,
  },
  {
    phase: "Phase 3",
    title: "Universitas Kebangsaan",
    detail: "Teknik Lingkungan",
    image: assetPaths.places.university,
  },
  {
    phase: "Phase 4",
    title: "Awal Dekat",
    detail: "Mentor dan anggota kelompok, sering main bersama, dan cerita lupa makan karena ngobrol terlalu lama.",
    image: assetPaths.gallery.mentorAnak,
  },
  {
    phase: "Phase 5",
    title: "Teater Lima Wajah",
    detail: "Anggota teater, resital, dan sekretaris dhemit.",
    image: "/assets/library/profile/hilfia-malam-foto.jpeg",
  },
  { phase: "Phase 6", title: "BEM Aksara", detail: "Berperan sebagai humas.", image: "/assets/library/gallery/acara-bukber-kema.jpg" },
  {
    phase: "Phase 7",
    title: "Asisten Lab",
    detail: "Dipercaya dosen menjadi asisten praktikum.",
    image: "/assets/library/profile/hilfia-lab.jpeg",
  },
  {
    phase: "Phase 8",
    title: "HMTL",
    detail: "Publikasi, dokumentasi, desain, seminar lingkungan, dan sekretaris departemen PSDA.",
    image: assetPaths.photos.hmtl,
  },
  { phase: "Phase 9", title: "DPM", detail: "Ketua Komisi 1.", image: assetPaths.gallery.dpm },
];

function makeCaption(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function inferGalleryCategory(source: string): GalleryItem["category"] {
  const lower = source.toLowerCase();
  if (lower.includes("smk") || lower.includes("universitas")) return "school";
  if (lower.includes("dpm") || lower.includes("hmtl") || lower.includes("bem") || lower.includes("mubes")) {
    return "organization";
  }
  if (lower.includes("foto galeri")) return "memory";
  return "profile";
}

export const galleryItems: GalleryItem[] = allPhotoAssets.map((asset) => ({
  src: asset.src,
  alt: `Dokumentasi ${asset.name}`,
  caption: makeCaption(asset.name),
  category: inferGalleryCategory(asset.source),
  kind: asset.kind,
}));

export const themeOverlays = overlayAssets;

export const gameActions = [
  { id: "eat", label: "Eat", stat: "hunger", amount: 40, bonusStat: "happiness", bonusAmount: 10 },
  { id: "sleep", label: "Sleep", stat: "energy", amount: 35 },
  { id: "bath", label: "Bath", stat: "cleanliness", amount: 50 },
  { id: "play", label: "Play", stat: "happiness", amount: 30 },
  { id: "study", label: "Study", stat: "experience", amount: 20 },
] as const satisfies readonly {
  id: GameActionId;
  label: string;
  stat: GameStatKey;
  amount: number;
  bonusStat?: GameStatKey;
  bonusAmount?: number;
}[];
