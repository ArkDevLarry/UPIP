import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RefreshCcw } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "Failed to load data. Please check your connection.", 
  onRetry 
}) => {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: theme.colors.text.secondary }]}>{message}</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={onRetry}>
        <RefreshCcw size={18} color={theme.colors.text.inverse} />
        <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: tokens.radius.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});