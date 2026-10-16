import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@expo/ui/community/datetime-picker';

import { BackButton } from '@/components/BackButton';
import { CourseSelectorPills } from '@/components/CourseSelectorPills';
import { Icon } from '@/components/Icon';
import { DesignTokens } from '@/constants/theme';
import { getTaskById } from '@/services/storage';
import { createTaskWithReminders, updateTaskWithReminders } from '@/services/taskService';
import type { Task } from '@/types/task';

const { colors, spacing, radius, typography, controls } = DesignTokens;

const TITLE_MAX = 120;
const COURSE_MAX = 80;

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

type PresetKey = 'tonight' | 'tomorrow' | 'dayAfter';

const PRESETS: { key: PresetKey; label: string; offsetDays: number }[] = [
  { key: 'tonight', label: 'Malam ini 23.59', offsetDays: 0 },
  { key: 'tomorrow', label: 'Besok 23.59', offsetDays: 1 },
  { key: 'dayAfter', label: 'Lusa 23.59', offsetDays: 2 },
];

/** Hari ini + offset, pukul 23.59 waktu perangkat. */
function presetDate(offsetDays: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(23, 59, 0, 0);
  return d;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatDeadline(d: Date): string {
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${pad(
    d.getHours()
  )}.${pad(d.getMinutes())}`;
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

type PickerStep = null | 'date' | 'time';

export default function TaskFormScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, course: prefillCourse } = useLocalSearchParams<{ id?: string; course?: string }>();
  const isEdit = Boolean(id);

  const [existing, setExisting] = useState<Task | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [course, setCourse] = useState(prefillCourse ?? '');
  const [description, setDescription] = useState('');
  const [dueAt, setDueAt] = useState<Date>(() => presetDate(1)); // default: Besok 23.59
  const [pickerStep, setPickerStep] = useState<PickerStep>(null);
  const [pendingDate, setPendingDate] = useState<Date>(() => presetDate(1));
  const [iosPickerOpen, setIosPickerOpen] = useState(false);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Mode edit: muat tugas berdasarkan id, termasuk deadline tersimpan.
  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        const task = await getTaskById(id);
        if (!active) return;
        if (!task) {
          setLoadError('Tugas tidak ditemukan.');
        } else {
          setExisting(task);
          setTitle(task.title);
          setCourse(task.course ?? '');
          setDescription(task.description ?? '');
          setDueAt(new Date(task.dueAt));
        }
      } catch {
        if (active) setLoadError('Gagal memuat tugas.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  // Chip terpilih = preset yang waktunya sama dengan deadline saat ini; selain itu "Pilih sendiri".
  const selectedPreset = PRESETS.find((p) => presetDate(p.offsetDays).getTime() === dueAt.getTime());

  const onSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError('Judul tugas wajib diisi.');
      return;
    }
    setTitleError(null);
    setSaveError(null);
    setSaving(true);
    try {
      const now = Date.now();
      const courseValue = course.trim() || undefined;
      const descValue = description.trim() || undefined;
      if (isEdit && existing) {
        await updateTaskWithReminders({
          ...existing,
          title: trimmed,
          course: courseValue,
          description: descValue,
          dueAt: dueAt.getTime(),
          updatedAt: now,
        });
      } else {
        await createTaskWithReminders({
          id: newId(),
          title: trimmed,
          course: courseValue,
          description: descValue,
          dueAt: dueAt.getTime(),
          isDone: false,
          doneAt: null,
          createdAt: now,
          updatedAt: now,
          reminderIds: [],
        });
      }
      router.back();
    } catch {
      setSaveError('Gagal menyimpan tugas. Coba lagi.');
      setSaving(false);
    }
  };

  const openCustom = () => {
    if (Platform.OS === 'ios') {
      setIosPickerOpen((v) => !v);
    } else {
      setPendingDate(dueAt);
      setPickerStep('date');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>{loadError}</Text>
        <BackButton label="Kembali" style={{ marginBottom: spacing.space3 }} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top + spacing.space3, spacing.space5) },
      ]}
      keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ headerShown: false }} />

      <BackButton label="Kembali" style={{ marginBottom: spacing.space3 }} />

      <Text style={styles.pageTitle}>{isEdit ? 'Ubah Tugas' : 'Tambah Tugas'}</Text>

      <Text style={styles.label}>Judul Tugas</Text>
      <TextInput
        style={[styles.input, titleError ? styles.inputError : null]}
        value={title}
        onChangeText={(t) => {
          setTitle(t);
          if (titleError) setTitleError(null);
        }}
        placeholder="Contoh: Laporan praktikum 3"
        placeholderTextColor={colors.textMuted}
        maxLength={TITLE_MAX}
        autoFocus
        returnKeyType="next"
      />
      {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

      <Text style={styles.label}>Batas Waktu</Text>
      <View style={styles.chipRow}>
        {PRESETS.map((p) => {
          const selected = selectedPreset?.key === p.key;
          return (
            <Pressable
              key={p.key}
              onPress={() => {
                setDueAt(presetDate(p.offsetDays));
                setIosPickerOpen(false);
              }}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}>
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{p.label}</Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={openCustom}
          style={[styles.chip, !selectedPreset && styles.chipSelected]}
          accessibilityRole="button"
          accessibilityState={{ selected: !selectedPreset }}>
          <Icon
            name="jam"
            size={16}
            color={!selectedPreset ? colors.onPrimary : colors.text}
          />
          <Text style={[styles.chipText, !selectedPreset && styles.chipTextSelected]}>
            Pilih sendiri
          </Text>
        </Pressable>
      </View>
      <Text style={styles.deadlineSummary}>Deadline: {formatDeadline(dueAt)}</Text>

      {Platform.OS === 'ios' && iosPickerOpen ? (
        // iOS: prop presentation diabaikan (selalu inline). Perilaku di iOS tidak bisa dikonfirmasi (belum diuji).
        <DateTimePicker
          value={dueAt}
          mode="datetime"
          onValueChange={(_e, selected) => setDueAt(selected)}
        />
      ) : null}

      {/* Android: dialog dilepas (unmount) saat onValueChange atau onDismiss terpanggil. */}
      {Platform.OS === 'android' && pickerStep === 'date' ? (
        <DateTimePicker
          key="date"
          value={pendingDate}
          mode="date"
          presentation="dialog"
          onValueChange={(_e, selected) => {
            setPendingDate(selected);
            setPickerStep('time');
          }}
          onDismiss={() => setPickerStep(null)}
        />
      ) : null}
      {Platform.OS === 'android' && pickerStep === 'time' ? (
        <DateTimePicker
          key="time"
          value={pendingDate}
          mode="time"
          presentation="dialog"
          is24Hour
          onValueChange={(_e, selected) => {
            const result = new Date(pendingDate);
            result.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
            setDueAt(result);
            setPickerStep(null);
          }}
          onDismiss={() => setPickerStep(null)}
        />
      ) : null}

      <Text style={styles.label}>Mata Kuliah (opsional)</Text>
      <CourseSelectorPills
        selectedCourse={course}
        onSelectCourse={(selected) => setCourse(selected)}
      />
      <TextInput
        style={styles.input}
        value={course}
        onChangeText={setCourse}
        placeholder="Pilih atau ketik nama mata kuliah..."
        placeholderTextColor={colors.textMuted}
        maxLength={COURSE_MAX}
      />

      <Text style={styles.label}>Catatan (opsional)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        placeholder="Detail tugas, tautan, dll."
        placeholderTextColor={colors.textMuted}
        multiline
        textAlignVertical="top"
      />

      {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

      <Pressable
        onPress={onSave}
        disabled={saving}
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        accessibilityRole="button">
        <Text style={styles.saveButtonText}>{saving ? 'Menyimpan…' : 'Simpan'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.space4, paddingBottom: spacing.space10 },
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
  pageTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: spacing.space2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    padding: spacing.space4,
    gap: spacing.space3,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
    marginTop: spacing.space5,
    marginBottom: spacing.space2,
  },
  input: {
    minHeight: controls.controlH,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  inputError: { borderColor: colors.urgent.text },
  multiline: { minHeight: 96 },
  errorText: {
    color: colors.urgent.text,
    fontSize: typography.sizes.sm,
    marginTop: spacing.space2,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.space2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space1,
    minHeight: controls.touchTargetMin,
    paddingHorizontal: spacing.space3,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: typography.sizes.sm, color: colors.text },
  chipTextSelected: { color: colors.onPrimary, fontWeight: typography.weights.medium },
  deadlineSummary: {
    marginTop: spacing.space2,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  saveButton: {
    marginTop: spacing.space6,
    minHeight: controls.controlH,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: {
    color: colors.onPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});
