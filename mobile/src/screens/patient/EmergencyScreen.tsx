import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldAlert, Phone, MapPin, ChevronLeft, AlertTriangle, Activity, User, Plus, X } from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  interpolate,
  withDelay
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { useAlertStore } from '../../store/alertStore';

const { width, height } = Dimensions.get('window');

export const EmergencyScreen = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const showAlert = useAlertStore((state) => state.showAlert);
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  const pulseScale = useSharedValue(1);
  const ring1Scale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0.4);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(1, { duration: 800, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );

    ring1Scale.value = withRepeat(
      withTiming(1.8, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );

    ring1Opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        withTiming(0.4, { duration: 0 })
      ),
      -1,
      false
    );
  }, []);

  const handleSOS = () => {
    setSosActive(true);
    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        setSosActive(false);
        setCountdown(5);
        showAlert({
          title: 'SOS Transmitted',
          message: 'Your current vitals (HR: 72, SpO2: 98%) and location have been broadcast to your clinician and emergency contacts.',
          type: 'error'
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const cancelSOS = () => {
    setSosActive(false);
    setCountdown(5);
  };

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));

  const sosBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const [contacts] = useState([
    { name: 'Dr. Sarah Wilson', role: 'Primary Clinician', phone: '+1 234 567 8901' },
    { name: 'Michael Chen', role: 'Emergency Contact', phone: '+1 987 654 3210' },
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Emergency SOS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sosContainer}>
          {!sosActive ? (
            <>
              <View style={styles.ringContainer}>
                <Animated.View style={[styles.ring, ringStyle, { borderColor: theme.colors.risk.high }]} />
                <Animated.View 
                  style={[
                    styles.ring, 
                    { 
                      borderColor: theme.colors.risk.high, 
                      transform: [{ scale: 1.4 }], 
                      opacity: 0.2 
                    }
                  ]} 
                />
                
                <TouchableOpacity 
                  onPress={handleSOS} 
                  activeOpacity={0.8}
                >
                  <Animated.View style={[styles.sosButton, sosBtnStyle, { backgroundColor: theme.colors.risk.high, shadowColor: theme.colors.risk.high }]}>
                    <ShieldAlert size={64} color="#FFFFFF" />
                    <Text style={styles.sosText}>SOS</Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
              <Text style={[styles.instruction, { color: theme.colors.text.secondary }]}>
                Tap to alert emergency services and your care team
              </Text>
            </>
          ) : (
            <View style={styles.countdownContainer}>
              <Text style={[styles.countdownLabel, { color: theme.colors.text.primary }]}>TRANSMITTING IN</Text>
              <Text style={[styles.countdownValue, { color: theme.colors.risk.high }]}>{countdown}</Text>
              <TouchableOpacity 
                style={[styles.cancelBtn, { borderColor: theme.colors.border }]} 
                onPress={cancelSOS}
              >
                <X size={20} color={theme.colors.text.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.cancelText, { color: theme.colors.text.primary }]}>Cancel Broadcast</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Emergency Contacts</Text>
            <TouchableOpacity>
              <Plus size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {contacts.map((contact, index) => (
            <Animated.View 
              key={index} 
              entering={FadeInDown.delay(100 * index)}
              style={[styles.contactCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <View style={[styles.contactIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <User size={20} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: theme.colors.text.primary }]}>{contact.name}</Text>
                <Text style={[styles.contactRole, { color: theme.colors.text.muted }]}>{contact.role}</Text>
              </View>
              <TouchableOpacity style={[styles.callBtn, { backgroundColor: `${theme.colors.success}1A` }]}>
                <Phone size={18} color={theme.colors.success} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Active Health Monitors</Text>
          <View style={[styles.monitorCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.monitorItem}>
              <Activity size={18} color={theme.colors.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.monitorLabel, { color: theme.colors.text.secondary }]}>Current Heart Rate</Text>
                <Text style={[styles.monitorValue, { color: theme.colors.text.primary }]}>72 bpm</Text>
              </View>
              <View style={[styles.statusTag, { backgroundColor: 'rgba(20, 184, 166, 0.1)' }]}>
                <Text style={[styles.statusText, { color: theme.colors.success }]}>STABLE</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.monitorItem}>
              <MapPin size={18} color={theme.colors.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.monitorLabel, { color: theme.colors.text.secondary }]}>GPS Coordinates</Text>
                <Text style={[styles.monitorValue, { color: theme.colors.text.primary }]}>6.5244° N, 3.3792° E</Text>
              </View>
              <View style={[styles.statusTag, { backgroundColor: 'rgba(79, 157, 255, 0.1)' }]}>
                <Text style={[styles.statusText, { color: theme.colors.primary }]}>LOCKED</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.safetyNotice}>
          <AlertTriangle size={16} color={theme.colors.risk.moderate} />
          <Text style={[styles.noticeText, { color: theme.colors.text.secondary }]}>
            UPIP SOS is for health emergencies only. Abuse of the system may lead to clinical service suspension.
          </Text>
        </View>
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
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    padding: 20,
  },
  sosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    marginBottom: 20,
  },
  ringContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 2,
  },
  instruction: {
    marginTop: 32,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
  },
  countdownLabel: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  countdownValue: {
    fontSize: 100,
    fontWeight: '900',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 24,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
  },
  contactRole: {
    fontSize: 12,
    marginTop: 2,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monitorCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  monitorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  monitorLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  monitorValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  }
});
