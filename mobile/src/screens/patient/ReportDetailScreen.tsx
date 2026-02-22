import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, FileText, Calendar, Activity, ShieldCheck, Download, Share2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { Card } from '../../components/Card';
import { TrendChart } from '../../components/TrendChart';

const { width } = Dimensions.get('window');

export const ReportDetailScreen = ({ navigation, route }: any) => {
  const { theme, isDark } = useTheme();
  const { report } = route.params;

  // Mock detailed data based on report type
  const getDetailedData = () => {
    switch(report.type) {
      case 'critical':
        return {
          summary: "Abnormal cardiac load detected during late-night hours. Potential risk of over-exertion.",
          metrics: [
            { label: "Peak HR", value: "118 bpm" },
            { label: "Min SpO2", value: "94%" },
            { label: "Stress Level", value: "High (82/100)" }
          ],
          recommendation: "Immediate reduction in physical activity. Schedule a cardiovascular stress test."
        };
      case 'warning':
        return {
          summary: "Variable HRV patterns suggest incomplete recovery between sleep cycles.",
          metrics: [
            { label: "Avg HRV", value: "42 ms" },
            { label: "Recovery", value: "Poor (30%)" },
            { label: "Sleep Quality", value: "Fair" }
          ],
          recommendation: "Optimize sleep environment. Avoid blue light 2 hours before rest."
        };
      default:
        return {
          summary: "Health profile remains within optimal parameters. Consistent activity levels maintained.",
          metrics: [
            { label: "Steps Avg", value: "8.4k" },
            { label: "BP Trend", value: "Stable" },
            { label: "Metabolic", value: "Good" }
          ],
          recommendation: "Continue current routine. Next full AI scan recommended in 14 days."
        };
    }
  };

  const details = getDetailedData();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Report Analysis</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Share2 color={theme.colors.text.primary} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)}>
          <Card>
            <View style={styles.reportHeader}>
              <View style={[styles.iconBox, { backgroundColor: `${report.type === 'critical' ? theme.colors.risk.high : report.type === 'warning' ? theme.colors.risk.moderate : theme.colors.success}1A` }]}>
                <FileText size={24} color={report.type === 'critical' ? theme.colors.risk.high : report.type === 'warning' ? theme.colors.risk.moderate : theme.colors.success} />
              </View>
              <View style={styles.headerInfo}>
                <Text style={[styles.reportTitle, { color: theme.colors.text.primary }]}>{report.title}</Text>
                <View style={styles.dateRow}>
                  <Calendar size={12} color={theme.colors.text.muted} />
                  <Text style={[styles.reportDate, { color: theme.colors.text.muted }]}>{report.time} • System Log ID: {Math.floor(Math.random() * 100000)}</Text>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <Card title="Clinical Summary">
            <Text style={[styles.summaryText, { color: theme.colors.text.secondary }]}>{details.summary}</Text>
          </Card>
        </Animated.View>

        <View style={styles.metricsGrid}>
          {details.metrics.map((m, i) => (
            <Animated.View key={i} entering={FadeInDown.delay(300 + i * 100)} style={styles.metricItem}>
              <View style={[styles.metricCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.metricLabel, { color: theme.colors.text.muted }]}>{m.label}</Text>
                <Text style={[styles.metricValue, { color: theme.colors.text.primary }]}>{m.value}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(600)}>
          <Card title="AI Recommendation">
            <View style={styles.recBox}>
              <ShieldCheck size={20} color={theme.colors.primary} />
              <Text style={[styles.recText, { color: theme.colors.text.primary }]}>{details.recommendation}</Text>
            </View>
          </Card>
        </Animated.View>

        {report.type !== 'success' && (
          <Animated.View entering={FadeInDown.delay(700)}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}>
              <Activity size={20} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Consult with Clinician</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <TouchableOpacity style={[styles.downloadBtn, { borderColor: theme.colors.border }]}>
          <Download size={18} color={theme.colors.text.secondary} />
          <Text style={[styles.downloadText, { color: theme.colors.text.secondary }]}>Export PDF Report</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  reportDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  metricItem: {
    width: '33.33%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  metricCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  recBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  actionBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  downloadBtn: {
    height: 50,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '600',
  }
});
