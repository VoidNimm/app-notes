import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DesignTokens } from '@/constants/theme';

const { colors, spacing, radius, shadows, typography, zIndex } = DesignTokens;

export type DockTab = 'today' | 'matkul' | 'tugas';

export interface FloatingActionPillProps {
  /** Tab yang sedang aktif: 'today' | 'matkul' | 'tugas' */
  activeTab?: DockTab;
  /** Callback saat pengguna memilih tab */
  onTabChange?: (tab: DockTab) => void;
  /** Callback saat tombol pill hitam '+ Tambah' ditekan */
  onPressAdd?: () => void;
  /** Alias callback untuk kompatibilitas */
  onPress?: () => void;
  /** Styling kustom tambahan */
  style?: StyleProp<ViewStyle>;
}

/**
 * FloatingActionPill / Floating Pill Dock
 * Dok navigasi kapsul putih mengambang di bawah layar (seperti pada layar "Saved" & "Chats" di reference/reference.jpg).
 * Memuat pemilih tampilan (Today / Matkul / Tugas) dan tombol aksi '+ Tambah'.
 * Mengikuti spesifikasi design.md:
 * - Ukuran: Tinggi 56px, target sentuh minimal 44px (WCAG 2.1 AA & --touch-target-min: 44px)
 * - Responsif: padding horizontal 16-20px dari tepi layar agar tidak mentok di ponsel kecil (360-390px)
 */
export function FloatingActionPill({
  activeTab = 'today',
  onTabChange,
  onPressAdd,
  onPress,
  style,
}: FloatingActionPillProps) {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const handleAdd = onPressAdd ?? onPress ?? (() => {});

  // Titik patah responsif:
  // Di layar ponsel ramping (< 385px, misal 360px atau 375px), tombol aksi menggunakan tombol '+' bulat
  // sehingga dok tetap memiliki ruang bernapas minimal 16-24px di kiri dan kanan tanpa mentok ke tepi layar.
  const isCompact = windowWidth < 385;
  const isVeryCompact = windowWidth < 350;

  const tabs: { key: DockTab; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'matkul', label: 'Matkul' },
    { key: 'tugas', label: 'Tugas' },
  ];

  // Jarak aman dari bawah layar (memperhatikan safe area home bar iPhone / navigasi Android)
  const bottomOffset = Math.max(insets.bottom, 10) + 14;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.dockContainer,
        { bottom: bottomOffset },
        style,
      ]}>
      <View style={[styles.dock, isCompact && styles.dockCompact]}>
        {/* Tombol Tab Navigasi Tampilan (Today / Matkul / Tugas) */}
        <View style={styles.tabGroup}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                accessibilityRole="button"
                accessibilityLabel={`Tampilan ${tab.label}`}
                accessibilityState={{ selected: isActive }}
                hitSlop={6}
                onPress={() => onTabChange?.(tab.key)}
                style={({ pressed }) => [
                  styles.tabButton,
                  isCompact && styles.tabButtonCompact,
                  isVeryCompact && styles.tabButtonVeryCompact,
                  isActive && styles.tabButtonActive,
                  pressed && styles.tabPressed,
                ]}>
                <Text
                  style={[
                    styles.tabLabel,
                    isVeryCompact && styles.tabLabelVeryCompact,
                    isActive && styles.tabLabelActive,
                  ]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Separator Halus Antara Tab dan Tombol Aksi */}
        <View style={styles.divider} />

        {/* Tombol Aksi Hitam '+ Tambah' (layar lebar) atau '+' Bulat (layar ponsel) */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tambah tugas baru"
          hitSlop={6}
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.addPill,
            isCompact ? styles.addPillRound : styles.addPillWide,
            pressed && styles.addPillPressed,
          ]}>
          <Text style={[styles.addPillPlus, isCompact && styles.addPillPlusRound]}>+</Text>
          {!isCompact && <Text style={styles.addPillText}>Tambah</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.space4, // 16px - menjamin margin minimal dari tepi layar ponsel
    zIndex: zIndex.dock,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56, // Sesuai design.md section 7.5: Tinggi 56px
    backgroundColor: colors.surface, // Kapsul putih bersih
    borderRadius: radius.full,
    paddingVertical: 6,
    paddingLeft: spacing.space3,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.space2,
    maxWidth: 440,
    ...shadows.lg,
    elevation: 8,
  },
  dockCompact: {
    paddingLeft: spacing.space2 + 2,
    paddingRight: 6,
    gap: 6,
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  tabButton: {
    height: 44, // Target sentuh minimal 44px sesuai WCAG & design.md
    paddingHorizontal: spacing.space3 + 2, // 14px
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonCompact: {
    paddingHorizontal: spacing.space2 + 2, // 10px
  },
  tabButtonVeryCompact: {
    paddingHorizontal: 7,
  },
  tabButtonActive: {
    backgroundColor: colors.surfaceMuted, // Aksen lembut saat aktif
  },
  tabPressed: {
    opacity: 0.7,
  },
  tabLabel: {
    fontSize: typography.sizes.sm, // 14px
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },
  tabLabelVeryCompact: {
    fontSize: typography.sizes.xs + 1, // 13px
  },
  tabLabelActive: {
    color: colors.text,
    fontWeight: typography.weights.bold,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: 1,
  },
  addPill: {
    height: 44, // Target sentuh minimal 44px
    backgroundColor: colors.surfaceDark, // Pill hitam pekat (#161513)
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  addPillWide: {
    flexDirection: 'row',
    paddingHorizontal: spacing.space4, // 16px
    gap: 5,
  },
  addPillRound: {
    width: 44,
  },
  addPillPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  addPillPlus: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textOnDark,
    marginTop: -2,
  },
  addPillPlusRound: {
    fontSize: 22,
    marginTop: -2,
  },
  addPillText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textOnDark,
  },
});
