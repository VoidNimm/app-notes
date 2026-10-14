import { View, Text, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>S3: Detail Tugas (ID: {id})</Text>
      <Button
        title="Buka S2: Edit Tugas Ini"
        onPress={() => router.push({ pathname: '/task/form', params: { id } })}
      />
      <Button
        title="Kembali ke S1: Daftar Tugas"
        onPress={() => router.push('/')}
      />
    </View>
  );
}
