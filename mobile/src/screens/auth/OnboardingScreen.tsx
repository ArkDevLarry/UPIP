import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartPulse, ChevronRight, ShieldCheck, Zap, Activity } from 'lucide-react-native';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';

const { width, height } = Dimensions.get('window');

export const OnboardingScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const pulse = useSharedValue(1);
  const ring1 = useSharedValue(1);
  const ring2 = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(1, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );

    ring1.value = withRepeat(
      withTiming(1.5, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );

    ring2.value = withDelay(
      1000,
      withRepeat(
        withTiming(1.5, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );

    opacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1.value }],
    opacity: interpolate(ring1.value, [1, 1.5], [0.5, 0]),
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2.value }],
    opacity: interpolate(ring2.value, [1, 1.5], [0.5, 0]),
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.ring, ring1Style, { borderColor: theme.colors.primary }]} />
          <Animated.View style={[styles.ring, ring2Style, { borderColor: theme.colors.primary }]} />
          
          <Animated.View 
            entering={FadeInUp.delay(200).duration(1000)}
            style={[styles.iconBox, logoStyle, { backgroundColor: `${theme.colors.primary}1A`, borderColor: `${theme.colors.primary}4D` }]}
          >
            <HeartPulse size={64} color={theme.colors.primary} />
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(400).duration(800)}>
            <Text style={[styles.appName, { color: theme.colors.text.primary }]}>UPIP</Text>
            <Text style={[styles.tagline, { color: theme.colors.primary }]}>AI Predictive Health</Text>
          </Animated.View>
        </View>

        <Animated.View 
          entering={FadeInDown.delay(600).duration(800)}
          style={styles.textSection}
        >
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Precision Healthcare{'\n'}For The Future</Text>
          
          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <ShieldCheck size={20} color={theme.colors.primary} />
              <Text style={[styles.featureText, { color: theme.colors.text.secondary }]}>Verified Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Zap size={20} color={theme.colors.primary} />
              <Text style={[styles.featureText, { color: theme.colors.text.secondary }]}>Real-time Sync</Text>
            </View>
            <View style={styles.featureItem}>
              <Activity size={20} color={theme.colors.primary} />
              <Text style={[styles.featureText, { color: theme.colors.text.secondary }]}>Predictive Care</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(800).duration(800)}
          style={styles.buttonSection}
        >
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('RoleSelector')}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>Initialize System</Text>
            <ChevronRight size={20} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        </Animated.View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: tokens.colors.primary,
  },
  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(79, 157, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(79, 157, 255, 0.3)',
    zIndex: 10,
  },
  appName: {
    fontSize: 56,
    fontWeight: '900',
    color: tokens.colors.text.primary,
    letterSpacing: 6,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    color: tokens.colors.primary,
    fontWeight: '700',
    marginTop: -4,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  textSection: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: tokens.colors.text.primary,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
    lineHeight: 40,
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: tokens.spacing.md,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 10,
    color: tokens.colors.text.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonSection: {
    width: '100%',
  },
  button: {
    backgroundColor: tokens.colors.primary,
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonText: {
    color: tokens.colors.text.inverse,
    fontSize: 18,
    fontWeight: '800',
    marginRight: tokens.spacing.sm,
    letterSpacing: 1,
  },
});
