import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, ChevronRight, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { endpoints } from '../../services/endpoints';

export const LoginScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth, role } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert({
        title: 'Input Required',
        message: 'Please enter your email and password to access the portal.',
        type: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await endpoints.auth.login({ email, password });
      const { access_token, token_type, user } = response.data;
      
      // First set the auth state to ensure tokens are available for subsequent requests
      setAuth(access_token, token_type, user);
      
      // Delay a bit to ensure Zustand has updated and interceptors can pick up the token
      setTimeout(async () => {
        try {
          const consentRes = await endpoints.auth.me();
          useAuthStore.getState().setConsents(consentRes.data.active_consents);
        } catch (e) {
          console.warn('Failed to fetch consents', e);
        }
      }, 500);

    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid credentials. Please verify your identity.';
      showAlert({
        title: 'Login Failed',
        message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <TouchableOpacity 
            style={[styles.backBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <ArrowLeft size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>

          <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>Enter credentials for {role || 'patient'} portal</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={styles.form}>
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Email Address</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Mail size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
                  <TextInput 
                      style={[styles.input, { color: theme.colors.text.primary }]}
                      placeholder="email@upip.health"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      placeholderTextColor={theme.colors.text.muted}
                      keyboardType="email-address"
                      editable={!loading}
                      autoCorrect={false}
                  />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Password</Text>
                  <TouchableOpacity disabled={loading}>
                    <Text style={[styles.forgotText, { color: theme.colors.primary }]}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Lock size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
                  <TextInput 
                      style={[styles.input, { color: theme.colors.text.primary }]}
                      placeholder="••••••••"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      placeholderTextColor={theme.colors.text.muted}
                      editable={!loading}
                  />
                </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && { opacity: 0.7 }, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.text.inverse} />
              ) : (
                <>
                  <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>Authorize Access</Text>
                  <ChevronRight size={20} color={theme.colors.text.inverse} />
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>New to UPIP? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
              <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Register Account</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: tokens.spacing.xl,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: tokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  header: {
    marginBottom: tokens.spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: tokens.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: tokens.colors.text.secondary,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: tokens.spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 12,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 16,
    paddingHorizontal: tokens.spacing.md,
  },
  inputIcon: {
    marginRight: tokens.spacing.sm,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: tokens.colors.text.primary,
  },
  button: {
    backgroundColor: tokens.colors.primary,
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.lg,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: tokens.colors.text.inverse,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lg,
  },
  footerText: {
    color: tokens.colors.text.secondary,
    fontSize: 14,
  },
  footerLink: {
    color: tokens.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  }
});