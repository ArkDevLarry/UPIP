import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface RiskBadgeProps {
  level: 'low' | 'moderate' | 'high';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const { theme } = useTheme();
  const color = theme.colors.risk[level];
  
  return (
    <View style={[styles.badge, { backgroundColor: `${color}20`, borderColor: color }]}>
      <Text style={[styles.text, { color }]}>
        {level.toUpperCase()} RISK
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});