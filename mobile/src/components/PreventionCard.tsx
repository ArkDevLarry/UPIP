import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';

interface PreventionCardProps {
  title: string;
  reason: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export const PreventionCard: React.FC<PreventionCardProps> = ({ title, reason, action, priority }) => {
  const { theme } = useTheme();
  const priorityColor = priority === 'high' ? theme.colors.risk.high : priority === 'medium' ? theme.colors.risk.moderate : theme.colors.risk.low;
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={[styles.priorityLine, { backgroundColor: priorityColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}20` }]}>
                <Text style={[styles.priorityText, { color: priorityColor }]}>{priority.toUpperCase()}</Text>
            </View>
        </View>
        <Text style={[styles.reason, { color: theme.colors.text.secondary }]}>{reason}</Text>
        <View style={[styles.actionContainer, { backgroundColor: `${theme.colors.success}1A` }]}>
            <CheckCircle2 size={14} color={theme.colors.success} />
            <Text style={[styles.actionText, { color: theme.colors.success }]}>{action}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: tokens.radius.lg,
    flexDirection: 'row',
    marginBottom: tokens.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  priorityLine: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: tokens.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: tokens.typography.size.base,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  reason: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: tokens.typography.size.sm,
    color: '#166534',
    marginLeft: 8,
    fontWeight: '500',
  },
});