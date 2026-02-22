import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { tokens as baseTokens } from './tokens';

// Define a deep partial or just use the structure we know
type ThemeColors = typeof baseTokens.colors;

const lightColors: ThemeColors = {
  primary: '#4F9DFF',
  secondary: '#8B5CF6',
  accent: '#8B5CF6',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  success: '#14B8A6',
  risk: {
    high: '#DC2626',
    moderate: '#F59E0B',
    low: '#14B8A6',
  },
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  card: {
    shadow: 'rgba(0,0,0,0.05)',
    border: '#F3F4F6',
  },
};

const darkColors: ThemeColors = baseTokens.colors;

interface ThemeContextType {
  theme: typeof baseTokens;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const darkMode = useAuthStore((state) => state.preferences.darkMode);
  
  const colors = darkMode ? darkColors : lightColors;
  
  const theme = {
    ...baseTokens,
    colors,
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
