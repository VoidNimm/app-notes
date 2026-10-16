import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/Icon';
import { DesignTokens } from '@/constants/theme';
import { requestNotificationPermissions } from '@/services/notifications';
import { setHasSeenNotificationPrompt, setUserNotificationConsent } from '@/services/storage';

const { colors, spacing, radius, typography, controls, shadows } = DesignTokens;

/**
 * Layar S4: Penjelasan Izin Notifikasi.
 * Muncul pada pemakaian pertama aplikasi (PRD Bagian 9 & 13).
 * Menjelaskan alasan mengapa aplikasi memerlukan izin notifikasi:
 * - Pengingat 24 jam sebelum deadline tugas
 * - Pengingat 3 jam sebelum deadline tugas
 * - Pengingat bekerja lokal di perangkat (privat by design)
 */
export default function NotificationPermissionScreen() {
  const router = useRouter();
  const [requesting, setRequesting] = useState(false);

  const handleAllow = async () => {
    setRequesting(true);
    try {
      await requestNotificationPermissions();
      await setHasSeenNotificationPrompt(true);
    } finally {
      setRequesting(false);
      router.replace('/');
    }
  };

  const handleSkip = async () => {
    await setUserNotificationConsent(false);
    await setHasSeenNotificationPrompt(true);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brandRow}>
          <Image
            source={require('../../assets/logo-icon.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandTitle}>plss.inget</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Icon name="lonceng" size={44} color={colors.textOnDark} />
          </View>

          <Text style={styles.title}>Aktifkan Pengingat Tugas</Text>
          <Text style={styles.subtitle}>
            plss.inget membutuhkan izin notifikasi agar kamu tidak melewatkan deadline tugas kuliah dari dosen.
          </Text>

          <View style={styles.reasonsList}>
            <View style={styles.reasonItem}>
              <View style={styles.reasonBadge}>
                <Text style={styles.reasonBadgeText}>24j</Text>
              </View>
              <View style={styles.reasonTextWrap}>
                <Text style={styles.reasonTitle}>Pengingat H-1 (24 Jam)</Text>
                <Text style={styles.reasonDesc}>
                  Waktu yang cukup untuk memeriksa ulang draf atau mencicil tugas praktikum.
                </Text>
              </View>
            </View>

            <View style={styles.reasonItem}>
              <View style={[styles.reasonBadge, { backgroundColor: colors.urgent.bg }]}>
                <Text style={[styles.reasonBadgeText, { color: colors.urgent.text }]}>3j</Text>
              </View>
              <View style={styles.reasonTextWrap}>
                <Text style={styles.reasonTitle}>Pengingat H-3 Jam</Text>
                <Text style={styles.reasonDesc}>
                  Peringatan terakhir sebelum jam pengumpulan tugas tiba.
                </Text>
              </View>
            </View>

            <View style={styles.reasonItem}>
              <View style={[styles.reasonBadge, { backgroundColor: colors.week.bg }]}>
                <Icon name="buku" size={18} color={colors.week.text} />
              </View>
              <View style={styles.reasonTextWrap}>
                <Text style={styles.reasonTitle}>Lokal & Privat</Text>
                <Text style={styles.reasonDesc}>
                  Pengingat dijadwalkan langsung di HP kamu tanpa perlu akun dan tanpa internet.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionWrap}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Beri izin notifikasi"
              onPress={handleAllow}
              disabled={requesting}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && { transform: [{ scale: 0.98 }] },
                requesting && { opacity: 0.6 },
              ]}>
              <Text style={styles.primaryButtonText}>
                {requesting ? 'Meminta Izin…' : 'Izinkan Notifikasi'}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Lewati atau nanti saja"
              onPress={handleSkip}
              disabled={requesting}
              style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.7 }]}>
              <Text style={styles.secondaryButtonText}>Nanti Saja</Text>
            </Pressable>
          </View>

          <Text style={styles.disclaimerText}>
            Jika izin ditolak, aplikasi tetap berfungsi penuh untuk mencatat tugas, namun pengingat otomatis tidak akan muncul.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    padding: spacing.space4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space2,
    marginBottom: spacing.space5,
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  brandTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.space6,
    alignItems: 'center',
    ...shadows.md,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space4,
    ...shadows.sm,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.space2,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
    marginBottom: spacing.space6,
  },
  reasonsList: {
    width: '100%',
    gap: spacing.space4,
    marginBottom: spacing.space6,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.space3,
  },
  reasonBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.today.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.today.text,
  },
  reasonTextWrap: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  reasonDesc: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
    marginTop: 2,
  },
  actionWrap: {
    width: '100%',
    gap: spacing.space3,
    marginBottom: spacing.space4,
  },
  primaryButton: {
    minHeight: controls.controlH,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  primaryButtonText: {
    color: colors.textOnDark,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  secondaryButton: {
    minHeight: controls.controlH,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  disclaimerText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
  },
});
