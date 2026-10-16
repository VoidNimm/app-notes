import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/Icon';
import { DesignTokens } from '@/constants/theme';

const { colors, spacing, radius, typography, shadows } = DesignTokens;

export interface BackButtonProps {
  /**
   * Label teks pada tombol kembali (default: 'Kembali')
   */
  label?: string;
  /**
   * Handler kustom saat tombol ditekan.
   * Jika tidak disetel, otomatis memanggil router.back() bila memungkinkan,
   * atau beralih ke fallbackHref (default: '/').
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Rute fallback bila stack navigasi kosong dan onPress tidak disetel (default: '/')
   */
  fallbackHref?: string;
  /**
   * Label aksesibilitas untuk screen reader
   */
  accessibilityLabel?: string;
  /**
   * Ukuran icon panah kembali (default: 14)
   */
  iconSize?: number;
  /**
   * Styling kustom tambahan pada container
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * BackButton
 * Komponen tombol kembali terstandarisasi mengacu pada design.md:
 * - Bentuk pill memanjang dengan radius penuh (`radius.full`)
 * - Ikon panah kembali (`Icon name="kembali"`) presisi di tengah vertikal
 * - Target sentuh ergonomis ramah satu jempol (`minHeight: 36` atau `hitSlop`)
 * - Desain konsisten di seluruh layar (Filter Matkul, Form Tugas, Detail Tugas)
 */
export function BackButton({
  label = 'Kembali',
  onPress,
  fallbackHref = '/',
  accessibilityLabel,
  iconSize = 14,
  style,
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = (e: GestureResponderEvent) => {
    if (onPress) {
      onPress(e);
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackHref as any);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `Kembali ke ${label}`}
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed,
      ]}>
      <Icon name="kembali" size={iconSize} color={colors.text} />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: spacing.space3,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default BackButton;
