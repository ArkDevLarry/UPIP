import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Lock, ChevronRight, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { endpoints } from '../../services/endpoints';

export const RegisterScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth, role } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showAlert({
        title: 'Missing Information',
        message: 'Please complete all fields to initialize your clinical profile.',
        type: 'warning'
      });
      return;
    }
    if (password !== confirmPassword) {
      showAlert({
        title: 'Security Mismatch',
        message: 'Passwords do not match. Please re-verify your secure credentials.',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await endpoints.auth.register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      const { access_token, token_type, user } = response.data;
      setAuth(access_token, token_type, user);
      
      showAlert({
        title: 'System Initialized',
        message: 'Your account has been successfully created and secured.',
        type: 'success'
      });

      // Fetch initial consents
      setTimeout(async () => {
        try {
          const consentRes = await endpoints.auth.me();
          useAuthStore.getState().setConsents(consentRes.data.active_consents);
        } catch (e) {
          console.warn('Failed to fetch initial consents', e);
        }
      }, 500);

    } catch (err: any) {
      const message = err.response?.data?.message || 'Initialization sequence failed.';
      showAlert({
        title: 'Registration Error',
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
        <TouchableOpacity 
          style={[styles.backBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Create Identity</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>Initialize your futuristic health profile</Text>
        </Animated.View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Full Name</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <User size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
                <TextInput 
                    style={[styles.input, { color: theme.colors.text.primary }]}
                    placeholder="John Doe"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor={theme.colors.text.muted}
                    editable={!loading}
                />
              </View>
          </View>

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
                    keyboardType="email-address"
                    placeholderTextColor={theme.colors.text.muted}
                    editable={!loading}
                    autoCorrect={false}
                />
              </View>
          </View>

          <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Secure Password</Text>
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

          <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Confirm Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Lock size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
                <TextInput 
                    style={[styles.input, { color: theme.colors.text.primary }]}
                    placeholder="••••••••"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholderTextColor={theme.colors.text.muted}
                    editable={!loading}
                />
              </View>
          </View>

          <Text style={[styles.termsText, { color: theme.colors.text.muted }]}>
              By continuing, you agree to our <Text style={[styles.termsLink, { color: theme.colors.primary }]}>Protocols</Text> and <Text style={[styles.termsLink, { color: theme.colors.primary }]}>Privacy Encryption</Text>.
          </Text>

          <TouchableOpacity 
            style={[styles.button, (!name || !email || !password || !confirmPassword || loading) && styles.buttonDisabled, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
            onPress={handleRegister}
            disabled={!name || !email || !password || !confirmPassword || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.text.inverse} />
            ) : (
              <>
                <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>Initialize Account</Text>
                <ChevronRight size={20} color={theme.colors.text.inverse} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>Existing user? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
            <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Secure Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: tokens.spacing.xl,
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
    marginBottom: 8,
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
  termsText: {
    fontSize: 12,
    color: tokens.colors.text.muted,
    lineHeight: 18,
    marginBottom: tokens.spacing.xl,
    textAlign: 'center',
  },
  termsLink: {
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: tokens.colors.primary,
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
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