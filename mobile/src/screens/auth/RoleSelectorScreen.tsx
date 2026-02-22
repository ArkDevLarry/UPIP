import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, ShieldAlert, HeartPulse } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

export const RoleSelectorScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const setRole = useAuthStore((state) => state.setRole);

  const handleSelect = (role: 'patient' | 'clinician') => {
    setRole(role);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={styles.logoRow}>
            <HeartPulse size={32} color={theme.colors.primary} />
            <Text style={[styles.appName, { color: theme.colors.text.primary }]}>UPIP</Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Choose Your Portal</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>Select your role to access the AI dashboard.</Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          <Animated.View entering={FadeInRight.delay(400)}>
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => handleSelect('patient')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: `${theme.colors.primary}1A` }]}>
                <User size={32} color={theme.colors.primary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>Patient Dashboard</Text>
                <Text style={[styles.cardDesc, { color: theme.colors.text.secondary }]}>Track heart vitals and AI risk insights</Text>
              </View>
              <View style={[styles.selectDot, { backgroundColor: theme.colors.primary }]} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(600)}>
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => handleSelect('clinician')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: `${theme.colors.secondary}1A` }]}>
                <ShieldAlert size={32} color={theme.colors.secondary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>Clinician Portal</Text>
                <Text style={[styles.cardDesc, { color: theme.colors.text.secondary }]}>Manage patients and priority alerts</Text>
              </View>
              <View style={[styles.selectDot, { backgroundColor: theme.colors.primary }]} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backBtnText, { color: theme.colors.text.muted }]}>Back to Onboarding</Text>
        </TouchableOpacity>
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
    padding: tokens.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: tokens.spacing.xxl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: tokens.colors.text.primary,
    marginLeft: tokens.spacing.sm,
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: tokens.colors.text.secondary,
    lineHeight: 24,
  },
  cardsContainer: {
    gap: tokens.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.lg,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  cardDesc: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginTop: 4,
  },
  selectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.primary,
    opacity: 0.3,
  },
  backBtn: {
    alignItems: 'center',
    marginTop: tokens.spacing.xxl,
  },
  backBtnText: {
    color: tokens.colors.text.muted,
    fontSize: 14,
    fontWeight: '600',
  },
});