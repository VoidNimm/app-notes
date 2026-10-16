import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { DeleteDialog } from '@/components/DeleteDialog';
import { Icon } from '@/components/Icon';
import { DesignTokens } from '@/constants/theme';
import { getTaskById } from '@/services/storage';
import { deleteTaskWithReminders, setTaskDone } from '@/services/taskService';
import type { Task } from '@/types/task';

const { colors, spacing, radius, typography, controls, shadows } = DesignTokens;

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatFullDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()} · ${pad(
    d.getHours()
  )}.${pad(d.getMinutes())} WIB`;
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function formatDueRelative(dueAt: number, now: Date = new Date()): string {
  const due = new Date(dueAt);
  const time = `${pad(due.getHours())}.${pad(due.getMinutes())}`;
  const dayDiff = Math.round((startOfDay(due) - startOfDay(now)) / 86400000);
  if (dayDiff === 0) return `Hari ini, ${time}`;
  if (dayDiff === 1) return `Besok, ${time}`;
  if (dayDiff === -1) return `Kemarin, ${time}`;
  return `${HARI[due.getDay()]}, ${due.getDate()} ${BULAN[due.getMonth()]} ${due.getFullYear()} · ${time}`;
}

export default function TaskDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [currentTime] = useState(() => Date.now());
  const [endOfDay] = useState(() => new Date().setHours(23, 59, 59, 999));

  const loadTask = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getTaskById(id);
      if (!data) {
        setLoadError('Tugas tidak ditemukan.');
      } else {
        setTask(data);
        setLoadError(null);
      }
    } catch {
      setLoadError('Gagal memuat detail tugas.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Muat ulang saat pertama dibuka dan saat kembali dari layar form (edit)
  useFocusEffect(
    useCallback(() => {
      void loadTask();
    }, [loadTask])
  );

  const handleToggleDone = async () => {
    if (!task || isToggling) return;
    try {
      setIsToggling(true);
      const updated = await setTaskDone(task, !task.isDone);
      setTask(updated);
    } catch {
      // Error handling jika gagal memperbarui
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = () => {
    if (!task) return;
    router.push({ pathname: '/task/form', params: { id: task.id } });
  };

  const handleConfirmDelete = async () => {
    if (!task || isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteTaskWithReminders(task);
      setShowDeleteModal(false);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch {
      setIsDeleting(false);
    }
  };

  if (loading && !task) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (loadError || !task) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <Icon name="hapus" size={48} color={colors.urgent.text} />
        <Text style={styles.errorTitle}>Tugas Tidak Ditemukan</Text>
        <Text style={styles.errorMessage}>
          {loadError ?? 'Tugas ini mungkin sudah dihapus atau tidak pernah dibuat.'}
        </Text>
        <BackButton label="Kembali ke Daftar" fallbackHref="/" />
      </View>
    );
  }

  const isOverdue = !task.isDone && task.dueAt < currentTime;
  const isToday =
    !task.isDone &&
    task.dueAt >= currentTime &&
    task.dueAt <= endOfDay;

  type BadgeVariant = 'active' | 'done' | 'urgent' | 'today';
  let badgeVariant: BadgeVariant = 'active';
  let statusLabel = 'Aktif';

  if (task.isDone) {
    badgeVariant = 'done';
    statusLabel = 'Selesai';
  } else if (isOverdue) {
    badgeVariant = 'urgent';
    statusLabel = 'Terlambat';
  } else if (isToday) {
    badgeVariant = 'today';
    statusLabel = 'Hari Ini';
  }

  const badgeStyleMap = {
    active: styles.badgeActive,
    done: styles.badgeDone,
    urgent: styles.badgeUrgent,
    today: styles.badgeToday,
  };

  const badgeTextStyleMap = {
    active: styles.badgeTextActive,
    done: styles.badgeTextDone,
    urgent: styles.badgeTextUrgent,
    today: styles.badgeTextToday,
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top + spacing.space3, spacing.space5) },
        ]}
        keyboardShouldPersistTaps="handled">
        {/* Tombol Back terstandarisasi */}
        <BackButton label="Kembali" style={{ marginBottom: spacing.space3 }} />

        {/* Status Badge & Judul */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, badgeStyleMap[badgeVariant]]}>
              <Text style={[styles.badgeText, badgeTextStyleMap[badgeVariant]]}>{statusLabel}</Text>
            </View>
          </View>

          <Text
            style={[
              styles.title,
              task.isDone && styles.titleDone,
            ]}>
            {task.title}
          </Text>

          <View style={styles.divider} />

          {/* Batas Waktu / Deadline */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldHeader}>
              <Icon name="jam" size={18} color={colors.textMuted} />
              <Text style={styles.fieldLabel}>Batas Waktu</Text>
            </View>
            <Text style={styles.fieldValuePrimary}>{formatDueRelative(task.dueAt)}</Text>
            <Text style={styles.fieldValueSecondary}>{formatFullDateTime(task.dueAt)}</Text>
          </View>

          <View style={styles.divider} />

          {/* Mata Kuliah */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldHeader}>
              <Icon name="buku" size={18} color={colors.textMuted} />
              <Text style={styles.fieldLabel}>Mata Kuliah</Text>
            </View>
            <Text
              style={[
                styles.fieldValuePrimary,
                !task.course && styles.fieldValueMuted,
              ]}>
              {task.course ? task.course : 'Tidak ditentukan'}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Catatan / Deskripsi */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Catatan</Text>
            </View>
            <Text
              style={[
                styles.descriptionText,
                !task.description && styles.fieldValueMuted,
              ]}>
              {task.description ? task.description : 'Tidak ada catatan tambahan.'}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Status Pengingat */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldHeader}>
              <Icon name="lonceng" size={18} color={colors.textMuted} />
              <Text style={styles.fieldLabel}>Pengingat</Text>
            </View>
            <Text style={styles.fieldValueSecondary}>
              {task.reminderIds && task.reminderIds.length > 0
                ? `${task.reminderIds.length} pengingat terjadwal`
                : 'Tanpa pengingat aktif'}
            </Text>
            {!task.isDone && (!task.reminderIds || task.reminderIds.length === 0) && (
              <Text style={[styles.fieldValueSecondary, { fontSize: typography.sizes.xs, color: colors.textMuted, marginTop: 4 }]}>
                (Pengingat H-24 jam dan H-3 jam dilewati jika deadline kurang dari 3 jam atau izin notifikasi belum aktif)
              </Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* Metadata: Dibuat, Diperbarui, Selesai */}
          <View style={styles.metaSection}>
            <Text style={styles.metaText}>
              Dibuat: {formatFullDateTime(task.createdAt)}
            </Text>
            <Text style={styles.metaText}>
              Terakhir diubah: {formatFullDateTime(task.updatedAt)}
            </Text>
            {task.isDone && task.doneAt ? (
              <Text style={[styles.metaText, styles.metaDoneText]}>
                Diselesaikan: {formatFullDateTime(task.doneAt)}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Tombol Aksi */}
        <View style={styles.actionContainer}>
          {/* Tombol Tandai / Batalkan Selesai */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={task.isDone ? 'Batalkan status selesai' : 'Tandai tugas selesai'}
            disabled={isToggling}
            onPress={handleToggleDone}
            style={({ pressed }) => [
              styles.actionButton,
              task.isDone ? styles.toggleDoneButton : styles.toggleActiveButton,
              pressed && styles.actionButtonPressed,
            ]}>
            <Icon
              name={task.isDone ? 'lingkaran kosong' : 'centang-lingkaran'}
              size={20}
              color={task.isDone ? colors.text : colors.onPrimary}
            />
            <Text
              style={[
                styles.actionButtonText,
                task.isDone ? styles.toggleDoneButtonText : styles.toggleActiveButtonText,
              ]}>
              {task.isDone ? 'Batalkan Selesai' : 'Tandai Selesai'}
            </Text>
          </Pressable>

          {/* Tombol Ubah */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ubah tugas"
            onPress={handleEdit}
            style={({ pressed }) => [
              styles.actionButton,
              styles.editButton,
              pressed && styles.actionButtonPressed,
            ]}>
            <Icon name="ubah" size={20} color={colors.text} />
            <Text style={styles.editButtonText}>Ubah Tugas</Text>
          </Pressable>

          {/* Tombol Hapus */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hapus tugas"
            onPress={() => setShowDeleteModal(true)}
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.actionButtonPressed,
            ]}>
            <Icon name="hapus" size={20} color={colors.urgent.text} />
            <Text style={styles.deleteButtonText}>Hapus Tugas</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Dialog Konfirmasi Hapus */}
      <DeleteDialog
        visible={showDeleteModal}
        taskTitle={task.title}
        isDeleting={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.space4,
    paddingBottom: spacing.space8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    padding: spacing.space4,
    gap: spacing.space3,
  },
  errorTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  errorMessage: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: controls.touchTargetMin,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space2,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.space3,
  },
  backButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  backButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.space5,
    ...shadows.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.space3,
  },
  badge: {
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space1,
    borderRadius: radius.full,
  },
  badgeActive: {
    backgroundColor: colors.week.bg,
  },
  badgeTextActive: {
    color: colors.week.text,
  },
  badgeDone: {
    backgroundColor: colors.done.bg,
  },
  badgeTextDone: {
    color: colors.done.text,
  },
  badgeUrgent: {
    backgroundColor: colors.urgent.bg,
  },
  badgeTextUrgent: {
    color: colors.urgent.text,
  },
  badgeToday: {
    backgroundColor: colors.today.bg,
  },
  badgeTextToday: {
    color: colors.today.text,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: 30,
    marginBottom: spacing.space4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.space3,
  },
  fieldSection: {
    gap: 4,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space2,
    marginBottom: 2,
  },
  fieldLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  fieldValuePrimary: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  fieldValueSecondary: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  fieldValueMuted: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  descriptionText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: 22,
  },
  metaSection: {
    gap: 4,
    paddingTop: spacing.space1,
  },
  metaText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  metaDoneText: {
    color: colors.done.text,
    fontWeight: typography.weights.medium,
  },
  actionContainer: {
    marginTop: spacing.space5,
    gap: spacing.space3,
  },
  actionButton: {
    minHeight: controls.controlH,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.space2,
    paddingHorizontal: spacing.space4,
  },
  actionButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  actionButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  toggleActiveButton: {
    backgroundColor: colors.surfaceDark,
    ...shadows.sm,
  },
  toggleActiveButtonText: {
    color: colors.textOnDark,
  },
  toggleDoneButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  toggleDoneButtonText: {
    color: colors.text,
  },
  editButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  editButtonText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  deleteButton: {
    backgroundColor: colors.urgent.bg,
    borderWidth: 1,
    borderColor: colors.urgent.text,
  },
  deleteButtonText: {
    color: colors.urgent.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});
