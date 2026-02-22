import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brain, Shield, Activity, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

export const AIScanScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [scanning, setScanning] = useState(true);
  const [step, setStep] = useState(0);
  const scanLinePos = useSharedValue(0);
  
  const steps = [
    "Collecting your latest health data...",
    "Reviewing your heart rate history...",
    "Comparing with millions of health profiles...",
    "Checking for any unusual patterns...",
    "Preparing your personalized results..."
  ];

  useEffect(() => {
    scanLinePos.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    const timer = setInterval(() => {
      setStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(timer);
        setScanning(false);
        return prev;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    top: interpolate(scanLinePos.value, [0, 1], [0, 300]),
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>AI Diagnosis</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {scanning ? (
          <View style={styles.scanContainer}>
            <View style={[styles.scanFrame, { borderColor: theme.colors.primary }]}>
              <Brain size={120} color={theme.colors.primary} strokeWidth={1} />
              <Animated.View style={[styles.scanLine, scanLineStyle, { backgroundColor: theme.colors.primary }]} />
            </View>
            
            <Animated.View entering={FadeInDown} key={step} style={styles.stepContainer}>
              <Activity size={20} color={theme.colors.primary} />
              <Text style={[styles.stepText, { color: theme.colors.text.secondary }]}>{steps[step]}</Text>
            </Animated.View>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: theme.colors.surface }]}>
                    <Animated.View 
                        style={[
                            styles.progressFill, 
                            { 
                                backgroundColor: theme.colors.primary,
                                width: `${((step + 1) / steps.length) * 100}%` 
                            }
                        ]} 
                    />
                </View>
            </View>
          </View>
        ) : (
          <Animated.ScrollView 
            entering={FadeIn}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultContent}
          >
            <View style={styles.resultHeader}>
                <CheckCircle2 size={64} color={theme.colors.success} />
                <Text style={[styles.resultTitle, { color: theme.colors.text.primary }]}>Scan Complete</Text>
                <Text style={[styles.resultSubtitle, { color: theme.colors.text.secondary }]}>AI has processed your data for alternative health markers.</Text>
            </View>

            <View style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.resultRow}>
                    <View style={[styles.resultIcon, { backgroundColor: 'rgba(79, 157, 255, 0.1)' }]}>
                        <Activity size={20} color={theme.colors.primary} />
                    </View>
                    <View style={styles.resultInfo}>
                        <Text style={[styles.resultLabel, { color: theme.colors.text.primary }]}>Heart & Circulation</Text>
                        <Text style={[styles.resultStatus, { color: theme.colors.success }]}>Healthy Profile</Text>
                    </View>
                </View>
                <Text style={[styles.resultDesc, { color: theme.colors.text.secondary }]}>Based on your resting heart rate and activity, your cardiovascular risk is low. {"\n"}<Text style={{ fontWeight: '700' }}>Prevention:</Text> Maintain 150 min/week of brisk walking.</Text>
            </View>

            <View style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.resultRow}>
                    <View style={[styles.resultIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                        <Shield size={20} color={theme.colors.secondary} />
                    </View>
                    <View style={styles.resultInfo}>
                        <Text style={[styles.resultLabel, { color: theme.colors.text.primary }]}>Blood Pressure & Glucose</Text>
                        <Text style={[styles.resultStatus, { color: theme.colors.success }]}>Stable Range</Text>
                    </View>
                </View>
                <Text style={[styles.resultDesc, { color: theme.colors.text.secondary }]}>No signs of hypertension or diabetes detected in current readings. {"\n"}<Text style={{ fontWeight: '700' }}>Prevention:</Text> Reduce salt intake and maintain a fiber-rich diet.</Text>
            </View>

            <View style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.resultRow}>
                    <View style={[styles.resultIcon, { backgroundColor: 'rgba(20, 184, 166, 0.1)' }]}>
                        <CheckCircle2 size={20} color={theme.colors.success} />
                    </View>
                    <View style={styles.resultInfo}>
                        <Text style={[styles.resultLabel, { color: theme.colors.text.primary }]}>Critical Care Indicators</Text>
                        <Text style={[styles.resultStatus, { color: theme.colors.success }]}>Normal (Low Risk)</Text>
                    </View>
                </View>
                <Text style={[styles.resultDesc, { color: theme.colors.text.secondary }]}>Sepsis and ICU escalation markers (temperature, SpO2) are within safety bounds. {"\n"}<Text style={{ fontWeight: '700' }}>Prevention:</Text> Monitor for sudden fever or breathing changes.</Text>
            </View>

            <View style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.resultRow}>
                    <View style={[styles.resultIcon, { backgroundColor: 'rgba(220, 38, 38, 0.1)' }]}>
                        <AlertCircle size={20} color={theme.colors.risk.high} />
                    </View>
                    <View style={styles.resultInfo}>
                        <Text style={[styles.resultLabel, { color: theme.colors.text.primary }]}>Mental Wellbeing & Fatigue</Text>
                        <Text style={[styles.resultStatus, { color: theme.colors.risk.moderate }]}>Burnout Warning</Text>
                    </View>
                </View>
                <Text style={[styles.resultDesc, { color: theme.colors.text.secondary }]}>Irregular sleep duration and high stress scores suggest high fatigue levels. {"\n"}<Text style={{ fontWeight: '700' }}>Prevention:</Text> Prioritize 8 hours of sleep and 15-minute daily meditation.</Text>
            </View>

            <TouchableOpacity 
                style={[styles.doneBtn, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.doneBtnText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </Animated.ScrollView>
        )}
      </View>
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
  content: {
    flex: 1,
  },
  scanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  scanFrame: {
    width: 300,
    height: 300,
    borderRadius: 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    shadowColor: '#4F9DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  resultContent: {
    padding: 20,
    paddingBottom: 40,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  resultCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  resultStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  doneBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
