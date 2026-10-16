/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export type VibrantColorKey = 'coral' | 'yellow' | 'orange' | 'blue' | 'lavender' | 'mint';

export interface ColorPair {
  bg: string;
  text: string;
}

/**
 * Palet warna vibrant untuk bubble card & folder
 * Mengacu ke layar "Saved" dan "Chats" di reference/reference.jpg
 * Memenuhi rasio kontras WCAG AA (>= 4.5:1)
 */
export const VibrantColors: Record<VibrantColorKey, ColorPair> = {
  coral: { bg: '#ff6562', text: '#161513' },
  yellow: { bg: '#ffd027', text: '#161513' },
  orange: { bg: '#ff8c21', text: '#161513' },
  blue: { bg: '#2563eb', text: '#ffffff' },
  lavender: { bg: '#c7b5eb', text: '#161513' },
  mint: { bg: '#36d399', text: '#161513' },
} as const;

/**
 * Design Tokens dari design.md (Aplikasi Pencatat Tugas Kuliah)
 */
export const DesignTokens = {
  colors: {
    bg: '#f8f5f0',
    surface: '#ffffff',
    surfaceDark: '#161513',
    surfaceMuted: '#f1ede7',
    border: '#e7e1d8',
    text: '#161513',
    textMuted: '#6b665f',
    textOnDark: '#ffffff',
    textMutedDark: '#a39e97',
    primary: '#161513',
    onPrimary: '#ffffff',
    urgent: { bg: '#fee2e2', text: '#991b1b' },
    today: { bg: '#fef3c7', text: '#78350f' },
    week: { bg: '#dbeafe', text: '#1e40af' },
    later: { bg: '#f3e8ff', text: '#6b21a8' },
    done: { bg: '#dcfce7', text: '#166534' },
    vibrant: VibrantColors,
  },
  spacing: {
    space1: 4,
    space2: 8,
    space3: 12,
    space4: 16,
    space5: 20,
    space6: 24,
    space8: 32,
    space10: 40,
  },
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
  typography: {
    fontFamily: 'normal',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 30,
    },
    weights: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    },
  },
  motion: {
    durFast: 150,
    durBase: 250,
    durSlow: 400,
  },
  controls: {
    controlH: 48,
    controlSmH: 36,
    touchTargetMin: 44,
  },
  zIndex: {
    card: 1,
    dock: 50,
    modal: 100,
    toast: 200,
  },
} as const;
