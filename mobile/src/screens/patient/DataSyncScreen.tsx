import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Watch, Smartphone, ChevronRight, CheckCircle2, Info, Activity, Droplets, Thermometer, Weight, RefreshCw, X, ShieldAlert, FileUp, FileText, Scan, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  Easing, 
  FadeIn, 
  FadeOut,
  interpolate,
  withSequence
} from 'react-native-reanimated';
import { endpoints } from '../../services/endpoints';
import { Card } from '../../components/Card';
import { useTheme } from '../../theme/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';

const { width, height } = Dimensions.get('window');

export const DataSyncScreen = ({ navigation }: any) => {
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncPlatform, setSyncPlatform] = useState('');
  const [lastSync, setLastSync] = useState<string | null>(null);
  const { theme } = useTheme();
  const { consents } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  const hasWearableConsent = consents.includes('wearable');
  const hasClinicalConsent = consents.includes('clinical');

  // Form state
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [weight, setWeight] = useState('');
  const [isSmoking, setIsSmoking] = useState(false);
  const [isDiabetes, setIsDiabetes] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([
    { id: '1', name: 'Blood Test Results.pdf', date: 'Oct 12, 2025', size: '1.2 MB' },
    { id: '2', name: 'Cardiology Report.pdf', date: 'Sep 05, 2025', size: '2.4 MB' },
  ]);

  const rotate = useSharedValue(0);

  useEffect(() => {
    if (syncing || uploading) {
      rotate.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotate.value = 0;
    }
  }, [syncing, uploading]);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 360}deg` }]
  }));

  const handleUpload = () => {
    setUploading(true);
    setSyncPlatform('Medical Record');
    setSyncProgress(0);

    // Simulate scan/upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      setSyncProgress(progress);
      if (progress >= 1) {
        clearInterval(interval);
        const newRecord = {
          id: Math.random().toString(),
          name: `Scan_Report_${new Date().toLocaleDateString().replace(/\//g, '_')}.pdf`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
        };
        setMedicalRecords(prev => [newRecord, ...prev]);
        setUploading(false);
        showAlert({
          title: 'Analysis Complete',
          message: 'Medical report scanned and ingested into AI health model.',
          type: 'success'
        });
      }
    }, 300);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert({
        title: 'Permission Denied',
        message: 'We need access to your media library to upload reports.',
        type: 'error'
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setUploading(true);
      setSyncPlatform('Media Upload');
      setSyncProgress(0);

      // Simulate processing the picked image
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.15;
        if (progress > 1) progress = 1;
        setSyncProgress(progress);
        
        if (progress >= 1) {
          clearInterval(interval);
          const newRecord = {
            id: Math.random().toString(),
            name: `Media_${new Date().getTime()}.jpg`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            size: `${(Math.random() * 3 + 1).toFixed(1)} MB`
          };
          setMedicalRecords(prev => [newRecord, ...prev]);
          setUploading(false);
          showAlert({
            title: 'Media Ingested',
            message: 'Health record from media gallery successfully processed by AI.',
            type: 'success'
          });
        }
      }, 300);
    }
  };

  const handleSync = async (platform: string) => {
    if (!hasWearableConsent) {
      showAlert({
        title: 'Governance Required',
        message: "Clinical consent for 'wearable' data processing is missing. Update authorization in profile.",
        type: 'warning',
        confirmText: 'Go to Profile',
        onConfirm: () => navigation.navigate('PatientTabs', { screen: 'Profile' })
      });
      return;
    }

    setSyncPlatform(platform);
    setSyncing(true);
    setSyncProgress(0);

    try {
      // Simulate multiple packets
      for (let i = 0; i <= 100; i += 10) {
          setSyncProgress(i / 100);
          await new Promise(r => setTimeout(r, 100));
          
          if (i === 50) {
              // Send a mock observation
              await endpoints.observations.postWearable({
                  sub_type: 'heart_rate',
                  value: 72,
                  unit: 'bpm',
                  observed_at: new Date().toISOString(),
                  platform: Platform.OS === 'ios' ? 'ios' : 'android',
                  health_api: Platform.OS === 'ios' ? 'HealthKit' : 'HealthConnect'
              });
          }
      }

      setLastSync(new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }));
      showAlert({
        title: 'Sync Synchronized',
        message: `Biometric packets from ${platform} successfully verified and encrypted.`,
        type: 'success'
      });
    } catch (err: any) {
        showAlert({
          title: 'Connection Interrupted',
          message: err.response?.data?.message || 'The cloud bridge failed to maintain the data stream.',
          type: 'error'
        });
    } finally {
        setSyncing(false);
    }
  };

  const handleSubmitManual = async () => {
    if (!hasClinicalConsent) {
        showAlert({
          title: 'Access Denied',
          message: 'Clinical module authorization is required for manual data injection.',
          type: 'warning'
        });
        return;
    }

    if (!systolic || !diastolic) {
        showAlert({
          title: 'Incomplete Packet',
          message: 'Please provide both systolic and diastolic measurements.',
          type: 'warning'
        });
        return;
    }

    setSyncPlatform('Clinical Portal');
    setSyncing(true);
    setSyncProgress(0);
    
    try {
      setSyncProgress(0.4);
      await endpoints.observations.postDiagnostic({
        sub_type: 'blood_pressure',
        value: parseInt(systolic),
        unit: 'mmHg',
        observed_at: new Date().toISOString(),
        extra_data: { diastolic: parseInt(diastolic) }
      });
      
      setSyncProgress(0.8);
      if (cholesterol) {
        await endpoints.observations.postDiagnostic({
            sub_type: 'cholesterol',
            value: parseInt(cholesterol),
            unit: 'mg/dL',
            observed_at: new Date().toISOString()
        });
      }

      setSyncProgress(1);
      setTimeout(() => {
        setSyncing(false);
        setLastSync(new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }));
        showAlert({
          title: 'Ingestion Success',
          message: 'Manual observations have been queued for AI risk recalibration.',
          type: 'success'
        });
        setSystolic('');
        setDiastolic('');
        setCholesterol('');
        setWeight('');
      }, 500);
    } catch (err: any) {
      setSyncing(false);
      showAlert({
        title: 'Ingestion Error',
        message: err.response?.data?.message || 'Critical failure during manual vital injection.',
        type: 'error'
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <X color={theme.colors.text.primary} size={24} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Sync Data</Text>
            <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.statusSection}>
            <View style={[styles.statusBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={[styles.statusDot, { backgroundColor: lastSync ? '#22C55E' : '#F59E0B' }]} />
                <Text style={[styles.statusText, { color: theme.colors.text.secondary }]}>{lastSync ? `Last synced: ${lastSync}` : 'Cloud Connection: Pending'}</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Wearable Platforms</Text>
          <Card>
              <TouchableOpacity 
                  style={styles.syncRow}
                  onPress={() => handleSync('Apple Health')}
                  disabled={syncing || uploading}
                  activeOpacity={0.7}
              >
                  <View style={[styles.syncIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                      <Watch size={24} color="#EF4444" />
                  </View>
                  <View style={styles.syncTextContent}>
                      <Text style={[styles.syncTitle, { color: theme.colors.text.primary }]}>Apple Health</Text>
                      <Text style={[styles.syncDesc, { color: theme.colors.text.secondary }]}>Import vitals, sleep, and heart rate history</Text>
                  </View>
                  <ChevronRight size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

              <TouchableOpacity 
                  style={styles.syncRow}
                  onPress={() => handleSync('Health Connect')}
                  disabled={syncing || uploading}
                  activeOpacity={0.7}
              >
                  <View style={[styles.syncIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                      <Smartphone size={24} color="#3B82F6" />
                  </View>
                  <View style={styles.syncTextContent}>
                      <Text style={[styles.syncTitle, { color: theme.colors.text.primary }]}>Google Health Connect</Text>
                      <Text style={[styles.syncDesc, { color: theme.colors.text.secondary }]}>Sync metrics from Android ecosystem</Text>
                  </View>
                  <ChevronRight size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>
          </Card>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Medical Records</Text>
          <Card>
              <TouchableOpacity 
                  style={styles.uploadBtn}
                  onPress={handleUpload}
                  disabled={syncing || uploading}
              >
                  <View style={[styles.uploadIconBox, { backgroundColor: 'rgba(79, 157, 255, 0.1)' }]}>
                      <Scan size={24} color={theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                      <Text style={[styles.syncTitle, { color: theme.colors.text.primary }]}>Scan & Upload Record</Text>
                      <Text style={[styles.syncDesc, { color: theme.colors.text.secondary }]}>Scan reports for AI clinical analysis</Text>
                  </View>
                  <FileUp size={20} color={theme.colors.primary} />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: theme.colors.border, marginVertical: 8 }]} />

              <TouchableOpacity 
                  style={styles.uploadBtn}
                  onPress={handlePickImage}
                  disabled={syncing || uploading}
              >
                  <View style={[styles.uploadIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                      <ImageIcon size={24} color={theme.colors.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                      <Text style={[styles.syncTitle, { color: theme.colors.text.primary }]}>Upload from Gallery</Text>
                      <Text style={[styles.syncDesc, { color: theme.colors.text.secondary }]}>Select reports from your phone media</Text>
                  </View>
                  <FileUp size={20} color={theme.colors.secondary} />
              </TouchableOpacity>

              {medicalRecords.length > 0 && (
                  <View style={styles.recordsList}>
                      <View style={[styles.divider, { backgroundColor: theme.colors.border, marginBottom: 16 }]} />
                      {medicalRecords.map((record) => (
                          <View key={record.id} style={styles.recordItem}>
                              <View style={[styles.recordIconBox, { backgroundColor: theme.colors.surface }]}>
                                  <FileText size={18} color={theme.colors.text.secondary} />
                              </View>
                              <View style={{ flex: 1 }}>
                                  <Text style={[styles.recordName, { color: theme.colors.text.primary }]}>{record.name}</Text>
                                  <Text style={[styles.recordMeta, { color: theme.colors.text.muted }]}>{record.date} • {record.size}</Text>
                              </View>
                          </View>
                      ))}
                  </View>
              )}
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Manual Vital Recording</Text>
            <TouchableOpacity style={styles.infoBtn}>
                <Info size={16} color={theme.colors.text.muted} />
            </TouchableOpacity>
          </View>
          
          <Card>
              <View style={styles.formGrid}>
                  <View style={styles.inputHalf}>
                      <View style={styles.labelRow}>
                          <Activity size={14} color={theme.colors.text.secondary} />
                          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Systolic (mmHg)</Text>
                      </View>
                      <TextInput 
                          style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                          placeholder="120"
                          placeholderTextColor={theme.colors.text.muted}
                          keyboardType="numeric"
                          value={systolic}
                          onChangeText={setSystolic}
                      />
                  </View>
                  <View style={styles.inputHalf}>
                      <View style={styles.labelRow}>
                          <Activity size={14} color={theme.colors.text.secondary} />
                          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Diastolic (mmHg)</Text>
                      </View>
                      <TextInput 
                          style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                          placeholder="80"
                          placeholderTextColor={theme.colors.text.muted}
                          keyboardType="numeric"
                          value={diastolic}
                          onChangeText={setDiastolic}
                      />
                  </View>
              </View>

              <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                      <Droplets size={14} color={theme.colors.text.secondary} />
                      <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Total Cholesterol (mg/dL)</Text>
                  </View>
                  <TextInput 
                      style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                      placeholder="180"
                      placeholderTextColor={theme.colors.text.muted}
                      keyboardType="numeric"
                      value={cholesterol}
                      onChangeText={setCholesterol}
                  />
              </View>

              <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                      <Weight size={14} color={theme.colors.text.secondary} />
                      <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Weight (kg)</Text>
                  </View>
                  <TextInput 
                      style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                      placeholder="75"
                      placeholderTextColor={theme.colors.text.muted}
                      keyboardType="numeric"
                      value={weight}
                      onChangeText={setWeight}
                  />
              </View>

              <View style={styles.toggleContainer}>
                  <View style={styles.toggleRow}>
                      <View>
                        <Text style={[styles.toggleLabel, { color: theme.colors.text.primary }]}>Current Smoker</Text>
                        <Text style={[styles.toggleSub, { color: theme.colors.text.secondary }]}>Used tobacco in the last 30 days</Text>
                      </View>
                      <Switch 
                          value={isSmoking}
                          onValueChange={setIsSmoking}
                          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                          thumbColor="#FFFFFF"
                      />
                  </View>

                  <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                  <View style={styles.toggleRow}>
                      <View>
                        <Text style={[styles.toggleLabel, { color: theme.colors.text.primary }]}>Diabetes</Text>
                        <Text style={[styles.toggleSub, { color: theme.colors.text.secondary }]}>Clinically diagnosed type 1 or 2</Text>
                      </View>
                      <Switch 
                          value={isDiabetes}
                          onValueChange={setIsDiabetes}
                          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                          thumbColor="#FFFFFF"
                      />
                  </View>
              </View>

              <TouchableOpacity 
                  style={[styles.submitButton, (syncing || uploading) && { opacity: 0.7 }, { backgroundColor: theme.colors.primary }]}
                  onPress={handleSubmitManual}
                  disabled={syncing || uploading}
              >
                  <CheckCircle2 size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.submitText}>Save Vitals to Cloud</Text>
              </TouchableOpacity>
          </Card>
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {!hasWearableConsent && !hasClinicalConsent && (
          <View style={[styles.consentBanner, { backgroundColor: theme.colors.risk.high }]}>
              <ShieldAlert size={16} color="#FFFFFF" />
              <Text style={styles.consentBannerText}>Waiting for Health Data Consent. View-only access.</Text>
          </View>
      )}
      <Modal visible={syncing || uploading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.syncModal, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Animated.View style={rotateStyle}>
                    <RefreshCw size={48} color={theme.colors.primary} />
                </Animated.View>
                <Text style={[styles.syncModalTitle, { color: theme.colors.text.primary }]}>Syncing {syncPlatform}</Text>
                <Text style={[styles.syncModalSub, { color: theme.colors.text.secondary }]}>Securing clinical tunnel and importing health packets...</Text>
                
                <View style={styles.modalProgressContainer}>
                    <View style={[styles.modalProgressBar, { backgroundColor: theme.colors.background }]}>
                        <View style={[styles.modalProgressFill, { backgroundColor: theme.colors.primary, width: `${syncProgress * 100}%` }]} />
                    </View>
                    <Text style={[styles.progressText, { color: theme.colors.text.muted }]}>{Math.round(syncProgress * 100)}%</Text>
                </View>
            </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  consentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  consentBannerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
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
  content: {
    padding: 16,
  },
  statusSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginLeft: 4,
  },
  infoBtn: {
    padding: 4,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  uploadIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recordsList: {
    marginTop: 16,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  recordName: {
    fontSize: 14,
    fontWeight: '600',
  },
  recordMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  syncRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
  },
  syncIconBox: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
  },
  syncTextContent: {
    flex: 1,
  },
  syncTitle: {
      fontSize: 16,
      fontWeight: '700',
  },
  syncDesc: {
      fontSize: 12,
      marginTop: 2,
  },
  divider: {
      height: 1,
      marginVertical: 4,
      opacity: 0.5,
  },
  formGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
  },
  inputHalf: {
    width: '48%',
  },
  inputGroup: {
      marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
      fontSize: 13,
      fontWeight: '600',
      marginLeft: 6,
  },
  input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 54,
      fontSize: 16,
  },
  toggleContainer: {
    marginBottom: 32,
  },
  toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
  },
  toggleLabel: {
      fontSize: 16,
      fontWeight: '600',
  },
  toggleSub: {
    fontSize: 12,
    marginTop: 2,
  },
  submitButton: {
      height: 56,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
  },
  submitText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  syncModal: {
    width: '100%',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
  },
  syncModalTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 8,
  },
  syncModalSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  modalProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modalProgressBar: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  modalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
  }
});