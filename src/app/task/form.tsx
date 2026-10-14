import { View, Text, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function TaskFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <View>
      <Text>S2: Form {id ? `Edit Tugas (ID: ${id})` : 'Tambah Tugas'}</Text>
      <Button
        title="Kembali ke S1: Daftar Tugas"
        onPress={() => router.push('/')}
      />
    </View>
  );
}
