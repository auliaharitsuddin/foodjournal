// iOS-inspired design tokens (Human Interface Guidelines colors, SF-style type scale via Inter)

export const palette = {
  light: {
    bg: '#F2F2F7',
    bgElevated: '#FFFFFF',
    card: '#FFFFFF',
    cardSecondary: '#F7F7FA',
    separator: 'rgba(60,60,67,0.12)',
    label: '#1C1C1E',
    labelSecondary: '#6C6C70',
    labelTertiary: '#AEAEB2',
    blue: '#007AFF',
    green: '#34C759',
    orange: '#FF9500',
    red: '#FF3B30',
    purple: '#AF52DE',
    pink: '#FF2D55',
    yellow: '#FFCC00',
    teal: '#30B0C7',
    indigo: '#5856D6',
    mint: '#00C7BE',
    fill: 'rgba(120,120,128,0.12)',
    fillSecondary: 'rgba(120,120,128,0.16)',
  },
  dark: {
    bg: '#000000',
    bgElevated: '#1C1C1E',
    card: '#1C1C1E',
    cardSecondary: '#2C2C2E',
    separator: 'rgba(84,84,88,0.6)',
    label: '#FFFFFF',
    labelSecondary: '#98989F',
    labelTertiary: '#636366',
    blue: '#0A84FF',
    green: '#30D158',
    orange: '#FF9F0A',
    red: '#FF453A',
    purple: '#BF5AF2',
    pink: '#FF375F',
    yellow: '#FFD60A',
    teal: '#40C8E0',
    indigo: '#5E5CE6',
    mint: '#63E6E2',
    fill: 'rgba(120,120,128,0.24)',
    fillSecondary: 'rgba(120,120,128,0.32)',
  },
};

export type Palette = typeof palette.light;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const type = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.2 },
  title1: { fontSize: 28, lineHeight: 34, fontFamily: 'Inter_700Bold' },
  title2: { fontSize: 22, lineHeight: 28, fontFamily: 'Inter_700Bold' },
  title3: { fontSize: 20, lineHeight: 25, fontFamily: 'Inter_600SemiBold' },
  headline: { fontSize: 17, lineHeight: 22, fontFamily: 'Inter_600SemiBold' },
  body: { fontSize: 17, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  bodyMedium: { fontSize: 17, lineHeight: 22, fontFamily: 'Inter_500Medium' },
  callout: { fontSize: 16, lineHeight: 21, fontFamily: 'Inter_400Regular' },
  subhead: { fontSize: 15, lineHeight: 20, fontFamily: 'Inter_500Medium' },
  footnote: { fontSize: 13, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  caption1: { fontSize: 12, lineHeight: 16, fontFamily: 'Inter_500Medium' },
  caption2: { fontSize: 11, lineHeight: 13, fontFamily: 'Inter_600SemiBold' },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const springConfig = {
  damping: 16,
  mass: 0.7,
  stiffness: 220,
};
