export const COLORS = {
  // Primary colors
  primary: '#3B82F6', // Blue
  primaryDark: '#2563EB',
  primaryLight: '#DBEAFE',

  // Secondary colors
  secondary: '#10B981', // Green
  secondaryDark: '#059669',
  secondaryLight: '#ECFDF5',

  // Accent colors
  accent: '#8B5CF6', // Purple
  accentDark: '#7C3AED',
  accentLight: '#EDE9FE',

  // Neutrals
  dark: '#1E293B',
  darkGray: '#334155',
  mediumGray: '#64748B',
  lightGray: '#94A3B8',
  ultraLightGray: '#E2E8F0',

  // Backgrounds
  background: '#F8FAFC',
  paper: '#FFFFFF',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Text
  textDark: '#1E293B',
  textMedium: '#475569',
  textLight: '#64748B',

  // Other
  border: '#E2E8F0',
  shadow: '#BFDBFE',
};

// Typography
export const FONTS = {
  h1: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  button: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    textTransform: 'uppercase',
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Borders
export const BORDERS = {
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  width: {
    thin: 1,
    normal: 2,
    thick: 3,
  },
};

// Shadows
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Animation timing
export const ANIMATION = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

export default {
  COLORS,
  FONTS,
  SPACING,
  BORDERS,
  SHADOWS,
  ANIMATION,
};
