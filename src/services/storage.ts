import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/task';

// TODO: Implementasikan penyimpanan lokal menggunakan @react-native-async-storage/async-storage

const TASKS_KEY = 'tasks';

async function writeTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

/**
 * Mengambil semua tugas dari penyimpanan lokal.
 */
export async function getTasks(): Promise<Task[]> {
  const raw = await AsyncStorage.getItem(TASKS_KEY);
  return raw ? (JSON.parse(raw) as Task[]) : [];
}

/**
 * Mengambil tugas berdasarkan ID.
 */
export async function getTaskById(id: string): Promise<Task | null> {
  const tasks = await getTasks();
  return tasks.find((t) => t.id === id) ?? null;
}

/**
 * Menyimpan tugas baru ke penyimpanan lokal.
 */
export async function saveTask(task: Task): Promise<void> {
  const tasks = await getTasks();
  await writeTasks([...tasks, task]);
}

/**
 * Memperbarui data tugas di penyimpanan lokal.
 */
export async function updateTask(task: Task): Promise<void> {
  const tasks = await getTasks();
  await writeTasks(tasks.map((t) => (t.id === task.id ? task : t)));
}

/**
 * Menghapus tugas dari penyimpanan lokal berdasarkan ID.
 */
export async function deleteTask(id: string): Promise<void> {
  const tasks = await getTasks();
  await writeTasks(tasks.filter((t) => t.id !== id));
}

const NOTIFICATION_PROMPT_SEEN_KEY = '@app_notes/has_seen_notification_prompt';
const USER_NOTIFICATION_CONSENT_KEY = '@app_notes/user_notification_consent';

/**
 * Mengecek apakah user sudah pernah melihat layar penjelasan izin notifikasi (S4).
 */
export async function hasSeenNotificationPrompt(): Promise<boolean> {
  const value = await AsyncStorage.getItem(NOTIFICATION_PROMPT_SEEN_KEY);
  return value === 'true';
}

/**
 * Menyimpan status bahwa user sudah melihat layar penjelasan izin notifikasi (S4).
 */
export async function setHasSeenNotificationPrompt(seen: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_PROMPT_SEEN_KEY, seen ? 'true' : 'false');
}

/**
 * Mengambil status persetujuan notifikasi pengguna di dalam aplikasi.
 * - true: pengguna menyetujui ("Izinkan")
 * - false: pengguna menolak ("Nanti Saja")
 * - null: belum ada pilihan
 */
export async function getUserNotificationConsent(): Promise<boolean | null> {
  const value = await AsyncStorage.getItem(USER_NOTIFICATION_CONSENT_KEY);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

/**
 * Menyimpan status persetujuan notifikasi pengguna di dalam aplikasi.
 */
export async function setUserNotificationConsent(consented: boolean): Promise<void> {
  await AsyncStorage.setItem(USER_NOTIFICATION_CONSENT_KEY, consented ? 'true' : 'false');
}

/**
 * Mereset status pemakaian pertama dan pilihan izin notifikasi (berguna untuk pengujian alur).
 */
export async function resetNotificationPromptState(): Promise<void> {
  await AsyncStorage.multiRemove([NOTIFICATION_PROMPT_SEEN_KEY, USER_NOTIFICATION_CONSENT_KEY]);
}

