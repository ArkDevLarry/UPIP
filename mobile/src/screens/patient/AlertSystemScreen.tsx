import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { Card } from '../../components/Card';

const MOCK_ALERTS = [
  { id: '1', type: 'warning', title: 'HRV Deviation', message: 'Significant drop in HRV detected. Ensure adequate recovery.', time: '2h ago' },
  { id: '2', type: 'critical', title: 'High Stress Alert', message: 'Elevated cardiac load detected. Consider immediate rest.', time: '5h ago' },
  { id: '3', type: 'success', title: 'Goal Achieved', message: '7-day activity consistency target reached.', time: 'Yesterday' },
  { id: '4', type: 'warning', title: 'Sleep Quality Dip', message: 'Deep sleep phases were 20% lower than your baseline.', time: 'Yesterday' },
  { id: '5', type: 'success', title: 'Normal BP Trend', message: 'Your blood pressure has remained stable for 14 consecutive days.', time: '2 days ago' },
  { id: '6', type: 'critical', title: 'Arrhythmia Signal', message: 'Potential irregular rhythm detected during rest. AI analysis suggests validation.', time: '3 days ago' },
];

export const AlertSystemScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const renderAlert = ({ item, index }: any) => (
    <Animated.View entering={FadeInLeft.delay(index * 100)}>
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => navigation.navigate('ReportDetail', { report: item })}
      >
        <Card>
          <View style={styles.alertHeader}>
            <View style={styles.alertTitleRow}>
              {item.type === 'critical' && <AlertTriangle size={20} color={theme.colors.risk.high} />}
              {item.type === 'warning' && <AlertTriangle size={20} color={theme.colors.risk.moderate} />}
              {item.type === 'success' && <CheckCircle size={20} color={theme.colors.success} />}
              <Text style={[styles.alertTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
            </View>
            <Text style={[styles.alertTime, { color: theme.colors.text.muted }]}>{item.time}</Text>
          </View>
          <Text style={[styles.alertMessage, { color: theme.colors.text.secondary }]}>{item.message}</Text>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Health Reports</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>System alerts and diagnostic logs</Text>
        </View>

        <FlatList
          data={MOCK_ALERTS}
          renderItem={renderAlert}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
                <Bell size={16} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Recent Notifications</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing.md,
  },
  header: {
    marginBottom: tokens.spacing.xl,
    marginTop: tokens.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: tokens.colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: tokens.colors.text.secondary,
  },
  list: {
    paddingBottom: tokens.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  alertTime: {
    fontSize: 12,
    color: tokens.colors.text.muted,
  },
  alertMessage: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    lineHeight: 20,
  }
});
