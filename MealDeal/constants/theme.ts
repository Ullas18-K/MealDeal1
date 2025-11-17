/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const palette = {
  midnight: '#050c1a',
  cobalt: '#0b1226',
  slate: '#1c2740',
  neon: '#2CC28A',
  accent: '#FF8B3D',
  text: '#F6FAFF',
  muted: '#8890a6',
  border: 'rgba(255,255,255,0.08)',
};

export const Colors = {
  light: {
    text: palette.text,
    background: palette.cobalt,
    card: '#111b33',
    tint: palette.neon,
    accent: palette.accent,
    muted: palette.muted,
    icon: '#9BE5C2',
    border: palette.border,
    tabIconDefault: '#5c6a92',
    tabIconSelected: palette.neon,
  },
  dark: {
    text: palette.text,
    background: palette.midnight,
    card: '#0b1428',
    tint: palette.neon,
    accent: palette.accent,
    muted: palette.muted,
    icon: '#9BE5C2',
    border: palette.border,
    tabIconDefault: '#5c6a92',
    tabIconSelected: palette.neon,
  },
};

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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
