import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Share, Platform, TextInput, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share2, ArrowLeft, MoreVertical, Calendar, Info, ShieldCheck, CheckCircle2, XCircle, AlertCircle, TrendingUp } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { useAlertStore } from '../../store/alertStore';

export const PatientDetailScreen = ({ route, navigation }: any) => {
  const { theme, isDark } = useTheme();
  const showAlert = useAlertStore((state) => state.showAlert);
  const { patientId, name, caseId } = route.params;
  const [loading, setLoading] = useState(true);
  
  const [riskData, setRiskData] = useState<RiskResponse | null>(null);
  const [trends, setTrends] = useState<TrendsResponse | null>(null);
  const [recs, setRecs] = useState<RecommendationsResponse | null>(null);

  // Review State
  const [decision, setDecision] = useState<'dismissed' | 'referred' | 'escalated' | null>(null);
  const [notes, setNotes] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [riskRes, trendsRes, recsRes] = await Promise.all([
          endpoints.risk.get(patientId),
          endpoints.trends.get(patientId),
          endpoints.recommendations.get(patientId),
        ]);
        setRiskData(riskRes.data);
        setTrends(trendsRes.data);
        setRecs(recsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const handleSubmitReview = async () => {
    if (!decision || notes.length < 10) {
        showAlert({
          title: 'Review Incomplete',
          message: 'Clinical judgment requires a decision and at least 10 characters of detailed notes.',
          type: 'warning'
        });
        return;
    }

    setSubmitting(true);
    try {
        await endpoints.clinician.submitReview(caseId, {
            decision,
            notes,
            recommendation,
            follow_up_required: false
        });
        showAlert({
          title: 'Review Finalized',
          message: 'Clinical decision has been synchronized with the patient record and audit trail.',
          type: 'success'
        });
        navigation.goBack();
    } catch (err: any) {
        showAlert({
          title: 'Submission Failed',
          message: err.response?.data?.message || 'Check your system connection and try again.',
          type: 'error'
        });
    } finally {
        setSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Clinical Summary for ${name}: Cardiac Risk Score ${riskData?.score}%. Level: ${riskData?.level}.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.padding}>
          <LoadingSkeleton height={60} />
          <LoadingSkeleton height={180} />
          <LoadingSkeleton height={150} />
          <LoadingSkeleton height={200} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.navBar, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.navBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <ArrowLeft size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.colors.text.primary }]}>Patient Profile</Text>
        <TouchableOpacity onPress={handleShare} style={[styles.navBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Share2 size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
            <View style={[styles.avatarLarge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.avatarTextLarge}>{name.charAt(0)}</Text>
            </View>
            <View style={styles.profileMeta}>
                <Text style={[styles.patientName, { color: theme.colors.text.primary }]}>{name}</Text>
                <View style={[styles.idBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15, 23, 42, 0.05)' }]}>
                    <Text style={[styles.idText, { color: theme.colors.text.muted }]}>PATIENT-ID: {patientId.slice(0, 8)}</Text>
                </View>
            </View>
        </View>

        <NonDiagnosticBanner />

        {riskData && (
            <Card>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardLabel, { color: theme.colors.text.muted }]}>Clinical Risk Analysis</Text>
                    <RiskBadge level={riskData.level} />
                </View>
                <View style={styles.riskMainRow}>
                    <View style={[styles.scoreBox, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                        <Text style={[styles.scorePercent, { color: theme.colors.text.primary }]}>{riskData.score}%</Text>
                        <Text style={[styles.scoreUnit, { color: theme.colors.text.secondary }]}>10-Year Risk</Text>
                    </View>
                    <View style={styles.riskDescriptionBox}>
                        <Text style={[styles.riskMsg, { color: theme.colors.text.secondary }]}>{riskData.message}</Text>
                    </View>
                </View>
                <View style={[styles.verifiedRow, { borderTopColor: theme.colors.border }]}>
                    <ShieldCheck size={14} color={theme.colors.success} />
                    <Text style={[styles.verifiedText, { color: theme.colors.success }]}>AI Analysis Verified • {riskData.updatedAt}</Text>
                </View>
            </Card>
        )}

        {riskData?.breakdown && (
            <Card title="Factor Breakdown">
                <View style={styles.breakdownList}>
                    {riskData.breakdown.map((item, idx) => (
                        <View key={idx} style={[styles.breakdownItem, { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15, 23, 42, 0.03)' }]}>
                            <View style={styles.breakdownHeader}>
                                <View style={[styles.factorDot, { backgroundColor: theme.colors.accent }]} />
                                <Text style={[styles.factorName, { color: theme.colors.text.primary }]}>{item.factor}</Text>
                                <View style={[styles.impactBadge, { backgroundColor: `${theme.colors.risk.high}14` }]}>
                                    <Text style={[styles.impactText, { color: theme.colors.risk.high }]}>+{item.weight}%</Text>
                                </View>
                            </View>
                            <Text style={[styles.explanation, { color: theme.colors.text.secondary }]}>{item.explanation}</Text>
                        </View>
                    ))}
                </View>
            </Card>
        )}

        {trends && (
            <View style={styles.chartSection}>
                <TrendChart 
                    type="line" 
                    title="Vitals History (Heart Rate)" 
                    data={trends.heartRate7d.map(d => ({ label: d.date.split('-')[2], value: d.value }))}
                    color={theme.colors.risk.high}
                />
            </View>
        )}

        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Patient Vitals Overview</Text>
        </View>

        <View style={styles.statGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={[styles.statIconBox, { backgroundColor: 'rgba(220, 38, 38, 0.1)' }]}>
                    <TrendingUp size={20} color={theme.colors.risk.high} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>72 bpm</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Heart Rate</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={[styles.statIconBox, { backgroundColor: 'rgba(79, 157, 255, 0.1)' }]}>
                    <ShieldCheck size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>98%</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Oxygen Sat.</Text>
            </View>
        </View>

        {caseId && (
            <Card title="Pending Clinical Review">
                <Text style={[styles.reviewSub, { color: theme.colors.text.secondary }]}>Select decision based on neural variance and clinical judgment.</Text>
                
                <View style={styles.decisionRow}>
                    <TouchableOpacity 
                        style={[styles.decisionBtn, { borderColor: theme.colors.border }, decision === 'dismissed' && { backgroundColor: `${theme.colors.success}1A`, borderColor: theme.colors.success }]}
                        onPress={() => setDecision('dismissed')}
                    >
                        <CheckCircle2 size={18} color={decision === 'dismissed' ? theme.colors.success : theme.colors.text.muted} />
                        <Text style={[styles.decisionText, { color: decision === 'dismissed' ? theme.colors.success : theme.colors.text.muted }]}>Dismiss</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.decisionBtn, { borderColor: theme.colors.border }, decision === 'referred' && { backgroundColor: `${theme.colors.primary}1A`, borderColor: theme.colors.primary }]}
                        onPress={() => setDecision('referred')}
                    >
                        <AlertCircle size={18} color={decision === 'referred' ? theme.colors.primary : theme.colors.text.muted} />
                        <Text style={[styles.decisionText, { color: decision === 'referred' ? theme.colors.primary : theme.colors.text.muted }]}>Refer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.decisionBtn, { borderColor: theme.colors.border }, decision === 'escalated' && { backgroundColor: `${theme.colors.risk.high}1A`, borderColor: theme.colors.risk.high }]}
                        onPress={() => setDecision('escalated')}
                    >
                        <XCircle size={18} color={decision === 'escalated' ? theme.colors.risk.high : theme.colors.text.muted} />
                        <Text style={[styles.decisionText, { color: decision === 'escalated' ? theme.colors.risk.high : theme.colors.text.muted }]}>Escalate</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.colors.text.secondary }]}>Clinical Notes (Audited)</Text>
                    <TextInput 
                        style={[styles.textArea, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                        multiline
                        numberOfLines={4}
                        placeholder="Provide reasoning for decision..."
                        placeholderTextColor={theme.colors.text.muted}
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.colors.text.secondary }]}>Patient Recommendation (Non-Diagnostic)</Text>
                    <TextInput 
                        style={[styles.textInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                        placeholder="e.g. Schedule extra activity session..."
                        placeholderTextColor={theme.colors.text.muted}
                        value={recommendation}
                        onChangeText={setRecommendation}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.submitBtn, submitting && { opacity: 0.7 }, { backgroundColor: theme.colors.primary }]}
                    onPress={handleSubmitReview}
                    disabled={submitting}
                >
                    {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>Finalize Decision</Text>}
                </TouchableOpacity>
            </Card>
        )}

        <View style={styles.actionSection}>
            <TouchableOpacity style={[styles.primaryAction, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}>
                <Calendar size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Schedule Consultation</Text>
            </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.background,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  padding: {
      padding: tokens.spacing.md,
  },
  content: {
    padding: tokens.spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.xs,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarTextLarge: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileMeta: {
    marginLeft: tokens.spacing.md,
  },
  patientName: {
    fontSize: 22,
    fontWeight: '800',
    color: tokens.colors.text.primary,
  },
  idBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  idText: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.colors.text.muted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: tokens.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  riskMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  scoreBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: tokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  scorePercent: {
    fontSize: 22,
    fontWeight: '800',
    color: tokens.colors.text.primary,
  },
  scoreUnit: {
    fontSize: 8,
    fontWeight: '700',
    color: tokens.colors.text.secondary,
    textTransform: 'uppercase',
  },
  riskDescriptionBox: {
    flex: 1,
    marginLeft: tokens.spacing.md,
  },
  riskMsg: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    lineHeight: 18,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#22C55E',
    marginLeft: 6,
  },
  breakdownList: {
    marginTop: -tokens.spacing.sm,
  },
  breakdownItem: {
    marginBottom: tokens.spacing.md,
    paddingBottom: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15, 23, 42, 0.03)',
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  factorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.colors.accent,
    marginRight: 8,
  },
  factorName: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    flex: 1,
  },
  impactBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  impactText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
  },
  explanation: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    lineHeight: 16,
    marginLeft: 14,
  },
  chartSection: {
    marginBottom: tokens.spacing.md,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  statGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionSection: {
    marginTop: tokens.spacing.md,
  },
  primaryAction: {
    backgroundColor: tokens.colors.primary,
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },
  reviewSub: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    marginBottom: 16,
  },
  decisionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  decisionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    gap: 4,
  },
  decisionText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    height: 100,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
  },
  submitBtn: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  }
});