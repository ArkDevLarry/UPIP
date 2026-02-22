import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrainCircuit, TrendingUp, Zap, Target, RefreshCw, Heart, Activity, Thermometer, Droplets, ChevronLeft } from 'lucide-react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { Card } from '../../components/Card';
import { RiskBadge } from '../../components/RiskBadge';
import { NonDiagnosticBanner } from '../../components/NonDiagnosticBanner';
import { useAlertStore } from '../../store/alertStore';
import { ENV } from '../../config/env';
import { useAuthStore } from '../../store/authStore';

// ─── Types ──────────────────────────────────────────────────────────────────

interface SmartwatchData {
  heartRate: number;           // bpm
  hrv: number;                 // ms
  bloodOxygen: number;         // %
  skinTemperature: number;     // °C
  respiratoryRate: number;     // breaths/min
  stressScore: number;         // 0-100
  steps: number;
  activeCalories: number;
  sleepScore: number;          // 0-100
  vo2Max: number;
  restingHeartRate: number;    // bpm (7-day avg)
  hrvTrend: number;            // % change vs last week
}

interface GeminiInsights {
  stabilityProbability: number;
  hrvTrend: string;
  hrvTrendSign: '+' | '-';
  metabolicStatus: string;
  metabolicLabel: string;
  forecastLabel: string;
  forecastValue: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  summary: string;
  recommendations: string[];
  alerts: string[];
}

// ─── Gemini API ──────────────────────────────────────────────────────────────

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${ENV.GEMINI_API_KEY}`;

async function fetchGeminiInsights(data: SmartwatchData): Promise<GeminiInsights> {
  const prompt = `
You are a cardiologist-grade AI health analyst. Analyze the following real-time smartwatch biometric data and return a JSON object with predictive health insights.

Smartwatch Data (last 24 hours):
- Heart Rate: ${data.heartRate} bpm
- HRV (Heart Rate Variability): ${data.hrv} ms
- Blood Oxygen (SpO2): ${data.bloodOxygen}%
- Skin Temperature: ${data.skinTemperature}°C
- Respiratory Rate: ${data.respiratoryRate} breaths/min
- Stress Score: ${data.stressScore}/100
- Steps Today: ${data.steps}
- Active Calories: ${data.activeCalories} kcal
- Sleep Score: ${data.sleepScore}/100
- VO2 Max: ${data.vo2Max} ml/kg/min
- 7-Day Resting HR Average: ${data.restingHeartRate} bpm
- HRV Change vs Last Week: ${data.hrvTrend > 0 ? '+' : ''}${data.hrvTrend}%

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "stabilityProbability": <number 0-100, cardiovascular stability probability for next 30 days>,
  "hrvTrend": "<string like '+12%' or '-5%'>",
  "hrvTrendSign": "<'+' or '-'>",
  "metabolicStatus": "<one word: Optimal | Good | Fair | Poor>",
  "metabolicLabel": "<one word: Efficiency | Balanced | Improving | Declining>",
  "forecastLabel": "<string like '90-Day Forecast'>",
  "forecastValue": "<string like 'Low Risk Maintenance' or 'Moderate Risk - Action Needed'>",
  "riskLevel": "<'Low' | 'Moderate' | 'High'>",
  "summary": "<2-sentence AI analysis of the user's cardiovascular health trajectory>",
  "recommendations": ["<actionable tip 1>", "<actionable tip 2>", "<actionable tip 3>"],
  "alerts": []
}

If any metric is critically abnormal (SpO2 < 92%, HR > 110 at rest, Stress > 80), add a string to "alerts".
Be medically accurate, data-driven, and precise.
`;

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
    }),
  });

  if (response.status === 429) {
    throw new Error("Our AI is currently busy. Please wait a moment and try again.");
  }
  if (!response.ok) throw new Error(`AI Service is temporarily unavailable (Status: ${response.status})`);

  const json = await response.json();
  const raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  // Strip possible markdown fences
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as GeminiInsights;
}

// ─── Simulate smartwatch data ────────────────────────────────────────────────

function generateSmartwatchData(): SmartwatchData {
  return {
    heartRate: Math.round(62 + Math.random() * 20),
    hrv: Math.round(38 + Math.random() * 30),
    bloodOxygen: parseFloat((96 + Math.random() * 3).toFixed(1)),
    skinTemperature: parseFloat((36.2 + Math.random() * 0.8).toFixed(1)),
    respiratoryRate: Math.round(14 + Math.random() * 4),
    stressScore: Math.round(20 + Math.random() * 50),
    steps: Math.round(4000 + Math.random() * 8000),
    activeCalories: Math.round(200 + Math.random() * 400),
    sleepScore: Math.round(60 + Math.random() * 35),
    vo2Max: parseFloat((35 + Math.random() * 20).toFixed(1)),
    restingHeartRate: Math.round(58 + Math.random() * 12),
    hrvTrend: parseFloat((-10 + Math.random() * 25).toFixed(1)),
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const MetricPill = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => {
  const { theme } = useTheme();
  return (
      <View style={[metricStyles.pill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={metricStyles.iconLabel}>
          {icon}
          <Text style={[metricStyles.label, { color: theme.colors.text.muted }]}>{label}</Text>
        </View>
        <Text style={[metricStyles.value, { color }]}>{value}</Text>
      </View>
  );
};

const metricStyles = StyleSheet.create({
  pill: { padding: 12, borderRadius: 16, flex: 1, margin: 4, borderWidth: 1 },
  iconLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  label: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 13, fontWeight: '800' },
});

// Remove local RiskBadge as we use the shared one

// ─── Pulse animation ─────────────────────────────────────────────────────────

const PulseIcon = ({ color }: { color: string }) => {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.18, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={animStyle}><BrainCircuit size={48} color={color} /></Animated.View>;
};

// ─── Main Screen ─────────────────────────────────────────────────────────────

export const PredictiveAnalyticsScreen = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const { user } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);
  const [loading, setLoading] = useState(false);
  const [watchData, setWatchData] = useState<SmartwatchData | null>(null);
  const [insights, setInsights] = useState<GeminiInsights | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = generateSmartwatchData();
      setWatchData(data);
      const result = await fetchGeminiInsights(data);
      setInsights(result);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
      showAlert({
        title: 'Analysis Failed',
        message: e.message ?? 'Could not fetch Gemini insights. Check your API key and network.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-analyze on mount
  useEffect(() => { analyze(); }, []);

  const bg = theme.colors.background;
  const primary = theme.colors.primary;
  const success = theme.colors.success ?? '#22c55e';
  const secondary = theme.colors.secondary ?? '#8b5cf6';
  const textPrimary = theme.colors.text.primary;
  const textSecondary = theme.colors.text.secondary;
  const textMuted = theme.colors.text.muted;

  return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        {/* Fixed Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <ChevronLeft size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.title, { color: textPrimary }]}>Predictive Insights</Text>
            <Text style={[styles.subtitle, { color: textSecondary }]}>AI Analysis Engine v2.0</Text>
          </View>
          <TouchableOpacity onPress={analyze} disabled={loading} style={[styles.refreshBtn, { borderColor: primary + '44', backgroundColor: theme.colors.surface }]}>
            {loading
                ? <ActivityIndicator size="small" color={primary} />
                : <RefreshCw size={18} color={primary} />}
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <NonDiagnosticBanner />

          {/* Live Smartwatch Metrics */}
          {watchData && (
              <Animated.View entering={FadeInUp.delay(100)}>
                  <Card title="Live Health Stats">
                  <View style={styles.metricsRow}>
                    <MetricPill icon={<Heart size={14} color="#ef4444" />} label="Heart" value={`${watchData.heartRate} bpm`} color="#ef4444" />
                    <MetricPill icon={<Activity size={14} color={primary} />} label="HRV" value={`${watchData.hrv} ms`} color={primary} />
                  </View>
                  <View style={styles.metricsRow}>
                    <MetricPill icon={<Droplets size={14} color="#3b82f6" />} label="SpO2" value={`${watchData.bloodOxygen}%`} color="#3b82f6" />
                    <MetricPill icon={<Thermometer size={14} color="#f59e0b" />} label="Temp" value={`${watchData.skinTemperature}°C`} color="#f59e0b" />
                  </View>
                  <View style={styles.metricsRow}>
                    <MetricPill icon={<Activity size={14} color={secondary} />} label="Stress" value={`${watchData.stressScore}`} color={watchData.stressScore > 70 ? '#ef4444' : secondary} />
                    <MetricPill icon={<TrendingUp size={14} color={success} />} label="Sleep" value={`${watchData.sleepScore}`} color={success} />
                  </View>
                </Card>
              </Animated.View>
          )}

          {/* Alerts */}
          {insights?.alerts && insights.alerts.length > 0 && (
              <Animated.View entering={FadeInUp.delay(150)}>
                <View style={styles.alertBox}>
                  <Text style={styles.alertTitle}>⚠️ Health Alerts</Text>
                  {insights.alerts.map((a, i) => (
                      <Text key={i} style={styles.alertText}>• {a}</Text>
                  ))}
                </View>
              </Animated.View>
          )}

          {/* Loading state */}
          {loading && !insights && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={primary} />
                <Text style={[styles.loadingText, { color: textSecondary }]}>AI is carefully analyzing your health data...</Text>
              </View>
          )}

          {/* Neural Risk Analysis */}
          {insights && (
              <>
                <Animated.View entering={FadeInUp.delay(200)}>
                  <Card title="Smart Health Assessment">
                    <View style={styles.mainInsight}>
                      <PulseIcon color={primary} />
                      <View style={styles.insightText}>
                        <Text style={[styles.insightTitle, { color: textSecondary }]}>Current Stability</Text>
                        <Text style={[styles.insightValue, { color: primary }]}>{insights.stabilityProbability.toFixed(1)}%</Text>
                        <RiskBadge level={insights.riskLevel.toLowerCase() as any} />
                      </View>
                    </View>
                    <Text style={[styles.description, { color: textSecondary }]}>{insights.summary}</Text>
                  </Card>
                </Animated.View>

                {/* Grid Cards */}
                <View style={styles.grid}>
                  <Animated.View entering={FadeInUp.delay(400)} style={styles.gridItem}>
                    <Card animate={false}>
                      <View style={[styles.gridIconBox, { backgroundColor: insights.hrvTrendSign === '+' ? 'rgba(20, 184, 166, 0.1)' : 'rgba(220, 38, 38, 0.1)' }]}>
                        <TrendingUp size={20} color={insights.hrvTrendSign === '+' ? success : '#ef4444'} />
                      </View>
                      <Text style={[styles.gridLabel, { color: textMuted }]}>HRV Trend</Text>
                      <Text style={[styles.gridValue, { color: textPrimary }]}>{insights.hrvTrend}</Text>
                      <Text style={[styles.gridSub, { color: insights.hrvTrendSign === '+' ? success : '#ef4444' }]}>
                        {insights.hrvTrendSign === '+' ? 'Positive' : 'Declining'}
                      </Text>
                    </Card>
                  </Animated.View>
                  <Animated.View entering={FadeInUp.delay(600)} style={styles.gridItem}>
                    <Card animate={false}>
                      <View style={[styles.gridIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                        <Zap size={20} color={secondary} />
                      </View>
                      <Text style={[styles.gridLabel, { color: textMuted }]}>Metabolic</Text>
                      <Text style={[styles.gridValue, { color: textPrimary }]}>{insights.metabolicStatus}</Text>
                      <Text style={[styles.gridSub, { color: success }]}>{insights.metabolicLabel}</Text>
                    </Card>
                  </Animated.View>
                </View>

                {/* Future Projections */}
                <Animated.View entering={FadeInUp.delay(800)}>
                  <Card title="Future Projections">
                    <View style={styles.projectionItem}>
                      <View style={[styles.projectionIconBox, { backgroundColor: 'rgba(79, 157, 255, 0.1)' }]}>
                        <Target size={20} color={primary} />
                      </View>
                      <View style={styles.projectionText}>
                        <Text style={[styles.projectionLabel, { color: textMuted }]}>{insights.forecastLabel}</Text>
                        <Text style={[styles.projectionValue, { color: textPrimary }]}>{insights.forecastValue}</Text>
                      </View>
                    </View>
                  </Card>
                </Animated.View>

                {/* AI Recommendations */}
                {insights.recommendations.length > 0 && (
                    <Animated.View entering={FadeInUp.delay(1000)}>
                      <Card title="AI Recommendations">
                        {insights.recommendations.map((rec, i) => (
                            <View key={i} style={styles.recItem}>
                              <View style={[styles.recDot, { backgroundColor: primary }]} />
                              <Text style={[styles.recText, { color: textSecondary }]}>{rec}</Text>
                            </View>
                        ))}
                      </Card>
                    </Animated.View>
                )}

                {/* Footer note */}
                <Text style={[styles.footer, { color: textMuted }]}>
                  Health insights are powered by advanced AI · Based on your recent health trends · Not a medical diagnosis
                </Text>
              </>
          )}

          {/* Error state */}
          {error && !loading && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {error}</Text>
                <TouchableOpacity onPress={analyze} style={[styles.retryBtn, { backgroundColor: primary }]}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Retry</Text>
                </TouchableOpacity>
              </View>
          )}
        </ScrollView>
      </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: tokens.spacing.md, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  refreshBtn: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginLeft: 12,
  },
  metricsRow: { flexDirection: 'row', marginBottom: 4 },
  mainInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  insightText: { marginLeft: tokens.spacing.md, flex: 1 },
  insightTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  insightValue: { fontSize: 36, fontWeight: '800', marginBottom: 6 },
  description: { fontSize: 14, lineHeight: 22 },
  grid: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  gridItem: { flex: 1 },
  gridIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gridLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  gridValue: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  gridSub: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  projectionItem: { flexDirection: 'row', alignItems: 'center' },
  projectionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectionText: { marginLeft: tokens.spacing.md },
  projectionLabel: { fontSize: 11, textTransform: 'uppercase' },
  projectionValue: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  recItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  recDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, marginRight: 10 },
  recText: { fontSize: 14, lineHeight: 20, flex: 1 },
  alertBox: {
    backgroundColor: '#ef444422',
    borderRadius: 14,
    padding: 16,
    marginBottom: tokens.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  alertTitle: { color: '#ef4444', fontWeight: '700', fontSize: 14, marginBottom: 6 },
  alertText: { color: '#ef4444', fontSize: 13, lineHeight: 20 },
  loadingBox: { alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 16, fontSize: 14, textAlign: 'center' },
  errorBox: { alignItems: 'center', padding: 30 },
  errorText: { color: '#ef4444', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  footer: { fontSize: 11, textAlign: 'center', marginTop: 20, lineHeight: 18, opacity: 0.7 },
});