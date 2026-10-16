import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { COURSES, type Course } from '@/constants/courses';
import { DesignTokens } from '@/constants/theme';

const { colors, spacing, radius, typography } = DesignTokens;

export interface CourseSelectorPillsProps {
  /** Nilai nama mata kuliah yang sedang terpilih */
  selectedCourse: string;
  /** Callback saat mahasiswa mengetuk salah satu pill mata kuliah */
  onSelectCourse: (courseName: string) => void;
  /** Daftar mata kuliah kustom (opsional, default: COURSES dari courses.ts) */
  coursesList?: Course[];
  /** Styling kustom tambahan untuk kontainer */
  style?: StyleProp<ViewStyle>;
}

/**
 * CourseSelectorPills
 * Deretan chip/pills horizontal untuk memilih salah satu dari 8 mata kuliah utama kelas 1KA03
 * secara instan dalam 1 ketukan cepat (< 1 detik).
 */
export function CourseSelectorPills({
  selectedCourse,
  onSelectCourse,
  coursesList = COURSES,
  style,
}: CourseSelectorPillsProps) {
  const isSelected = (c: Course) => {
    const cur = selectedCourse.trim().toLowerCase();
    return (
      cur === c.fullName.toLowerCase() ||
      cur === c.shortName.toLowerCase() ||
      cur === c.id.toLowerCase()
    );
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Tombol Reset / Kosongkan Mata Kuliah */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tanpa mata kuliah"
          accessibilityState={{ selected: !selectedCourse }}
          hitSlop={6}
          onPress={() => onSelectCourse('')}
          style={({ pressed }) => [
            styles.pill,
            !selectedCourse ? styles.pillSelectedDark : styles.pillDefault,
            pressed && styles.pillPressed,
          ]}>
          <Text
            style={[
              styles.pillText,
              !selectedCourse ? styles.pillTextSelectedDark : styles.pillTextDefault,
            ]}>
            Umum / Tanpa Matkul
          </Text>
        </Pressable>

        {/* 8 Mata Kuliah Utama 1KA03 */}
        {coursesList.map((c) => {
          const active = isSelected(c);
          const vibrantColor = DesignTokens.colors.vibrant[c.colorKey]?.bg ?? colors.primary;

          return (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityLabel={`Pilih mata kuliah ${c.fullName}`}
              accessibilityState={{ selected: active }}
              hitSlop={6}
              onPress={() => onSelectCourse(active ? '' : c.fullName)}
              style={({ pressed }) => [
                styles.pill,
                active ? styles.pillSelected : styles.pillDefault,
                active && { borderColor: vibrantColor, backgroundColor: '#ffffff' },
                pressed && styles.pillPressed,
              ]}>
              {/* Dot aksen warna sesuai kurikulum 1KA03 di reference.jpg */}
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: vibrantColor },
                  active && styles.colorDotActive,
                ]}
              />
              <Text
                style={[
                  styles.pillText,
                  active ? styles.pillTextActive : styles.pillTextDefault,
                ]}>
                {c.shortName}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.space2,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space2,
    paddingVertical: spacing.space1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    paddingHorizontal: spacing.space3,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
  },
  pillDefault: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  pillSelected: {
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pillSelectedDark: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.surfaceDark,
  },
  pillPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  colorDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pillText: {
    fontSize: typography.sizes.xs + 1,
  },
  pillTextDefault: {
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  pillTextActive: {
    color: colors.text,
    fontWeight: typography.weights.bold,
  },
  pillTextSelectedDark: {
    color: colors.textOnDark,
    fontWeight: typography.weights.bold,
  },
});
