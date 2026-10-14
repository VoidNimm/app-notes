import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { Task } from '@/types/task';

let isHandlerConfigured = false;

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
 * Menyiapkan default notification channel untuk Android.
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
  try {
    await setNotificationChannelAsync('default', {
      name: 'Default Notifications',
      importance: AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  } catch {
    // Tangani error secara senyap agar tidak mengganggu pengalaman pengguna
  }
}

/**
 * Meminta izin notifikasi ke pengguna.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await getPermissionsAsync();
    if (existingStatus === 'granted') {
      return true;
    }
    const { status } = await requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.warn('[notifications] Gagal meminta izin notifikasi:', error);
    return false;
  }
}

/**
 * Memeriksa status izin notifikasi saat ini.
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.warn('[notifications] Gagal memeriksa izin notifikasi:', error);
    return false;
  }
}

/**
 * Fungsi pembantu untuk menguji penjadwalan notifikasi lokal (misal: 60 detik).
 */
export async function scheduleTestNotification(seconds: number = 60): Promise<string> {
  configureNotificationHandler();
  await setupNotificationChannel();

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    throw new Error('Izin notifikasi tidak diberikan oleh pengguna.');
  }

  const notificationId = await scheduleNotificationAsync({
    content: {
      title: 'Uji Notifikasi Lokal',
      body: `Notifikasi ${seconds} detik berhasil masuk!`,
      sound: true,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      channelId: 'default',
      seconds,
      repeats: false,
    },
  });

  return notificationId;
}

/**
 * Menjadwalkan pengingat notifikasi untuk tugas tertentu.
 * Mengembalikan daftar reminderIds yang terjadwal.
 */
export async function scheduleTaskReminders(task: Task): Promise<string[]> {
  // TODO: Jadwalkan notifikasi berdasarkan dueAt dan aturan pengingat, kembalikan daftar ID notifikasi
  throw new Error('Not implemented');
}

/**
 * Membatalkan notifikasi terjadwal berdasarkan daftar ID notifikasi (reminderIds).
 */
export async function cancelScheduledReminders(reminderIds: string[]): Promise<void> {
  // TODO: Batalkan notifikasi terjadwal di sistem berdasarkan reminderIds
  throw new Error('Not implemented');
}

/**
 * Menjadwalkan ulang notifikasi pengingat untuk suatu tugas.
 */
export async function rescheduleTaskReminders(task: Task): Promise<string[]> {
  // TODO: Batalkan pengingat lama lalu jadwalkan ulang pengingat baru
  throw new Error('Not implemented');
}
