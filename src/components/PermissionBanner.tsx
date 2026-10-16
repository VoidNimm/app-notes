import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { DesignTokens } from '@/constants/theme';
import { setUserNotificationConsent } from '@/services/storage';

const { colors, spacing, radius, typography, controls } = DesignTokens;

interface PermissionBannerProps {
  onDismiss: () => void;
  onOpenSettings?: () => void;
}

/**
 * Banner pemberitahuan ketika izin notifikasi ditolak / belum aktif.
 * Sesuai PRD Bagian 9 & Design Guide (S4 / NoticeBanner):
 * - Menjelaskan bahwa pengingat tidak akan muncul.
 * - Dapat ditutup oleh pengguna sehingga aplikasi tetap berfungsi normal.
 * - Menyediakan akses cepat ke Pengaturan HP untuk mengaktifkan izin kembali.
 */
export function PermissionBanner({ onDismiss, onOpenSettings }: PermissionBannerProps) {
  const handleOpenSettings = async () => {
    await setUserNotificationConsent(true);
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Icon name="lonceng" size={20} color={colors.today.text} />
          <Text style={styles.title}>Pengingat Tidak Aktif</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tutup pemberitahuan"
          onPress={onDismiss}
          hitSlop={8}
          style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <Text style={styles.message}>
        Izin notifikasi tidak diberikan. Pengingat tugas 24 jam dan 3 jam sebelum deadline tidak akan muncul di HP kamu.
      </Text>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Buka pengaturan HP untuk mengaktifkan notifikasi"
          onPress={handleOpenSettings}
          style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}>
          <Text style={styles.settingsButtonText}>Buka Pengaturan HP</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.today.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.space4,
    marginBottom: spacing.space4,
    gap: spacing.space2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space2,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.today.text,
  },
  closeButton: {
    minWidth: controls.touchTargetMin,
    minHeight: controls.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.today.text,
  },
  message: {
    fontSize: typography.sizes.sm,
    color: colors.today.text,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.space2,
  },
  settingsButton: {
    minHeight: controls.controlSmH,
    paddingHorizontal: spacing.space4,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonText: {
    color: colors.textOnDark,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  pressed: {
    opacity: 0.8,
  },
});
