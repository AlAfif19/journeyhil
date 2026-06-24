import { assetPaths } from "./assets";

export type ThemeKey = "magical" | "pixel" | "scrapbook";
export type TimelineItem = {
  phase: string;
  title: string;
  detail: string;
  image?: string;
};
export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  category: "profile" | "memory" | "organization" | "school";
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
  { phase: "Phase 1", title: "Bandung", detail: "06 Desember 2023" },
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
  },
  {
    phase: "Phase 5",
    title: "Teater Lima Wajah",
    detail: "Anggota teater, resital, dan sekretaris dhemit.",
  },
  { phase: "Phase 6", title: "BEM Aksara", detail: "Berperan sebagai humas." },
  {
    phase: "Phase 7",
    title: "Asisten Lab",
    detail: "Dipercaya dosen menjadi asisten praktikum.",
  },
  {
    phase: "Phase 8",
    title: "HMTL",
    detail: "Publikasi, dokumentasi, desain, seminar lingkungan, dan sekretaris departemen PSDA.",
  },
  { phase: "Phase 9", title: "DPM", detail: "Ketua Komisi 1." },
];

export const galleryItems: GalleryItem[] = [
  {
    src: assetPaths.photos.cutee,
    alt: "Hilfia tersenyum dalam foto personal",
    caption: "Cute memory",
    category: "profile",
  },
  {
    src: assetPaths.photos.clean,
    alt: "Hilfia dengan tampilan elegan",
    caption: "Soft portrait",
    category: "profile",
  },
  {
    src: assetPaths.photos.hmtl,
    alt: "Hilfia memakai atribut HMTL",
    caption: "HMTL day",
    category: "organization",
  },
  {
    src: assetPaths.gallery.mentorAnak,
    alt: "Momen mentor dan anggota kelompok",
    caption: "Mentor & anak",
    category: "memory",
  },
  {
    src: assetPaths.gallery.cafe,
    alt: "Momen main ke cafe",
    caption: "Cafe memory",
    category: "memory",
  },
  {
    src: assetPaths.gallery.taman,
    alt: "Momen main di taman",
    caption: "Taman story",
    category: "memory",
  },
  {
    src: assetPaths.gallery.dpm,
    alt: "Foto bersama DPM",
    caption: "DPM",
    category: "organization",
  },
  {
    src: assetPaths.gallery.komisi,
    alt: "Gaya wajib Komisi 1 yang lucu",
    caption: "Komisi 1",
    category: "organization",
  },
];

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
