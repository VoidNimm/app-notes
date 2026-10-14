import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotificationPermissionScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>S4: Penjelasan Izin Notifikasi</Text>
      <Button
        title="Kembali ke S1: Daftar Tugas"
        onPress={() => router.push('/')}
      />
    </View>
  );
}
