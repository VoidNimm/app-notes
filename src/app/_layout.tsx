import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'S1: Daftar Tugas' }} />
      <Stack.Screen name="task/form" options={{ title: 'S2: Form Tambah/Edit' }} />
      <Stack.Screen name="task/[id]" options={{ title: 'S3: Detail Tugas' }} />
      <Stack.Screen name="notification-permission" options={{ title: 'S4: Penjelasan Izin Notifikasi' }} />
    </Stack>
  );
}
