import type { Task } from '@/types/task';

export interface GroupedTasks {
  /** Tugas aktif dengan deadline yang sudah lewat (dueAt < now) */
  overdue: Task[];
  /** Tugas aktif dengan deadline hari ini yang belum lewat (now <= dueAt <= 23:59:59.999 hari ini) */
  today: Task[];
  /** Tugas aktif dengan deadline 1 sampai 7 hari ke depan (besok 00:00:00.000 s.d. H+7 23:59:59.999) */
  thisWeek: Task[];
  /** Tugas aktif dengan deadline lebih dari 7 hari ke depan (> H+7 23:59:59.999) */
  later: Task[];
  /** Tugas yang sudah ditandai selesai (isDone: true), terpisah dari tugas aktif */
  completed: Task[];
}

/**
 * Menghitung batas waktu dan mengelompokkan daftar tugas berdasarkan PRD FR-2.
 *
 * CARA BATAS "HARI INI" DAN "7 HARI" DIHITUNG (ZONA WAKTU PERANGKAT):
 * 1. Objek `Date` lokal (`new Date(now)`) otomatis menggunakan zona waktu perangkat lokal.
 * 2. Batas akhir "Hari ini" (`endOfToday`):
 *    - Ditentukan dengan mengatur jam ke titik akhir kalender hari ini:
 *      `new Date(year, month, date, 23, 59, 59, 999).getTime()`.
 *    - Tugas aktif masuk "Hari ini" jika belum terlewat (`dueAt >= nowMs`) dan `dueAt <= endOfToday`.
 *    - Jika `dueAt < nowMs`, tugas tersebut dikelompokkan ke "Terlambat".
 * 3. Batas akhir "7 hari" (`endOf7Days`):
 *    - Dihitung dari tanggal hari ini ditambah 7 hari kalender penuh sampai akhir hari:
 *      `new Date(year, month, date + 7, 23, 59, 59, 999).getTime()`.
 *    - Rentang "Minggu ini (1 sampai 7 hari ke depan)" mencakup tugas setelah hari ini (`dueAt > endOfToday`)
 *      hingga akhir hari ke-7 (`dueAt <= endOf7Days`), yaitu dari besok 00:00:00.000 s.d. H+7 23:59:59.999.
 * 4. Batas "Nanti (lebih dari 7 hari)":
 *    - Tugas aktif yang memiliki deadline setelah akhir hari ke-7 (`dueAt > endOf7Days`),
 *      yaitu mulai dari H+8 00:00:00.000 ke depan.
 * 5. Semua kelompok diurutkan dari deadline terdekat (ascending `dueAt`).
 *
 * @param tasks Daftar tugas yang akan dikelompokkan.
 * @param now Waktu acuan saat ini (Date atau timestamp ms). Default: new Date().
 * @returns Objek kelompok tugas (overdue, today, thisWeek, later, completed).
 */
export function groupTasks(
  tasks: Task[],
  now: Date | number = new Date()
): GroupedTasks {
  const nowDate = typeof now === 'number' ? new Date(now) : now;
  const nowMs = nowDate.getTime();

  const year = nowDate.getFullYear();
  const month = nowDate.getMonth();
  const date = nowDate.getDate();

  // Batas akhir hari ini (23:59:59.999) waktu lokal perangkat
  const endOfToday = new Date(year, month, date, 23, 59, 59, 999).getTime();

  // Batas akhir hari ke-7 (H+7 23:59:59.999) waktu lokal perangkat
  const endOf7Days = new Date(year, month, date + 7, 23, 59, 59, 999).getTime();

  const overdue: Task[] = [];
  const today: Task[] = [];
  const thisWeek: Task[] = [];
  const later: Task[] = [];
  const completed: Task[] = [];

  for (const task of tasks) {
    if (task.isDone) {
      completed.push(task);
    } else if (task.dueAt < nowMs) {
      overdue.push(task);
    } else if (task.dueAt <= endOfToday) {
      today.push(task);
    } else if (task.dueAt <= endOf7Days) {
      thisWeek.push(task);
    } else {
      later.push(task);
    }
  }

  // Tiap kelompok diurutkan dari deadline terdekat (ascending)
  const sortByDueAtAsc = (a: Task, b: Task) => a.dueAt - b.dueAt;

  return {
    overdue: overdue.sort(sortByDueAtAsc),
    today: today.sort(sortByDueAtAsc),
    thisWeek: thisWeek.sort(sortByDueAtAsc),
    later: later.sort(sortByDueAtAsc),
    completed: completed.sort(sortByDueAtAsc),
  };
}
