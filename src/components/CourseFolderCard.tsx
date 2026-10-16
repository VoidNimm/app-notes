import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { DesignTokens } from '@/constants/theme';
import type { Course } from '@/constants/courses';

// Aset Ikon Buku "Biasa" dan "Akhirannya 2" dari /assets
const bookIconBiasa = require('../../assets/Book.png'); // Lavender (biasa)
const bookIcon2 = require('../../assets/Book2.png'); // Orange (akhiran 2)
const bookAndPencilBiasa = require('../../assets/Book And Pencil.png'); // Mint (biasa)
const bookAndPencil2 = require('../../assets/Book And Pencil2.png'); // Yellow (akhiran 2)

// Variasi warna sesuai palet vibrant design.md (Coral, Blue, dll)
const bookIconCoral = require('../../assets/Book-coral.png');
const bookIconBlue = require('../../assets/Book-blue.png');
const bookAndPencilCoral = require('../../assets/Book And Pencil-coral.png');
const bookAndPencilBlue = require('../../assets/Book And Pencil-blue.png');

interface PeekIcons {
  left: any;
  right: any;
}

/**
 * Memilih pasangan ikon buku (dari yang biasa, akhirannya 2, dan variasi warna design.md)
 * agar setiap folder memiliki perpaduan warna yang ekspresif, kontras, dan harmonis.
 */
function getCoursePeekIcons(courseId: string, colorKey: string): PeekIcons {
  switch (courseId) {
    case 'konsep-si-ti':
      // Folder Biru: Variasi akhirannya 2 (Kuning & Oranye) kontras sempurna
      return {
        left: bookAndPencil2, // Yellow (akhiran 2)
        right: bookIcon2,     // Orange (akhiran 2)
      };
    case 'fisika-kimia-dasar':
      // Folder Kuning: Variasi biasa (Mint & Lavender)
      return {
        left: bookAndPencilBiasa, // Mint (biasa)
        right: bookIconBiasa,     // Lavender (biasa)
      };
    case 'algoritma-pemrograman-1':
      // Folder Oranye: Variasi Biru & Lavender biasa
      return {
        left: bookAndPencilBlue,  // Blue
        right: bookIconBiasa,     // Lavender (biasa)
      };
    case 'matematika-dasar-1':
      // Folder Lavender: Variasi akhirannya 2 (Kuning & Oranye)
      return {
        left: bookAndPencil2, // Yellow (akhiran 2)
        right: bookIcon2,     // Orange (akhiran 2)
      };
    case 'digital-citizenship':
      // Folder Coral: Variasi biasa (Mint) & Biru
      return {
        left: bookAndPencilBiasa, // Mint (biasa)
        right: bookIconBlue,      // Blue
      };
    case 'isbd':
      // Folder Mint: Variasi akhirannya 2 (Kuning) & Coral
      return {
        left: bookAndPencil2,  // Yellow (akhiran 2)
        right: bookIconCoral,  // Coral
      };
    case 'pendidikan-pancasila':
      // Folder Kuning: Variasi Coral & Akhiran 2 (Oranye)
      return {
        left: bookAndPencilCoral, // Coral
        right: bookIcon2,         // Orange (akhiran 2)
      };
    case 'peng-bisnis-ekonomi-digital':
      // Folder Biru: Variasi Coral & Akhiran 2 (Oranye)
      return {
        left: bookAndPencilCoral, // Coral
        right: bookIcon2,         // Orange (akhiran 2)
      };
    default:
      if (colorKey === 'blue' || colorKey === 'mint' || colorKey === 'lavender') {
        return { left: bookAndPencil2, right: bookIcon2 };
      }
      return { left: bookAndPencilBiasa, right: bookIconBiasa };
  }
}

const { spacing, typography } = DesignTokens;

export interface CourseFolderCardProps {
  course: Course;
  /** Jumlah tugas aktif yang terhubung dengan mata kuliah ini */
  activeTaskCount?: number;
  /** Callback saat folder ditekan */
  onPress?: (course: Course) => void;
  /** Styling kustom tambahan */
  style?: StyleProp<ViewStyle>;
}

/**
 * CourseFolderCard
 * Menampilkan kartu folder mata kuliah untuk grid 2 kolom mengacu langsung pada layar tengah ("Saved")
 * di reference/reference.jpg:
 * - Bentuk map/folder berwarna cerah dengan tab menonjol di kiri atas.
 * - Dekorasi 2 kartu kecil miring yang menyembul di belakang folder dengan variasi warna ikon buku.
 * - Nama mata kuliah tebal, subteks jumlah tugas/jadwal, serta badge bulat kecil kode ruang/hari di pojok kanan bawah.
 */
export function CourseFolderCard({
  course,
  activeTaskCount,
  onPress,
  style,
}: CourseFolderCardProps) {
  const palette = DesignTokens.colors.vibrant[course.colorKey] ?? {
    bg: DesignTokens.colors.vibrant.yellow.bg,
    text: DesignTokens.colors.vibrant.yellow.text,
  };

  const isLightText = palette.text === '#ffffff';
  const subtextColor = isLightText ? 'rgba(255, 255, 255, 0.85)' : 'rgba(22, 21, 19, 0.70)';

  const firstSession = course.sessions[0];
  const secondSession = course.sessions[1];

  // Variasi ikon buku untuk kartu miring di belakang folder
  const peekIcons = getCoursePeekIcons(course.id, course.colorKey);

  // Kode ruang/hari untuk badge bulat kecil di sudut kanan bawah
  const badgeLabel = firstSession ? firstSession.room : '1KA';
  const badgeBg = isLightText ? '#ffffff' : '#161513';
  const badgeTextColor = isLightText ? '#161513' : '#ffffff';

  // Subteks info tugas atau jadwal
  const subtext =
    activeTaskCount !== undefined
      ? `${activeTaskCount} tugas`
      : firstSession
      ? `${firstSession.day} · ${firstSession.room}`
      : 'Aktif';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Mata kuliah ${course.fullName}, ${subtext}`}
      onPress={() => onPress?.(course)}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && styles.pressed,
        style,
      ]}>
      {/* 1. Dekorasi 2 kartu kecil miring yang menyembul di belakang folder */}
      <View style={styles.peekCardsContainer} pointerEvents="none">
        {/* Kartu Belakang 1 (miring kiri) */}
        <View style={[styles.peekCard, styles.peekCardLeft]}>
          <View style={styles.peekCardInner}>
            <Image
              source={peekIcons.left}
              style={styles.peekCardIcon}
              resizeMode="contain"
            />
            <Text style={styles.peekCardTag} numberOfLines={1}>
              {firstSession ? firstSession.day.slice(0, 3) : 'Mod'}
            </Text>
          </View>
        </View>

        {/* Kartu Belakang 2 (miring kanan, tumpang tindih) */}
        <View style={[styles.peekCard, styles.peekCardRight]}>
          <View style={styles.peekCardInner}>
            <Image
              source={peekIcons.right}
              style={styles.peekCardIcon}
              resizeMode="contain"
            />
            <Text style={styles.peekCardTag} numberOfLines={1}>
              {secondSession ? secondSession.day.slice(0, 3) : firstSession ? firstSession.slots : 'Bab'}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Bentuk Map/Folder dengan Tab Menonjol di Kiri Atas */}
      <View style={styles.folderShape}>
        {/* Baris Tab Folder Atas */}
        <View style={styles.tabHeaderRow}>
          <View style={[styles.folderTabLeft, { backgroundColor: palette.bg }]} />
          <View style={styles.tabStepVoid} />
        </View>

        {/* Badan Utama Folder */}
        <View style={[styles.folderBody, { backgroundColor: palette.bg }]}>
          {/* Bagian Konten Teks di Bagian Depan Bawah Folder */}
          <View style={styles.textContainer}>
            <Text style={[styles.courseName, { color: palette.text }]} numberOfLines={2}>
              {course.shortName}
            </Text>
            <Text style={[styles.taskCountText, { color: subtextColor }]} numberOfLines={1}>
              {subtext}
            </Text>
          </View>

          {/* Badge bulat kecil di sudut kanan bawah yang menampilkan kode ruang/hari */}
          <View style={[styles.cornerBadge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.cornerBadgeText, { color: badgeTextColor }]}>
              {badgeLabel}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
    paddingTop: 18, // Ruang untuk kartu yang menyembul keluar di atas
    marginBottom: spacing.space3,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
  peekCardsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    zIndex: 1,
  },
  peekCard: {
    position: 'absolute',
    width: 46,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  peekCardLeft: {
    right: 48,
    top: 4,
    transform: [{ rotate: '-8deg' }],
  },
  peekCardRight: {
    right: 18,
    top: 2,
    transform: [{ rotate: '9deg' }],
  },
  peekCardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fbfaf8',
    padding: 2,
  },
  peekCardIcon: {
    width: 18,
    height: 18,
  },
  peekCardTag: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6b665f',
    marginTop: 1,
  },
  folderShape: {
    zIndex: 2,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  tabHeaderRow: {
    flexDirection: 'row',
    height: 16,
  },
  folderTabLeft: {
    width: '58%',
    height: 16,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 10,
  },
  tabStepVoid: {
    flex: 1,
    height: 16,
    backgroundColor: 'transparent',
  },
  folderBody: {
    minHeight: 88,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingTop: spacing.space3,
    paddingBottom: spacing.space3,
    paddingHorizontal: spacing.space3 + 2,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  textContainer: {
    paddingRight: 32, // Memberikan ruang agar teks tidak tertabrak badge kanan bawah
  },
  courseName: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
    lineHeight: 18,
    marginBottom: 3,
  },
  taskCountText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  cornerBadge: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  cornerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
