import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, title, className, animate = true }) => {
  const { theme } = useTheme();

  const CardWrapper = animate ? Animated.View : View;

  return (
    <CardWrapper 
      entering={animate ? FadeIn.duration(400) : undefined}
      layout={animate ? Layout.springify() : undefined}
      style={[styles.card, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.card.border,
        shadowColor: theme.colors.card.shadow,
      }]} 
      className={className}
    >
      {title && <Text style={[styles.title, { color: theme.colors.text.muted }]}>{title}</Text>}
      {children}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});