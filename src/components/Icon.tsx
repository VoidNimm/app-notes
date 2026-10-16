import React from 'react';
import { Platform, StyleSheet, Text, View, type ColorValue, type StyleProp, type ViewStyle } from 'react-native';
import { SymbolView, type AndroidSymbol, type SFSymbol, type SymbolViewProps } from 'expo-symbols';
import { DesignTokens } from '@/constants/theme';

/**
 * Status Verifikasi Google Material Symbols (Android):
 * ---------------------------------------------------
 * 1. plus:
 *    - Nama 'plus': tidak bisa dikonfirmasi di Google Material Symbols.
 *    - Nama resmi terverifikasi: 'add'.
 *
 * 2. jam:
 *    - Nama 'jam' / 'clock': tidak bisa dikonfirmasi di Google Material Symbols.
 *    - Nama resmi terverifikasi: 'schedule' (atau 'access_time').
 *
 * 3. buku:
 *    - Nama 'book': terkonfirmasi di Google Material Symbols.
 *
 * 4. centang-lingkaran:
 *    - Nama 'check_circle': terkonfirmasi di Google Material Symbols.
 *
 * 5. lingkaran kosong:
 *    - Nama 'circle': terkonfirmasi di Google Material Symbols.
 *    - Nama alternatif radio: 'radio_button_unchecked' terkonfirmasi.
 *
 * 6. hapus:
 *    - Nama 'delete': terkonfirmasi di Google Material Symbols.
 *    - Catatan: nama 'trash' tidak bisa dikonfirmasi di Google Material Symbols.
 *
 * 7. ubah:
 *    - Nama 'edit': terkonfirmasi di Google Material Symbols.
 *
 * 8. lonceng:
 *    - Nama 'notifications': terkonfirmasi di Google Material Symbols.
 *    - Catatan: nama 'bell' tidak bisa dikonfirmasi di Google Material Symbols.
 *
 * 9. chevron:
 *    - Nama 'chevron' tunggal: tidak bisa dikonfirmasi di Google Material Symbols.
 *    - Nama resmi terverifikasi: 'chevron_right' (arah kanan) atau 'expand_more' (arah bawah).
 */

export interface IconDefinition {
  ios: SFSymbol;
  android: AndroidSymbol;
  fallbackText: string;
  verificationNote: string;
}

export const ICON_DEFINITIONS = {
  plus: {
    ios: 'plus' as SFSymbol,
    android: 'add' as AndroidSymbol,
    fallbackText: '+',
    verificationNote: "Nama 'plus' tidak bisa dikonfirmasi di Google Material Symbols, menggunakan 'add'",
  },
  jam: {
    ios: 'clock' as SFSymbol,
    android: 'schedule' as AndroidSymbol,
    fallbackText: '⏱',
    verificationNote: "Nama 'jam' / 'clock' tidak bisa dikonfirmasi di Google Material Symbols, menggunakan 'schedule'",
  },
  buku: {
    ios: 'book' as SFSymbol,
    android: 'book' as AndroidSymbol,
    fallbackText: '📖',
    verificationNote: "Nama 'book' terkonfirmasi di Google Material Symbols",
  },
  'centang-lingkaran': {
    ios: 'checkmark.circle' as SFSymbol,
    android: 'check_circle' as AndroidSymbol,
    fallbackText: '✓',
    verificationNote: "Nama 'check_circle' terkonfirmasi di Google Material Symbols",
  },
  'lingkaran kosong': {
    ios: 'circle' as SFSymbol,
    android: 'circle' as AndroidSymbol,
    fallbackText: '○',
    verificationNote: "Nama 'circle' terkonfirmasi di Google Material Symbols",
  },
  hapus: {
    ios: 'trash' as SFSymbol,
    android: 'delete' as AndroidSymbol,
    fallbackText: '✕',
    verificationNote: "Nama 'delete' terkonfirmasi di Google Material Symbols; 'trash' tidak bisa dikonfirmasi",
  },
  ubah: {
    ios: 'pencil' as SFSymbol,
    android: 'edit' as AndroidSymbol,
    fallbackText: '✎',
    verificationNote: "Nama 'edit' terkonfirmasi di Google Material Symbols",
  },
  lonceng: {
    ios: 'bell' as SFSymbol,
    android: 'notifications' as AndroidSymbol,
    fallbackText: '🔔',
    verificationNote: "Nama 'notifications' terkonfirmasi di Google Material Symbols; 'bell' tidak bisa dikonfirmasi",
  },
  chevron: {
    ios: 'chevron.right' as SFSymbol,
    android: 'chevron_right' as AndroidSymbol,
    fallbackText: '›',
    verificationNote: "Nama 'chevron' tunggal tidak bisa dikonfirmasi di Google Material Symbols, menggunakan 'chevron_right'",
  },
  kembali: {
    ios: 'chevron.left' as SFSymbol,
    android: 'chevron_left' as AndroidSymbol,
    fallbackText: '‹',
    verificationNote: "Official SF Symbol 'chevron.left' dan Material Symbol 'chevron_left'",
  },
} as const;

// Alias untuk kemudahan penggunaan
export const ICON_ALIASES: Record<string, keyof typeof ICON_DEFINITIONS> = {
  // Indonesian variants
  plus: 'plus',
  jam: 'jam',
  buku: 'buku',
  'centang-lingkaran': 'centang-lingkaran',
  centang_lingkaran: 'centang-lingkaran',
  'lingkaran kosong': 'lingkaran kosong',
  'lingkaran-kosong': 'lingkaran kosong',
  lingkaran_kosong: 'lingkaran kosong',
  hapus: 'hapus',
  ubah: 'ubah',
  lonceng: 'lonceng',
  chevron: 'chevron',
  kembali: 'kembali',

  // English aliases
  add: 'plus',
  clock: 'jam',
  schedule: 'jam',
  book: 'buku',
  check_circle: 'centang-lingkaran',
  circle: 'lingkaran kosong',
  delete: 'hapus',
  trash: 'hapus',
  edit: 'ubah',
  pencil: 'ubah',
  bell: 'lonceng',
  notifications: 'lonceng',
  chevron_right: 'chevron',
  'chevron-left': 'kembali',
  chevron_left: 'kembali',
  'arrow-back': 'kembali',
  arrow_back: 'kembali',
  back: 'kembali',
};

export type AppIconName = keyof typeof ICON_ALIASES;

export interface IconProps {
  /**
   * Nama icon semantik atau alias yang didukung:
   * 'plus', 'jam', 'buku', 'centang-lingkaran', 'lingkaran kosong', 'hapus', 'ubah', 'lonceng', 'chevron'
   */
  name: AppIconName | { ios: SFSymbol; android: AndroidSymbol };
  /**
   * Ukuran icon dalam pixel (default: 24)
   */
  size?: number;
  /**
   * Warna tint icon (default: DesignTokens.colors.text)
   */
  color?: ColorValue;
  /**
   * Alias untuk color (sesuai prop bawaan SymbolView)
   */
  tintColor?: ColorValue;
  /**
   * Komponen fallback kustom jika icon belum termuat atau platform tidak mendukung
   */
  fallback?: React.ReactNode;
  /**
   * Styling tambahan pada kontainer
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Bobot icon (opsional)
   */
  weight?: SymbolViewProps['weight'];
}

export function Icon({
  name,
  size = 24,
  color,
  tintColor,
  fallback,
  style,
  weight,
}: IconProps): React.JSX.Element {
  const resolvedColor = color ?? tintColor ?? DesignTokens.colors.text;

  let resolvedSymbolName: { ios: SFSymbol; android: AndroidSymbol; web: AndroidSymbol };
  let defaultFallbackText = '•';

  if (typeof name === 'string') {
    const key = ICON_ALIASES[name] ?? 'plus';
    const definition = ICON_DEFINITIONS[key];
    resolvedSymbolName = {
      ios: definition.ios,
      android: definition.android,
      web: definition.android,
    };
    defaultFallbackText = definition.fallbackText;
  } else {
    resolvedSymbolName = {
      ios: name.ios,
      android: name.android,
      web: name.android,
    };
  }

  const isKembali = typeof name === 'string' && ICON_ALIASES[name] === 'kembali';

  if (isKembali && Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <View
          style={{
            width: Math.round(size * 0.44),
            height: Math.round(size * 0.44),
            borderLeftWidth: 2,
            borderBottomWidth: 2,
            borderColor: resolvedColor as any,
            transform: [{ rotate: '45deg' }],
            marginLeft: Math.max(1, Math.round(size * 0.1)),
          }}
        />
      </View>
    );
  }

  const renderedFallback = fallback ?? (
    <View style={[styles.fallbackContainer, { width: size, height: size }]}>
      {isKembali ? (
        <View
          style={{
            width: Math.round(size * 0.44),
            height: Math.round(size * 0.44),
            borderLeftWidth: 2,
            borderBottomWidth: 2,
            borderColor: resolvedColor as any,
            transform: [{ rotate: '45deg' }],
            marginLeft: Math.max(1, Math.round(size * 0.1)),
          }}
        />
      ) : (
        <Text
          style={[
            styles.fallbackText,
            {
              fontSize: Math.round(size * 0.8),
              lineHeight: size,
              color: resolvedColor as string,
            },
          ]}>
          {defaultFallbackText}
        </Text>
      )}
    </View>
  );

  return (
    <SymbolView
      name={resolvedSymbolName}
      size={size}
      tintColor={resolvedColor}
      weight={weight}
      fallback={renderedFallback}
      style={[{ width: size, height: size }, style]}
    />
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default Icon;
