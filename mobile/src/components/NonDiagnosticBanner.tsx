import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';

export const NonDiagnosticBanner: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <AlertCircle size={16} color={theme.colors.text.secondary} />
      <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
        Risk scores are probabilistic and not medical diagnoses.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  text: {
    marginLeft: tokens.spacing.sm,
    fontSize: tokens.typography.size.xs,
    color: tokens.colors.text.secondary,
    flex: 1,
  },
});