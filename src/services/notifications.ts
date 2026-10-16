import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { getAllScheduledNotificationsAsync } from 'expo-notifications/build/getAllScheduledNotificationsAsync';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { getUserNotificationConsent, setUserNotificationConsent } from '@/services/storage';
import { Task } from '@/types/task';

/**
 * ID dan nama kanal notifikasi Android untuk pengingat tugas.
 * Importance kanal TIDAK bisa diubah setelah dibuat (batasan OS Android; hanya nama dan deskripsi
 * yang bisa diubah), karena itu kanal lama 'default' tidak dipakai lagi.
 */
export const REMINDER_CHANNEL_ID = 'task-reminders';
export const REMINDER_CHANNEL_NAME = 'Pengingat tugas';

/**
 * Margin keamanan: pengingat hanya dijadwalkan jika waktunya lebih dari (sekarang + margin ini),
 * agar tidak menjadwalkan waktu yang sudah atau hampir lewat saat dipanggil.
 */
export const REMINDER_MARGIN_MS = 5000;

const HOUR_MS = 60 * 60 * 1000;

/** Selisih waktu pengingat sebelum deadline (PRD Bagian 9): 24 jam dan 3 jam. */
export const REMINDER_OFFSETS_MS: readonly number[] = [24 * HOUR_MS, 3 * HOUR_MS];

let isHandlerConfigured = false;
let isChannelReady = false;

/**
 * Mengonfigurasi notification handler agar notifikasi dapat muncul saat aplikasi aktif (foreground).
 * Aman dipanggil berulang kali dan terbungkus try-catch.
 */
export function configureNotificationHandler(): void {
  if (isHandlerConfigured) return;
  try {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    isHandlerConfigured = true;
  } catch (error) {
    console.warn('[notifications] Gagal mengatur notification handler:', error);
  }
}

/**
 * Menyiapkan notification channel "Pengingat tugas" untuk Android.
 * Harus dipanggil SEBELUM izin diminta (Android 13: prompt izin baru muncul setelah ada kanal)
 * dan sebelum penjadwalan pertama. Importance HIGH agar pengingat deadline tampil sebagai banner
 * dan berbunyi.
 *
 * Catatan untuk Expo Go:
 * Di lingkungan Expo Go Android, NotificationsChannelsProvider bernilai null
 * sehingga pemanggilan setNotificationChannelAsync akan memicu NullPointerException / warning.
 * Notifikasi lokal di Expo Go tetap terkirim normal dengan channel bawaan sistem.
 * Karena itu, pemanggilan dilewati saat berjalan di Expo Go, dan jika terjadi error di lingkungan
 * build mandiri, ditangani secara senyap tanpa console.warn agar tidak memicu LogBox popup.
 */
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  if (isRunningInExpoGo()) {
    return;
  }
  if (isChannelReady) return;
  try {
    await setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
      name: REMINDER_CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    isChannelReady = true;
  } catch {
    // Tangani error secara senyap agar tidak mengganggu pengalaman pengguna
  }
}

/**
 * channelId hanya disertakan di trigger jika kanal benar-benar sudah dibuat (Android build mandiri).
 * Di Expo Go atau jika pembuatan kanal gagal, trigger memakai kanal cadangan bawaan Expo.
 */
function channelOption(): { channelId?: string } {
  return isChannelReady ? { channelId: REMINDER_CHANNEL_ID } : {};
}

/**
 * Meminta izin notifikasi ke pengguna.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    await setupNotificationChannel();
    const { status: existingStatus } = await getPermissionsAsync();
    let granted = existingStatus === 'granted';
    if (!granted) {
      const { status } = await requestPermissionsAsync();
      granted = status === 'granted';
    }
    await setUserNotificationConsent(granted);
    return granted;
  } catch (error) {
    console.warn('[notifications] Gagal meminta izin notifikasi:', error);
    await setUserNotificationConsent(false);
    return false;
  }
}

/**
 * Memeriksa status izin notifikasi saat ini.
 * Memeriksa izin sistem OS sekaligus memastikan pengguna tidak memilih 'Nanti Saja'.
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await getPermissionsAsync();
    const isOsGranted = status === 'granted';

    if (!isOsGranted) {
      return false;
    }

    // Jika di OS granted (mis. izin Expo Go sudah pernah diberikan sebelumnya),
    // periksa apakah pengguna secara eksplisit menolak ("Nanti Saja") di dalam aplikasi.
    const consent = await getUserNotificationConsent();
    if (consent === false) {
      return false;
    }

    return true;
  } catch (error) {
    console.warn('[notifications] Gagal memeriksa izin notifikasi:', error);
    return false;
  }
}

/**
 * Mendapatkan detail status izin notifikasi (status OS dan persetujuan user).
 */
export async function getNotificationPermissionDetails(): Promise<{
  osStatus: string;
  userConsent: boolean | null;
  effectiveGranted: boolean;
}> {
  try {
    const { status } = await getPermissionsAsync();
    const consent = await getUserNotificationConsent();
    return {
      osStatus: status,
      userConsent: consent,
      effectiveGranted: status === 'granted' && consent !== false,
    };
  } catch (error) {
    console.warn('[notifications] Gagal memeriksa detail izin notifikasi:', error);
    return {
      osStatus: 'undetermined',
      userConsent: null,
      effectiveGranted: false,
    };
  }
}

/**
 * Fungsi pembantu untuk menguji penjadwalan notifikasi lokal (default: 5 detik).
 */
export async function scheduleTestNotification(seconds: number = 5): Promise<string> {
  configureNotificationHandler();
  await setupNotificationChannel();

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    throw new Error('Izin notifikasi belum diberikan atau dinonaktifkan di pengaturan.');
  }

  const notificationId = await scheduleNotificationAsync({
    content: {
      title: '🔔 Pengingat Tugas Kuliah (Uji)',
      body: `Uji notifikasi lokal (${seconds} detik) berhasil masuk! Suara dan banner aktif.`,
      sound: true,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      ...channelOption(),
      seconds,
      repeats: false,
    },
  });

  return notificationId;
}

/**
 * Mengambil jumlah total notifikasi yang saat ini sedang aktif terjadwal di perangkat.
 */
export async function getActiveScheduledNotificationsCount(): Promise<number> {
  try {
    const list = await getAllScheduledNotificationsAsync();
    return list.length;
  } catch (error) {
    console.warn('[notifications] Gagal memeriksa daftar notifikasi terjadwal:', error);
    return 0;
  }
}

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/**
 * Format deadline absolut untuk isi notifikasi, mis. "Senin, 19 Okt 2026, 23.59".
 * Sengaja tidak relatif ("Hari ini") karena notifikasi muncul di waktu yang berbeda dari saat dijadwalkan.
 */
function formatDeadlineLabel(dueAt: number): string {
  const d = new Date(dueAt);
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}, ${pad(
    d.getHours()
  )}.${pad(d.getMinutes())}`;
}

/**
 * Menghitung waktu (timestamp) pengingat yang layak dijadwalkan untuk suatu deadline.
 * Hanya waktu yang lebih besar dari (now + REMINDER_MARGIN_MS) yang disertakan; sisanya dilewati.
 * Fungsi murni: tidak menyentuh API notifikasi.
 */
export function computeReminderTimes(dueAt: number, now: number = Date.now()): number[] {
  return REMINDER_OFFSETS_MS.map((offset) => dueAt - offset).filter(
    (time) => time > now + REMINDER_MARGIN_MS
  );
}

/**
 * Membatalkan notifikasi terjadwal berdasarkan daftar ID notifikasi (reminderIds).
 * Best-effort dan tidak pernah melempar error: dokumentasi Expo menyatakan membatalkan ID yang tidak
 * ada tidak menghasilkan error, dan kegagalan pembatalan tidak boleh menghalangi aksi pengguna
 * (mis. menghapus tugas).
 */
export async function cancelScheduledReminders(reminderIds: string[]): Promise<void> {
  const results = await Promise.allSettled(
    reminderIds.map((id) => cancelScheduledNotificationAsync(id))
  );
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(
        `[notifications] Gagal membatalkan pengingat ${reminderIds[index]}:`,
        result.reason
      );
    }
  });
}

/**
 * Menjadwalkan pengingat notifikasi untuk tugas tertentu.
 * Mengembalikan daftar reminderIds yang terjadwal.
 *
 * Mengembalikan [] (tanpa error) jika: tugas sudah selesai, tidak ada waktu pengingat yang masih di
 * masa depan, izin notifikasi tidak diberikan, atau penjadwalan gagal. Jika penjadwalan gagal di
 * tengah jalan, pengingat yang sudah terlanjur terjadwal dibatalkan agar tidak ada pengingat yatim.
 */
export async function scheduleTaskReminders(
  task: Task,
  now: number = Date.now()
): Promise<string[]> {
  if (task.isDone) return [];

  const times = computeReminderTimes(task.dueAt, now);
  if (times.length === 0) return [];

  if (!(await checkNotificationPermissions())) return [];

  configureNotificationHandler();
  await setupNotificationChannel();

  const body = `${task.course ? `${task.course} · ` : ''}Deadline ${formatDeadlineLabel(task.dueAt)}`;
  const scheduledIds: string[] = [];
  try {
    for (const time of times) {
      const id = await scheduleNotificationAsync({
        content: {
          title: task.title,
          body,
          sound: true,
          data: { taskId: task.id },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: time,
          ...channelOption(),
        },
      });
      scheduledIds.push(id);
    }
  } catch (error) {
    console.warn('[notifications] Gagal menjadwalkan pengingat:', error);
    await cancelScheduledReminders(scheduledIds);
    return [];
  }
  return scheduledIds;
}

/**
 * Menjadwalkan ulang notifikasi pengingat untuk suatu tugas.
 * Membatalkan pengingat lama (task.reminderIds), lalu menjadwalkan pengingat baru dari deadline saat ini.
 * Mengembalikan reminderIds yang baru.
 */
export async function rescheduleTaskReminders(
  task: Task,
  now: number = Date.now()
): Promise<string[]> {
  await cancelScheduledReminders(task.reminderIds);
  return scheduleTaskReminders(task, now);
}
