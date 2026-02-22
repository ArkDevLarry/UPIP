import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, Activity, ShieldCheck, TrendingUp, AlertCircle, Sparkles } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { Card } from '../../components/Card';
import { TrendChart } from '../../components/TrendChart';

const { width } = Dimensions.get('window');

export const RiskDetailsScreen = ({ navigation, route }: any) => {
  const { theme, isDark } = useTheme();
  const uprs = route?.params?.uprs;
  
  const riskFactors = [
    { 
      factor: 'Cardiovascular', 
      value: `${Math.round(uprs?.cardiovascular_score * 100) || 38}%`, 
      impact: uprs?.cardiovascular_score > 0.6 ? 'High' : 'Moderate', 
      color: uprs?.cardiovascular_score > 0.6 ? theme.colors.risk.high : theme.colors.secondary, 
      weight: uprs?.cardiovascular_score || 0.38 
    },
    { 
      factor: 'Metabolic', 
      value: `${Math.round(uprs?.metabolic_score * 100) || 45}%`, 
      impact: uprs?.metabolic_score > 0.6 ? 'High' : 'Moderate', 
      color: uprs?.metabolic_score > 0.6 ? theme.colors.risk.high : theme.colors.secondary, 
      weight: uprs?.metabolic_score || 0.45 
    },
    { 
      factor: 'Mental', 
      value: `${Math.round(uprs?.mental_score * 100) || 41}%`, 
      impact: uprs?.mental_score > 0.6 ? 'High' : 'Moderate', 
      color: uprs?.mental_score > 0.6 ? theme.colors.risk.high : theme.colors.secondary, 
      weight: uprs?.mental_score || 0.41 
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Analysis Detail</Text>
        <TouchableOpacity style={styles.infoBtn}>
            <Info color={theme.colors.text.muted} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)}>
            <Card>
                <View style={styles.summaryHeader}>
                    <View style={styles.summaryIconBox}>
                        <Sparkles size={24} color={theme.colors.primary} />
                    </View>
                    <View>
                        <Text style={[styles.summaryTitle, { color: theme.colors.text.primary }]}>Analysis Confidence</Text>
                        <Text style={[styles.summaryStatus, { color: theme.colors.success }]}>
                            {uprs?.confidence_score > 0.8 ? 'High Reliability' : 'Good Reliability'} ({Math.round(uprs?.confidence_score * 100 || 94.2)}%)
                        </Text>
                    </View>
                </View>
                <Text style={[styles.summaryText, { color: theme.colors.text.secondary }]}>
                    Your health model is updated to the latest version. Computed using detailed health patterns across multiple measurements.
                </Text>
            </Card>
        </Animated.View>

        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Health Factor Analysis</Text>
        </View>

        {riskFactors.map((item, index) => (
            <Animated.View key={item.factor} entering={FadeInDown.delay(200 + index * 100)}>
                <View style={[styles.factorRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <View style={styles.factorInfo}>
                        <View style={styles.factorHeader}>
                            <Text style={[styles.factorName, { color: theme.colors.text.primary }]}>{item.factor}</Text>
                            <Text style={[styles.factorImpact, { color: item.color }]}>{item.impact}</Text>
                        </View>
                        <Text style={[styles.factorValue, { color: theme.colors.text.secondary }]}>{item.value} Contribution</Text>
                        <View style={[styles.weightBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <View style={[styles.weightFill, { backgroundColor: item.color, width: `${item.weight * 100}%` }]} />
                        </View>
                    </View>
                </View>
            </Animated.View>
        ))}

        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Inherited Risk Factors</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(500)}>
            <Card>
                <View style={styles.projectionHeader}>
                    <View style={styles.projectionValueBox}>
                        <Text style={[styles.projectionValue, { color: theme.colors.text.primary }]}>x{uprs?.genetic_modifier?.toFixed(2) || '1.10'}</Text>
                        <Text style={[styles.projectionLabel, { color: theme.colors.text.muted }]}>Family History Multiplier</Text>
                    </View>
                    <View style={[styles.projectionTrend, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                        <ShieldCheck size={16} color={theme.colors.secondary} />
                        <Text style={[styles.trendText, { color: theme.colors.secondary }]}>Genetic Profile</Text>
                    </View>
                </View>
                <Text style={[styles.summaryText, { color: theme.colors.text.secondary, marginTop: 12 }]}>
                    Your health score is adjusted by this factor based on family health history and any provided genetic markers.
                </Text>
            </Card>
        </Animated.View>

        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Clinical Context</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(700)}>
            <View style={[styles.contextCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.contextItem}>
                    <Activity size={18} color={theme.colors.primary} />
                    <Text style={[styles.contextText, { color: theme.colors.text.secondary }]}>
                        Your current cardiovascular profile matches patterns seen in individuals with high sensitivity to sodium intake.
                    </Text>
                </View>
                <View style={styles.contextItem}>
                    <ShieldCheck size={18} color={theme.colors.success} />
                    <Text style={[styles.contextText, { color: theme.colors.text.secondary }]}>
                        Risk factor suppression possible through 20% increase in moderate aerobic activity.
                    </Text>
                </View>
            </View>
        </Animated.View>

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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  infoBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  summaryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 157, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  factorRow: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  factorInfo: {
    flex: 1,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  factorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  factorImpact: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  factorValue: {
    fontSize: 14,
    marginBottom: 12,
  },
  weightBar: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  weightFill: {
    height: '100%',
    borderRadius: 3,
  },
  projectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  projectionValueBox: {
    gap: 2,
  },
  projectionValue: {
    fontSize: 32,
    fontWeight: '900',
  },
  projectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  projectionTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  projectionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  noticeText: {
    fontSize: 11,
    flex: 1,
  },
  contextCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 16,
  },
  contextItem: {
    flexDirection: 'row',
    gap: 12,
  },
  contextText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});