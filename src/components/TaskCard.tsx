import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { DesignTokens, type VibrantColorKey } from '@/constants/theme';
import { getCourseByName } from '@/constants/courses';
import { NO_BG_ICONS } from '@/constants/iconAssets';
import type { Task } from '@/types/task';

const { spacing, typography, shadows } = DesignTokens;

export type TaskCardVariant = 'urgent' | 'today' | 'week' | 'later' | 'done';

export interface TaskCardPalette {
  bg: string;
  text: string;
  muted: string;
  isLight: boolean;
}

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Format deadline standar: "Hari ini, 21.00", "Besok, 23.59", "Lusa, 23.59", "Senin, 19 Okt 2026, 23.59". */
export function formatDue(dueAt: number, now: Date = new Date()): string {
  const due = new Date(dueAt);
  const time = `${String(due.getHours()).padStart(2, '0')}.${String(due.getMinutes()).padStart(2, '0')}`;
  const dayDiff = Math.round((startOfDay(due) - startOfDay(now)) / 86400000);
  if (dayDiff === 0) return `Hari ini, ${time}`;
  if (dayDiff === 1) return `Besok, ${time}`;
  if (dayDiff === 2) return `Lusa, ${time}`;
  if (dayDiff === -1) return `Kemarin, ${time}`;
  return `${HARI[due.getDay()]}, ${due.getDate()} ${BULAN[due.getMonth()]} ${due.getFullYear()}, ${time}`;
}

/** Format jam/tanggal ringkas seperti layar "Chats" ("11:01 am" / "Besok 23.59" / "Lusa 23.59") */
export function formatChatDue(dueAt: number, now: Date = new Date()): string {
  const due = new Date(dueAt);
  const time = `${String(due.getHours()).padStart(2, '0')}.${String(due.getMinutes()).padStart(2, '0')}`;
  const dayDiff = Math.round((startOfDay(due) - startOfDay(now)) / 86400000);
  if (dayDiff === 0) return time;
  if (dayDiff === 1) return `Besok ${time}`;
  if (dayDiff === 2) return `Lusa ${time}`;
  if (dayDiff === -1) return `Kemarin ${time}`;
  return `${due.getDate()} ${BULAN[due.getMonth()]}`;
}

/** Palet warna vibrant mengacu ke layar "Chats" dan "Saved" di reference.jpg */
export const VIBRANT_PALETTES: Record<TaskCardVariant, TaskCardPalette> = {
  urgent: {
    bg: DesignTokens.colors.vibrant.coral.bg, // #ff6562 (Coral)
    text: DesignTokens.colors.vibrant.coral.text, // #161513
    muted: 'rgba(22, 21, 19, 0.70)',
    isLight: true,
  },
  today: {
    bg: DesignTokens.colors.vibrant.yellow.bg, // #ffd027 (Yellow)
    text: DesignTokens.colors.vibrant.yellow.text, // #161513
    muted: 'rgba(22, 21, 19, 0.70)',
    isLight: true,
  },
  week: {
    bg: DesignTokens.colors.vibrant.blue.bg, // #2563eb (Royal Blue)
    text: DesignTokens.colors.vibrant.blue.text, // #ffffff
    muted: 'rgba(255, 255, 255, 0.80)',
    isLight: false,
  },
  later: {
    bg: DesignTokens.colors.vibrant.lavender.bg, // #c7b5eb (Lavender)
    text: DesignTokens.colors.vibrant.lavender.text, // #161513
    muted: 'rgba(22, 21, 19, 0.70)',
    isLight: true,
  },
  done: {
    bg: DesignTokens.colors.vibrant.mint.bg, // #36d399 (Mint)
    text: DesignTokens.colors.vibrant.mint.text, // #161513
    muted: 'rgba(22, 21, 19, 0.65)',
    isLight: true,
  },
};

function resolvePalette(
  variant: TaskCardVariant,
  colorKey?: VibrantColorKey,
  courseName?: string
): TaskCardPalette {
  if (colorKey && DesignTokens.colors.vibrant[colorKey]) {
    const pair = DesignTokens.colors.vibrant[colorKey];
    const isLight = pair.text !== '#ffffff';
    return {
      bg: pair.bg,
      text: pair.text,
      muted: isLight ? 'rgba(22, 21, 19, 0.70)' : 'rgba(255, 255, 255, 0.80)',
      isLight,
    };
  }

  // Jika mata kuliah terdaftar dan status bukan selesai / urgent, kita bisa menyelaraskan dengan warna folder matkul
  if (courseName && variant !== 'done' && variant !== 'urgent') {
    const matched = getCourseByName(courseName);
    if (matched && DesignTokens.colors.vibrant[matched.colorKey]) {
      const pair = DesignTokens.colors.vibrant[matched.colorKey];
      const isLight = pair.text !== '#ffffff';
      return {
        bg: pair.bg,
        text: pair.text,
        muted: isLight ? 'rgba(22, 21, 19, 0.70)' : 'rgba(255, 255, 255, 0.80)',
        isLight,
      };
    }
  }

  return VIBRANT_PALETTES[variant] ?? VIBRANT_PALETTES.today;
}

export interface TaskCardProps {
  task: Task;
  variant: TaskCardVariant;
  colorKey?: VibrantColorKey;
  onToggleDone: (task: Task) => void;
  onPress: (task: Task) => void;
  style?: StyleProp<ViewStyle>;
}

export function TaskCard({
  task,
  variant,
  colorKey,
  onToggleDone,
  onPress,
  style,
}: TaskCardProps) {
  const isDone = variant === 'done' || task.isDone;
  const palette = resolvePalette(variant, colorKey, task.course);
  const dueChat = formatChatDue(task.dueAt);
  const dueFull = formatDue(task.dueAt);
  const courseDisplay = task.course?.trim() || 'Tugas Kuliah';

  // Ikon 3D acak dari assets/images/icons-no-bg/ untuk card:
  // 1. avatar di kiri (menggantikan teks inisial)
  // 2. stiker 3D di posisi lingkaran merah (sebelah kanan sebelum badge)
  const taskIcons = useMemo(() => {
    let hash = 0;
    const key = (task.id || '') + (task.title || '') + (task.course || '');
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    const avatarIndex = Math.abs(hash) % NO_BG_ICONS.length;
    const stickerIndex = (avatarIndex + 4) % NO_BG_ICONS.length;
    return {
      avatar: NO_BG_ICONS[avatarIndex],
      sticker: NO_BG_ICONS[stickerIndex],
    };
  }, [task.id, task.title, task.course]);

  // Badge indikator hitam di kanan: jumlah pengingat aktif, tanda seru urgent, atau centang selesai
  let badgeText = '1';
  if (isDone) {
    badgeText = '✓';
  } else if (task.reminderIds && task.reminderIds.length > 0) {
    badgeText = String(task.reminderIds.length);
  } else if (variant === 'urgent') {
    badgeText = '!';
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${task.title}${task.course ? `, ${task.course}` : ''}, ${dueFull}${isDone ? ', selesai' : ''}`}
      onPress={() => onPress(task)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: palette.bg },
        pressed && styles.pressed,
        style,
      ]}>
      {/* Kiri: Lingkaran checkbox/avatar berukuran proporsional (target sentuh >= 44px) */}
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isDone }}
        accessibilityLabel={isDone ? `Batalkan selesai: ${task.title}` : `Tandai selesai: ${task.title}`}
        hitSlop={8}
        onPress={() => onToggleDone(task)}
        style={styles.avatarTouchArea}>
        <View
          style={[
            styles.avatarCircle,
            isDone
              ? { backgroundColor: palette.isLight ? '#161513' : '#ffffff' }
              : {
                  backgroundColor: palette.isLight
                    ? 'rgba(255, 255, 255, 0.85)'
                    : 'rgba(255, 255, 255, 0.25)',
                },
          ]}>
          {isDone ? (
            <Text
              style={[
                styles.checkMarkText,
                { color: palette.isLight ? '#ffffff' : '#161513' },
              ]}>
              ✓
            </Text>
          ) : (
            <Image
              source={taskIcons.avatar}
              style={styles.avatarIcon}
              resizeMode="contain"
            />
          )}
        </View>
      </Pressable>

      {/* Tengah: Baris atas Nama Matkul & Waktu, Baris bawah Judul & Cuplikan Deskripsi */}
      <View style={styles.contentBody}>
        <View style={styles.topRow}>
          <Text
            style={[
              styles.courseTitle,
              { color: palette.text },
              isDone && styles.strike,
            ]}
            numberOfLines={1}>
            {courseDisplay}
          </Text>
          <Text style={[styles.dueTimeText, { color: palette.muted }]} numberOfLines={1}>
            {dueChat}
          </Text>
        </View>

        <Text
          style={[
            styles.titleText,
            { color: palette.text },
            isDone && styles.strike,
          ]}
          numberOfLines={2}>
          {task.title}
          {task.description ? (
            <Text style={[styles.descText, { color: palette.muted }]}>
              {` — ${task.description.trim().replace(/\s+/g, ' ')}`}
            </Text>
          ) : null}
        </Text>
      </View>

      {/* Posisi lingkaran merah: Ikon 3D acak di kanan kartu mengacu referensi */}
      <View style={styles.cardStickerWrap}>
        <Image
          source={taskIcons.sticker}
          style={styles.cardStickerIcon}
          resizeMode="contain"
        />
      </View>

      {/* Kanan: Lencana bulat hitam kecil (badge indikator status/pengingat seperti di layar "Chats") */}
      <View style={styles.badgeColumn}>
        <View style={styles.blackBadge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      </View>

      {/* Aksen ekor bubble kecil (speech bubble tail) di sudut bawah seperti referensi */}
      <View
        style={[
          styles.bubbleTail,
          { backgroundColor: palette.bg },
        ]}
        pointerEvents="none"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    borderRadius: 30, // Kapsul membulat penuh 28-32px
    paddingVertical: spacing.space3,
    paddingHorizontal: spacing.space4,
    gap: spacing.space3,
    marginBottom: spacing.space2,
    overflow: 'visible',
    ...shadows.sm,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  avatarTouchArea: {
    minWidth: 44,
    minHeight: 44,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  avatarIcon: {
    width: typography.sizes.xl,
    height: typography.sizes.xl,
  },
  checkMarkText: {
    fontSize: 16,
    fontWeight: '800',
  },
  contentBody: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 2,
  },
  courseTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    flexShrink: 1,
  },
  dueTimeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
  },
  titleText: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.medium,
    lineHeight: 18,
  },
  descText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.regular,
  },
  strike: {
    textDecorationLine: 'line-through',
    opacity: 0.65,
  },
  cardStickerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.space1,
    marginRight: 2,
  },
  cardStickerIcon: {
    width: 28,
    height: 28,
  },
  badgeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  blackBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#161513',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 13,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -3,
    right: 32,
    width: 14,
    height: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 3,
    transform: [{ rotate: '25deg' }],
    zIndex: 1,
  },
});
