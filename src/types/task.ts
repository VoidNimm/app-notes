/**
 * Model data Task sesuai PRD Bagian 8.
 */

export type Timestamp = number;

export interface Task {
  /** String unik, dibuat saat tugas dibuat */
  id: string;

  /** Maksimal 120 karakter */
  title: string;

  /** Teks bebas, maksimal 80 karakter (opsional) */
  course?: string;

  /** Teks bebas (opsional) */
  description?: string;

  /** Deadline tugas (timestamp) */
  dueAt: Timestamp;

  /** Status selesai, default false */
  isDone: boolean;

  /** Terisi saat ditandai selesai (timestamp, opsional) */
  doneAt?: Timestamp | null;

  /** Dikelola aplikasi saat dibuat (timestamp) */
  createdAt: Timestamp;

  /** Dikelola aplikasi saat diperbarui (timestamp) */
  updatedAt: Timestamp;

  /** Daftar pengenal notifikasi terjadwal untuk membatalkan atau menjadwalkan ulang */
  reminderIds: string[];
}
