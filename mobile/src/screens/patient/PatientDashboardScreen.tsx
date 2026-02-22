import React, { useEffect, useState, useCallback } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Bell, Search, Activity, Heart, Zap, Thermometer, Droplets, BrainCircuit, ChevronRight, Watch, ShieldAlert } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, Layout, FadeIn } from 'react-native-reanimated';
import { endpoints } from '../../services/endpoints';
import { RiskResponse, TrendsResponse, RecommendationsResponse, UPRSResponse } from '../../types/api';
import { Card } from '../../components/Card';
import { RiskBadge } from '../../components/RiskBadge';
import { TrendChart } from '../../components/TrendChart';
import { InsightBox } from '../../components/InsightBox';
import { PreventionCard } from '../../components/PreventionCard';
import { NonDiagnosticBanner } from '../../components/NonDiagnosticBanner';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ErrorState } from '../../components/ErrorState';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');

export const PatientDashboardScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useAuthStore();
  const { theme, isDark } = useTheme();
  
  const [isCritical, setIsCritical] = useState(false);
  
  const [uprsData, setUprsData] = useState<UPRSResponse | null>(null);
  const [riskData, setRiskData] = useState<RiskResponse | null>(null);
  const [trends, setTrends] = useState<TrendsResponse | null>(null);
  const [recs, setRecs] = useState<RecommendationsResponse | null>(null);

  const fetchData = async () => {
    setError(false);
    try {
      const [uprsRes, trendsRes, recsRes, riskRes] = await Promise.all([
        endpoints.risk.getUPRS(),
        endpoints.trends.get(),
        endpoints.recommendations.get(),
        endpoints.risk.get(),
      ]);
      setUprsData(uprsRes.data);
      setTrends(trendsRes.data);
      setRecs(recsRes.data);
      setRiskData(riskRes.data);
      
      // Check if any metric is critical from AI Scan logic or UPRS
      if (uprsRes.data.data.uprs_tier === 'elevated' || uprsRes.data.data.uprs_score > 0.8) {
        setIsCritical(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.padding}>
          <LoadingSkeleton height={40} />
          <LoadingSkeleton height={180} />
          <LoadingSkeleton height={200} />
          <LoadingSkeleton height={200} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ErrorState onRetry={fetchData} />
      </SafeAreaView>
    );
  }

  const risk = uprsData?.data;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.headerBar, { backgroundColor: theme.colors.background }]}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.colors.primary }]}>Your Daily Health Status</Text>
          <Text style={[styles.subWelcome, { color: theme.colors.text.primary }]}>Hello, {user?.name?.split(' ')[0] || 'User'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Bell size={22} color={theme.colors.text.primary} />
            <View style={[styles.notificationDot, { borderColor: theme.colors.surface, backgroundColor: theme.colors.primary }]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            titleColor={theme.colors.text.secondary}
          />
        }
      >
        <NonDiagnosticBanner />

        <Animated.View entering={FadeInUp.delay(100)}>
          <TouchableOpacity 
            style={[styles.aiScanBanner, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('AIScan')}
            activeOpacity={0.9}
          >
            <View style={styles.aiScanContent}>
              <View style={styles.aiIconBox}>
                <BrainCircuit size={24} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.aiScanTitle}>Start AI Health Scan</Text>
                <Text style={styles.aiScanSubtitle}>Advanced analysis based on recent activity</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

        {risk && (
            <Animated.View entering={FadeInUp.delay(200)}>
                <Card className="overflow-hidden">
                    <View style={styles.riskHeader}>
                        <View style={styles.riskTitleContainer}>
                            <Heart size={16} color={theme.colors.primary} />
                            <Text style={[styles.cardTitle, { color: theme.colors.text.secondary }]}>Health Index</Text>
                        </View>
                        <RiskBadge level={risk.uprs_tier === 'elevated' ? 'high' : risk.uprs_tier === 'moderate' ? 'moderate' : 'low'} />
                    </View>
                    
                    <View style={styles.mainScoreRow}>
                        <View style={[styles.scoreContainer, { borderColor: theme.colors.primary, backgroundColor: isDark ? 'rgba(79, 157, 255, 0.05)' : 'rgba(79, 157, 255, 0.02)' }]}>
                            <Text style={[styles.scoreValue, { color: theme.colors.text.primary }]}>{Math.round(risk.uprs_score * 100)}%</Text>
                            <Text style={[styles.scoreSubtext, { color: theme.colors.text.muted }]}>Stability Score</Text>
                        </View>
                        <View style={styles.scoreInfo}>
                            <Text style={[styles.scoreLabel, { color: theme.colors.text.primary }]}>Analysis Accuracy: {Math.round(risk.confidence_score * 100)}%</Text>
                            <Text style={[styles.riskMessage, { color: theme.colors.text.secondary }]} numberOfLines={3}>{uprsData?.message}</Text>
                        </View>
                    </View>
                    
                    <View style={[styles.lastUpdateRow, { borderTopColor: theme.colors.border }]}>
                       <Text style={[styles.updateText, { color: theme.colors.text.muted }]}>Computed: {risk.computed_at ? new Date(risk.computed_at).toLocaleTimeString() : 'Live'}</Text>
                       <TouchableOpacity onPress={() => navigation.navigate('RiskDetails', { uprs: risk })}>
                         <Text style={[styles.detailsLink, { color: theme.colors.primary }]}>Analysis Detail</Text>
                       </TouchableOpacity>
                    </View>
                </Card>
            </Animated.View>
        )}

        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Your Vital Signs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DataSync')} style={styles.syncBtn}>
              <Watch size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
              <Text style={[styles.syncBtnText, { color: theme.colors.primary }]}>Sync Data</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.statGrid}>
            <Animated.View entering={FadeInDown.delay(400)} style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={[styles.statIconBox, { backgroundColor: 'rgba(220, 38, 38, 0.1)' }]}>
                    <Activity size={20} color={theme.colors.risk.high} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>72 bpm</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Heart Rate</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(500)} style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={[styles.statIconBox, { backgroundColor: 'rgba(79, 157, 255, 0.1)' }]}>
                    <Zap size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>8.4k</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Activity</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600)} style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={[styles.statIconBox, { backgroundColor: 'rgba(20, 184, 166, 0.1)' }]}>
                    <Droplets size={20} color={theme.colors.success} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>98%</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Oxygen</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(700)} style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={[styles.statIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                    <Thermometer size={20} color={theme.colors.secondary} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>36.6°C</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Temp</Text>
            </Animated.View>
        </View>

        {trends && (
            <View style={styles.trendsSection}>
                <TrendChart 
                    type="line" 
                    title="Heart Rate History (7d)" 
                    data={trends.heartRate7d.map(d => ({ label: d.date.split('-')[2], value: d.value }))}
                    color={theme.colors.risk.high}
                />
                <TrendChart 
                    type="bar" 
                    title="Activity Levels (7d)" 
                    data={trends.activity7d.map(d => ({ label: d.date.split('-')[2], value: d.value }))}
                    color={theme.colors.primary}
                />
            </View>
        )}

        {riskData?.topFactors && (
            <InsightBox factors={riskData.topFactors} />
        )}

        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Protocols</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
                <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
        </View>
        
        {recs?.items.map((item, index) => (
            <PreventionCard 
                key={index}
                title={item.title}
                reason={item.reason}
                action={item.action}
                priority={item.priority}
            />
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padding: {
      padding: 16,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subWelcome: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    elevation: 4,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sosBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  content: {
    padding: 16,
  },
  aiScanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#4F9DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  aiScanContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  aiIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiScanTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  aiScanSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  riskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mainScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  scoreSubtext: {
    fontSize: 8,
    textTransform: 'uppercase',
  },
  scoreInfo: {
    flex: 1,
    marginLeft: 24,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  riskMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  lastUpdateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  updateText: {
    fontSize: 11,
  },
  detailsLink: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 157, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  syncBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '700',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    width: (width - 16 * 3) / 2,
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
  trendsSection: {
    marginTop: 24,
    gap: 16,
  },
});