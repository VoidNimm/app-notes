import type { ImageSourcePropType } from 'react-native';

/**
 * 3D Icon Assets (Transparent / No Background)
 * Kumpulan 12 aset ikon 3D transparan (.png) dari assets/images/icons-no-bg/.
 * Siap dipakai oleh komponen HeroSummaryCard, CourseFolderCard, dan TaskCard.
 */
export const IconAssets = {
  // Baris 1
  heartPink: require('../../assets/images/icons-no-bg/icon-heart-pink.png') as ImageSourcePropType,
  flowerPeach: require('../../assets/images/icons-no-bg/icon-flower-peach.png') as ImageSourcePropType,
  cloverLime: require('../../assets/images/icons-no-bg/icon-clover-lime.out.png') as ImageSourcePropType,

  // Baris 2
  plusBlue: require('../../assets/images/icons-no-bg/icon-plus-blue.png') as ImageSourcePropType,
  starPurple: require('../../assets/images/icons-no-bg/icon-star-purple.png') as ImageSourcePropType,
  squareGold: require('../../assets/images/icons-no-bg/icon-square-gold.png') as ImageSourcePropType,

  // Baris 3
  tubeLeft: require('../../assets/images/icons-no-bg/icon-tube-left.png') as ImageSourcePropType,
  sphereGlass: require('../../assets/images/icons-no-bg/icon-sphere-glass.png') as ImageSourcePropType,
  donutOrange: require('../../assets/images/icons-no-bg/icon-donut-orange.out.png') as ImageSourcePropType,

  // Baris 4
  pillPink: require('../../assets/images/icons-no-bg/icon-pill-pink.png') as ImageSourcePropType,
  ringPink: require('../../assets/images/icons-no-bg/icon-ring-pink.png') as ImageSourcePropType,
  tubeRight: require('../../assets/images/icons-no-bg/icon-tube-right.png') as ImageSourcePropType,
} as const;

export type IconAssetKey = keyof typeof IconAssets;

/**
 * Alias NoBgIconAssets untuk kompatibilitas kode
 */
export const NoBgIconAssets = IconAssets;
export type NoBgIconKey = IconAssetKey;

/**
 * Pemetaan berdasarkan nama berkas asli di assets/images/icons-no-bg/
 */
export const IconAssetsByFileName = {
  'icon-heart-pink.png': IconAssets.heartPink,
  'icon-flower-peach.png': IconAssets.flowerPeach,
  'icon-clover-lime.out.png': IconAssets.cloverLime,
  'icon-plus-blue.png': IconAssets.plusBlue,
  'icon-star-purple.png': IconAssets.starPurple,
  'icon-square-gold.png': IconAssets.squareGold,
  'icon-tube-left.png': IconAssets.tubeLeft,
  'icon-sphere-glass.png': IconAssets.sphereGlass,
  'icon-donut-orange.out.png': IconAssets.donutOrange,
  'icon-pill-pink.png': IconAssets.pillPink,
  'icon-ring-pink.png': IconAssets.ringPink,
  'icon-tube-right.png': IconAssets.tubeRight,
} as const;

export type IconFileName = keyof typeof IconAssetsByFileName;

/**
 * Metadata deskripsi ke-12 ikon untuk kemudahan integrasi UI
 */
export interface IconMeta {
  key: IconAssetKey;
  filename: IconFileName;
  source: ImageSourcePropType;
  title: string;
  description: string;
  row: number;
  col: number;
}

export const ICON_CATALOG: readonly IconMeta[] = [
  {
    key: 'heartPink',
    filename: 'icon-heart-pink.png',
    source: IconAssets.heartPink,
    title: 'Hati Pink',
    description: 'Hati kaca merah muda di kiri atas',
    row: 1,
    col: 1,
  },
  {
    key: 'flowerPeach',
    filename: 'icon-flower-peach.png',
    source: IconAssets.flowerPeach,
    title: 'Bunga Peach',
    description: 'Bunga/mawar peach di tengah atas',
    row: 1,
    col: 2,
  },
  {
    key: 'cloverLime',
    filename: 'icon-clover-lime.out.png',
    source: IconAssets.cloverLime,
    title: 'Semanggi Lime',
    description: 'Bunga 4 kelopak kuning-hijau di kanan atas',
    row: 1,
    col: 3,
  },
  {
    key: 'plusBlue',
    filename: 'icon-plus-blue.png',
    source: IconAssets.plusBlue,
    title: 'Plus Biru',
    description: 'Tanda plus biru muda di kiri baris 2',
    row: 2,
    col: 1,
  },
  {
    key: 'starPurple',
    filename: 'icon-star-purple.png',
    source: IconAssets.starPurple,
    title: 'Bintang Ungu',
    description: 'Bintang kaca ungu di tengah baris 2',
    row: 2,
    col: 2,
  },
  {
    key: 'squareGold',
    filename: 'icon-square-gold.png',
    source: IconAssets.squareGold,
    title: 'Kotak Emas',
    description: 'Kotak membulat kuning keemasan di kanan baris 2',
    row: 2,
    col: 3,
  },
  {
    key: 'tubeLeft',
    filename: 'icon-tube-left.png',
    source: IconAssets.tubeLeft,
    title: 'Pipa Kiri',
    description: 'Pipa kaca melengkung vertikal di kiri baris 3',
    row: 3,
    col: 1,
  },
  {
    key: 'sphereGlass',
    filename: 'icon-sphere-glass.png',
    source: IconAssets.sphereGlass,
    title: 'Bola Kaca',
    description: 'Bola kaca kehijauan di tengah baris 3',
    row: 3,
    col: 2,
  },
  {
    key: 'donutOrange',
    filename: 'icon-donut-orange.out.png',
    source: IconAssets.donutOrange,
    title: 'Donat Oranye',
    description: 'Bulatan donat/target oranye di kanan baris 3',
    row: 3,
    col: 3,
  },
  {
    key: 'pillPink',
    filename: 'icon-pill-pink.png',
    source: IconAssets.pillPink,
    title: 'Pil Pink',
    description: 'Kapsul/pil panjang merah muda di kiri bawah',
    row: 4,
    col: 1,
  },
  {
    key: 'ringPink',
    filename: 'icon-ring-pink.png',
    source: IconAssets.ringPink,
    title: 'Cincin Pink',
    description: 'Cincin kaca merah muda kecil di tengah bawah',
    row: 4,
    col: 2,
  },
  {
    key: 'tubeRight',
    filename: 'icon-tube-right.png',
    source: IconAssets.tubeRight,
    title: 'Pipa Kanan',
    description: 'Pipa kaca melengkung di kanan bawah',
    row: 4,
    col: 3,
  },
] as const;

export const NO_BG_ICONS: readonly ImageSourcePropType[] = [
  IconAssets.flowerPeach,
  IconAssets.starPurple,
  IconAssets.donutOrange,
  IconAssets.heartPink,
  IconAssets.cloverLime,
  IconAssets.plusBlue,
  IconAssets.squareGold,
  IconAssets.sphereGlass,
  IconAssets.pillPink,
  IconAssets.ringPink,
  IconAssets.tubeLeft,
  IconAssets.tubeRight,
];
