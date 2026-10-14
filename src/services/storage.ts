import { Task } from '@/types/task';

// TODO: Implementasikan penyimpanan lokal menggunakan @react-native-async-storage/async-storage

/**
 * Mengambil semua tugas dari penyimpanan lokal.
 */
export async function getTasks(): Promise<Task[]> {
  // TODO: Ambil daftar tugas dari storage dan kembalikan array Task
  throw new Error('Not implemented');
}

/**
 * Mengambil tugas berdasarkan ID.
 */
export async function getTaskById(id: string): Promise<Task | null> {
  // TODO: Ambil data tugas berdasarkan id dari storage
  throw new Error('Not implemented');
}

/**
 * Menyimpan tugas baru ke penyimpanan lokal.
 */
export async function saveTask(task: Task): Promise<void> {
  // TODO: Simpan entitas tugas baru ke storage
  throw new Error('Not implemented');
}

/**
 * Memperbarui data tugas di penyimpanan lokal.
 */
export async function updateTask(task: Task): Promise<void> {
  // TODO: Perbarui data tugas yang ada di storage berdasarkan task.id
  throw new Error('Not implemented');
}

/**
 * Menghapus tugas dari penyimpanan lokal berdasarkan ID.
 */
export async function deleteTask(id: string): Promise<void> {
  // TODO: Hapus tugas dari storage berdasarkan id
  throw new Error('Not implemented');
}

/**
 * Mengecek apakah user sudah pernah melihat layar penjelasan izin notifikasi (S4).
 */
export async function hasSeenNotificationPrompt(): Promise<boolean> {
  // TODO: Cek status flag pemakaian pertama di storage
  throw new Error('Not implemented');
}

/**
 * Menyimpan status bahwa user sudah melihat layar penjelasan izin notifikasi (S4).
 */
export async function setHasSeenNotificationPrompt(seen: boolean): Promise<void> {
  // TODO: Simpan status flag pemakaian pertama ke storage
  throw new Error('Not implemented');
}
