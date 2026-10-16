import { Stack } from 'expo-router';

import { configureNotificationHandler } from '@/services/notifications';

// Handler harus aktif sejak aplikasi dimulai agar notifikasi tampil saat aplikasi terbuka.
configureNotificationHandler();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="task/form"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen name="task/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="notification-permission" options={{ headerShown: false }} />
    </Stack>
  );
}
