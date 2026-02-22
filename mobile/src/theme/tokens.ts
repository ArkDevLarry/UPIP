import { Appearance } from 'react-native';

export const tokens = {
  colors: {
    primary: '#4F9DFF',
    secondary: '#8B5CF6',
    accent: '#8B5CF6',
    background: '#0B0F19',
    surface: '#161B2E',
    border: '#1F2937',
    success: '#14B8A6',
    risk: {
      high: '#DC2626',
      moderate: '#F59E0B',
      low: '#14B8A6',
    },
    text: {
      primary: '#E5E7EB',
      secondary: '#9CA3AF',
      muted: '#6B7280',
      inverse: '#0B0F19',
    },
    card: {
      shadow: 'rgba(0,0,0,0.5)',
      border: '#1F2937',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    size: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 30,
      huge: 48,
    },
    weight: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extraBold: '800' as const,
    }
  },
};