import { Platform } from 'react-native';

export const COLORS = {
  // Core palette
  background: '#F0F3FA',
  surface: '#FFFFFF',
  soft: '#D5DEEF',
  light: '#B1C9EF',
  secondary: '#8AAEE0',
  primary: '#638ECB',
  dark: '#395886',
  textPrimary: '#395886',
  textSecondary: '#638ECB',
  border: '#D5DEEF',

  // Compatibility aliases used across existing screens/components
  white: '#FFFFFF',
  text: '#395886',
  textLight: '#638ECB',
  textMuted: '#8AAEE0',
  accent: '#638ECB',

  // Semantic colors adapted to the healthcare blue hierarchy
  success: '#8AAEE0',
  warning: '#638ECB',
  error: '#395886',
  info: '#8AAEE0',

  overlay: 'rgba(57, 88, 134, 0.35)',
  cardShadow: 'rgba(57, 88, 134, 0.14)',
  gradientStart: '#395886',
  gradientMid: '#8AAEE0',
  gradientEnd: '#F0F3FA',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  full: 999,
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
  },
  sm: {
    shadowColor: '#395886',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#395886',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#395886',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  xl: {
    shadowColor: '#395886',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
};

export const Colors = {
  light: {
    text: COLORS.text,
    background: COLORS.background,
    tint: COLORS.primary,
    icon: COLORS.primary,
    tabIconDefault: COLORS.textLight,
    tabIconSelected: COLORS.primary,
  },
  dark: {
    text: COLORS.text,
    background: COLORS.background,
    tint: COLORS.primary,
    icon: COLORS.primary,
    tabIconDefault: COLORS.textLight,
    tabIconSelected: COLORS.primary,
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
