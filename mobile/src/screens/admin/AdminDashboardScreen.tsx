import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, BrainCircuit, Activity, Heart, ShieldCheck, Zap, TrendingUp, Save } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { endpoints } from '../../services/endpoints';
import { AdminWeightsPayload } from '../../types/api';
import { useTheme } from '../../theme/ThemeContext';
import { useAlertStore } from '../../store/alertStore';
import { Card } from '../../components/Card';

export const AdminDashboardScreen = () => {
  const { theme } = useTheme();
  const showAlert = useAlertStore((state) => state.showAlert);
  const [weights, setWeights] = useState<AdminWeightsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchWeights = async () => {
    try {
      const res = await endpoints.admin.getWeights();
      setWeights(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const handleUpdateWeights = async () => {
    if (!weights) return;
    const sum = weights.cardiovascular_weight + weights.metabolic_weight + weights.mental_weight;
    if (Math.abs(sum - 1.0) > 0.001) {
      showAlert({
        title: 'Validation Error',
        message: 'Global UPRS risk weights must sum exactly to 1.0 to maintain model calibration.',
        type: 'warning'
      });
      return;
    }

    setSaving(true);
    try {
      await endpoints.admin.updateWeights(weights);
      showAlert({
        title: 'Configuration Committed',
        message: 'UPRS risk weights have been updated across all active inference nodes.',
        type: 'success'
      });
    } catch (err) {
      showAlert({
        title: 'System Error',
        message: 'Critical failure during model weight propagation.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>System Admin</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>Global UPRS Model Configuration</Text>
        </View>

        <View style={styles.sectionHeader}>
            <BrainCircuit size={18} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Risk Weight Distribution</Text>
        </View>

        <Card>
            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Heart size={14} color={theme.colors.risk.high} />
                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Cardiovascular Weight</Text>
                </View>
                <TextInput 
                    style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                    keyboardType="numeric"
                    value={weights?.cardiovascular_weight.toString()}
                    onChangeText={(v) => setWeights({ ...weights!, cardiovascular_weight: parseFloat(v) || 0 })}
                />
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Zap size={14} color={theme.colors.primary} />
                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Metabolic Weight</Text>
                </View>
                <TextInput 
                    style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                    keyboardType="numeric"
                    value={weights?.metabolic_weight.toString()}
                    onChangeText={(v) => setWeights({ ...weights!, metabolic_weight: parseFloat(v) || 0 })}
                />
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Activity size={14} color={theme.colors.secondary} />
                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Mental Health Weight</Text>
                </View>
                <TextInput 
                    style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                    keyboardType="numeric"
                    value={weights?.mental_weight.toString()}
                    onChangeText={(v) => setWeights({ ...weights!, mental_weight: parseFloat(v) || 0 })}
                />
            </View>

            <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
                onPress={handleUpdateWeights}
                disabled={saving}
            >
                {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <>
                        <Save size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={styles.saveBtnText}>Commit Configuration</Text>
                    </>
                )}
            </TouchableOpacity>
        </Card>

        <View style={styles.sectionHeader}>
            <ShieldCheck size={18} color={theme.colors.success} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Active Model Versions</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(200)}>
            <Card>
                <View style={styles.modelRow}>
                    <View>
                        <Text style={[styles.modelName, { color: theme.colors.text.primary }]}>UPRS-Inference-Engine</Text>
                        <Text style={[styles.modelVersion, { color: theme.colors.text.muted }]}>v1.0.4-stable</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(20, 184, 166, 0.1)' }]}>
                        <Text style={[styles.statusText, { color: theme.colors.success }]}>Active</Text>
                    </View>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.modelRow}>
                    <View>
                        <Text style={[styles.modelName, { color: theme.colors.text.primary }]}>SHAP-Vector-Generator</Text>
                        <Text style={[styles.modelVersion, { color: theme.colors.text.muted }]}>v2.1.0-beta</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                        <Text style={[styles.statusText, { color: theme.colors.secondary }]}>Calibrating</Text>
                    </View>
                </View>
            </Card>
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
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  modelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modelName: {
    fontSize: 14,
    fontWeight: '700',
  },
  modelVersion: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
