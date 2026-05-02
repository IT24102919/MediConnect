/**
 * Warm-Earth Color Palette Theme
 * Modern, clean, balanced healthcare app design
 */

import { Platform } from 'react-native';

// Core Brand Colors
export const COLORS = {
  // Primary Colors
  primary: '#ABC270',           // Green - Main brand, headers, primary buttons, active tabs
  secondary: '#FEC868',         // Yellow - Secondary buttons, cards, section highlights, badges
  accent: '#FDA769',            // Orange - CTA buttons, alerts, important actions, hover states
  dark: '#473C33',              // Dark Brown - Text, headers, footer, premium sections
  
  // Background & Neutral
  background: '#FFF9F0',        // Soft light cream - Main app background
  white: '#FFFFFF',             // Pure white - Cards, elevated sections
  
  // Text Colors
  text: '#473C33',              // Dark brown text
  textLight: '#7A6F67',         // Lighter brown for secondary text
  textMuted: '#A89F98',         // Muted gray-brown for tertiary text
  
  // Semantic Colors
  success: '#ABC270',           // Success states (green)
  warning: '#FDA769',           // Warning states (orange)
  error: '#E85D75',             // Error states
  info: '#38BDF8',              // Info states
  
  // Transparent/Overlay
  overlay: 'rgba(71, 60, 51, 0.5)',      // Dark overlay
  cardShadow: 'rgba(71, 60, 51, 0.08)',  // Subtle shadow
  
  // Gradient Support
  gradientStart: '#ABC270',
  gradientEnd: '#FEC868',
};

// Modern shadows and spacing
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

// Modern shadows
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Legacy Colors object for compatibility
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
