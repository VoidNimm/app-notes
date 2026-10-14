import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function TaskListScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>S1: Daftar Tugas</Text>

      <Button
        title="Buka S2: Form Tambah Tugas"
        onPress={() => router.push('/task/form')}
      />
      <Button
        title="Buka S3: Detail Tugas (Contoh ID: contoh-1)"
        onPress={() => router.push({ pathname: '/task/[id]', params: { id: 'contoh-1' } })}
      />
      <Button
        title="Buka S4: Penjelasan Izin Notifikasi"
        onPress={() => router.push('/notification-permission')}
      />
    </View>
  );
}
