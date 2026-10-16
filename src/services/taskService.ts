import {
  cancelScheduledReminders,
  rescheduleTaskReminders,
  scheduleTaskReminders,
} from '@/services/notifications';
import { deleteTask, saveTask, updateTask } from '@/services/storage';
import type { Task } from '@/types/task';

/**
 * Menyimpan perubahan tugas dengan pengingat yang baru dijadwalkan.
 * Jika penyimpanan gagal, pengingat yang BARU dibuat dibatalkan agar tidak ada pengingat yatim,
 * lalu error dilempar ulang ke pemanggil.
 */
async function persistWithNewReminders(
  persist: (task: Task) => Promise<void>,
  task: Task,
  newReminderIds: string[]
): Promise<Task> {
  const next: Task = { ...task, reminderIds: newReminderIds };
  try {
    await persist(next);
  } catch (error) {
    await cancelScheduledReminders(newReminderIds);
    throw error;
  }
  return next;
}

/**
 * Membuat tugas baru: jadwalkan pengingat (24 jam dan 3 jam, yang masih di masa depan),
 * lalu simpan tugas beserta reminderIds-nya.
 */
export async function createTaskWithReminders(task: Task): Promise<Task> {
  const ids = await scheduleTaskReminders(task);
  return persistWithNewReminders(saveTask, task, ids);
}

/**
 * Menyimpan hasil edit tugas dari form. Tugas aktif SELALU membatalkan pengingat lama lalu
 * menjadwalkan ulang (tanpa membandingkan field). Tugas selesai hanya membatalkan pengingat lama.
 */
export async function updateTaskWithReminders(task: Task): Promise<Task> {
  const ids = task.isDone
    ? await cancelAndReturnEmpty(task.reminderIds)
    : await rescheduleTaskReminders(task);
  return persistWithNewReminders(updateTask, task, ids);
}

/**
 * Menandai tugas selesai (batalkan semua pengingat) atau membatalkan status selesai
 * (jadwalkan ulang pengingat yang masih di masa depan).
 */
export async function setTaskDone(
  task: Task,
  isDone: boolean,
  now: number = Date.now()
): Promise<Task> {
  const next: Task = { ...task, isDone, doneAt: isDone ? now : null, updatedAt: now };
  return updateTaskWithReminders(next);
}

/**
 * Menghapus tugas: batalkan semua pengingat, lalu hapus dari penyimpanan.
 * Kegagalan pembatalan hanya dicatat dan tidak menghalangi penghapusan.
 */
export async function deleteTaskWithReminders(task: Task): Promise<void> {
  await cancelScheduledReminders(task.reminderIds);
  await deleteTask(task.id);
}

async function cancelAndReturnEmpty(reminderIds: string[]): Promise<string[]> {
  await cancelScheduledReminders(reminderIds);
  return [];
}
