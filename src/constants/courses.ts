import { VibrantColorKey } from './theme';

export interface CourseSession {
  day: string;
  slots: string;
  room: string;
  lecturer: string;
}

export interface Course {
  id: string;
  shortName: string;
  fullName: string;
  sessions: CourseSession[];
  colorKey: VibrantColorKey;
}

/**
 * 8 Mata Kuliah Utama Kelas 1KA03
 * Mengacu pada kurikulum kelas 1KA03 dengan jadwal/sesi terpadu (sub-bagian A/B/C)
 * dan warna vibrant folder berdasarkan layar "Saved" pada reference/reference.jpg.
 */
export const COURSES: Course[] = [
  {
    id: 'fisika-kimia-dasar',
    shortName: 'Fisika & Kimia',
    fullName: 'Fisika & Kimia Dasar',
    colorKey: 'yellow',
    sessions: [
      { day: 'Senin', slots: '1/2', room: 'G343', lecturer: 'ARIYANTO' },
      { day: 'Rabu', slots: '8/9', room: 'D655', lecturer: 'ERMAWATI' },
    ],
  },
  {
    id: 'konsep-si-ti',
    shortName: 'Konsep SI & TI',
    fullName: 'Konsep Sist. & Tek. Sist. Inf.',
    colorKey: 'blue',
    sessions: [
      { day: 'Senin', slots: '3/4', room: 'G343', lecturer: 'IDA ASTUTI' },
      { day: 'Kamis', slots: '5/6', room: 'G433', lecturer: 'SARI NOORLIMA YANTI' },
      { day: "Jum'at", slots: '3/4', room: 'E223', lecturer: 'MASIMBANGAN SABARINA H/RIZKI ARIYANI' },
    ],
  },
  {
    id: 'algoritma-pemrograman-1',
    shortName: 'Algo & Pemrog 1',
    fullName: 'Algoritma & Pemrograman 1',
    colorKey: 'orange',
    sessions: [
      { day: 'Senin', slots: '7/8', room: 'G114', lecturer: 'ELVINA' },
      { day: 'Rabu', slots: '1/2', room: 'D623', lecturer: 'PURWANTI' },
      { day: 'Rabu', slots: '3/4', room: 'D623', lecturer: 'RINA REFIANTI MUTIARA' },
    ],
  },
  {
    id: 'matematika-dasar-1',
    shortName: 'Matematika Dasar 1',
    fullName: 'Matematika Dasar 1',
    colorKey: 'lavender',
    sessions: [
      { day: 'Senin', slots: '9/10', room: 'G347', lecturer: 'HERIK SUGERU' },
      { day: 'Kamis', slots: '1/2', room: 'G218', lecturer: 'NOLA MARINA' },
    ],
  },
  {
    id: 'digital-citizenship',
    shortName: 'Digital Citizenship',
    fullName: 'Digital Citizenship',
    colorKey: 'coral',
    sessions: [
      { day: 'Rabu', slots: '6/7', room: 'D655', lecturer: 'IRNA FITRIYAH' },
    ],
  },
  {
    id: 'isbd',
    shortName: 'ISBD',
    fullName: 'Ilmu Sosial & Budaya Dasar',
    colorKey: 'mint',
    sessions: [
      { day: 'Kamis', slots: '3/4', room: 'G433', lecturer: 'ADELIA RIANA DEWI' },
    ],
  },
  {
    id: 'pendidikan-pancasila',
    shortName: 'Pendidikan Pancasila',
    fullName: 'Pendidikan Pancasila',
    colorKey: 'yellow',
    sessions: [
      { day: 'Kamis', slots: '9/10', room: 'G216', lecturer: 'METI NURHAYATI' },
    ],
  },
  {
    id: 'peng-bisnis-ekonomi-digital',
    shortName: 'Bisnis & Ekon. Digital',
    fullName: 'Peng. Bisnis dan Ekonomi Digital',
    colorKey: 'blue',
    sessions: [
      { day: "Jum'at", slots: '1/2', room: 'E223', lecturer: 'KARTIKA SARI' },
    ],
  },
];

/**
 * Mencari data mata kuliah berdasarkan ID
 */
export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

/**
 * Mencari data mata kuliah berdasarkan nama (shortName atau fullName)
 */
export function getCourseByName(name: string): Course | undefined {
  const query = name.trim().toLowerCase();
  return COURSES.find(
    (c) => c.shortName.toLowerCase() === query || c.fullName.toLowerCase() === query || c.id === query
  );
}
