import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Card } from './Card';

interface Factor {
  title: string;
  detail: string;
}

interface InsightBoxProps {
  factors: Factor[];
}

export const InsightBox: React.FC<InsightBoxProps> = ({ factors }) => {
  const { theme } = useTheme();
  return (
    <Card title="Contributing Factors">
      {factors.map((factor, index) => (
        <View key={index} style={styles.row}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.background }]}>
            <Info size={14} color={theme.colors.primary} />
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{factor.title}</Text>
            <Text style={[styles.detail, { color: theme.colors.text.secondary }]}>{factor.detail}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.md,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: tokens.typography.size.sm,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  detail: {
    fontSize: tokens.typography.size.xs,
    color: tokens.colors.text.secondary,
    marginTop: 2,
  },
});