import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal, TextInput, ActivityIndicator, Platform } from 'react-native';
import { LogOut, User, Bell, Shield, Moon, ChevronRight, CircleUser, Globe, Mail, Check, Fingerprint, Activity, Smartphone, Heart, BrainCircuit, UserPlus, ShieldAlert, X, Save } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { Card } from '../../components/Card';
import { useTheme } from '../../theme/ThemeContext';
import { LogoutModal } from '../../components/LogoutModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import { endpoints } from '../../services/endpoints';
import { ConsentModule, DeviceRecord } from '../../types/api';

export const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { user, logout, preferences, updatePreferences, consents, setConsents, role } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);
  const { theme, isDark } = useTheme();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingName, setEditingName] = useState(user?.name || '');
  const [editingEmail, setEditingEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [devices, setDevices] = useState<DeviceRecord[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
        try {
            const res = await endpoints.devices.list();
            setDevices(res.data);
        } catch (e) {}
    };
    fetchDevices();
  }, []);

  const toggleConsent = async (module: ConsentModule) => {
    const isGranted = consents.includes(module);
    try {
        if (isGranted) {
            await endpoints.consent.revoke(module);
            setConsents(consents.filter(c => c !== module));
        } else {
            await endpoints.consent.grant([module]);
            setConsents([...consents, module]);
        }
    } catch (e) {
        showAlert({
          title: 'Governance Error',
          message: 'Failed to update consent audit trail. System integrity check required.',
          type: 'error'
        });
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Yoruba' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Espanol' },
  ];

  const toggleDarkMode = () => {
    updatePreferences({ darkMode: !preferences.darkMode });
  };

  const toggleNotifications = async () => {
    // In a real app, you'd request permissions here
    updatePreferences({ notifications: !preferences.notifications });
  };

  const toggleBiometrics = async () => {
    if (Platform.OS === 'web') {
      showAlert({
        title: 'Not Supported',
        message: 'Biometric authentication is not available on web. Please use a supported mobile device.',
        type: 'warning'
      });
      return;
    }

    if (!preferences.biometrics) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        showAlert({
          title: 'Security Error',
          message: 'Biometric authentication is not available or not configured on this device node.',
          type: 'warning'
        });
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authorize UPIP Security',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        updatePreferences({ biometrics: true });
      }
    } else {
      updatePreferences({ biometrics: false });
    }
  };

  const handleLogout = () => {
    setLogoutVisible(true);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await endpoints.user.updateProfile({ name: editingName, email: editingEmail });
      // Update local store as well
      useAuthStore.getState().setAuth(
        useAuthStore.getState().token!,
        useAuthStore.getState().tokenType!,
        { ...user!, name: editingName, email: editingEmail }
      );
      setEditModalVisible(false);
      showAlert({
        title: 'Profile Updated',
        message: 'Your futuristic health identity has been successfully synchronized.',
        type: 'success'
      });
    } catch (e) {
      showAlert({
        title: 'Update Failed',
        message: 'Could not synchronize profile changes with clinical nodes.',
        type: 'error'
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const SettingItem = ({ icon: Icon, label, value, type = 'chevron', onPress, color = theme.colors.text.primary }: any) => (
    <TouchableOpacity 
        style={styles.settingRow} 
        onPress={onPress}
        disabled={type === 'switch'}
        activeOpacity={0.7}
    >
        <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.background }]}>
                <Icon size={20} color={color} />
            </View>
            <Text style={[styles.settingLabel, { color }]}>{label}</Text>
        </View>
        {type === 'chevron' && (
          <View style={styles.chevronContainer}>
            {label === 'Language' && (
              <Text style={[styles.langText, { color: theme.colors.text.muted }]}>
                {languages.find(l => l.code === preferences.language)?.name}
              </Text>
            )}
            <ChevronRight size={20} color={theme.colors.text.muted} />
          </View>
        )}
        {type === 'switch' && (
            <Switch 
                value={value} 
                onValueChange={onPress}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
            />
        )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Settings</Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            {role === 'patient' && (
                <TouchableOpacity 
                    style={[styles.sosBtn, { backgroundColor: `${theme.colors.risk.high}1A`, borderColor: theme.colors.risk.high }]}
                    onPress={() => navigation.navigate('Emergency')}
                >
                    <ShieldAlert size={20} color={theme.colors.risk.high} />
                </TouchableOpacity>
            )}
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                <View style={[styles.onlineBadge, { borderColor: theme.colors.surface }]} />
            </View>
            <View style={styles.profileInfo}>
                <Text style={[styles.userName, { color: theme.colors.text.primary }]}>{user?.name || 'User'}</Text>
                <Text style={[styles.userEmail, { color: theme.colors.text.secondary }]}>{user?.email || 'user@upip.health'}</Text>
                <View style={styles.profileActions}>
                    <TouchableOpacity 
                        style={[styles.editProfileBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                        onPress={() => setEditModalVisible(true)}
                    >
                        <Text style={[styles.editProfileText, { color: theme.colors.text.primary }]}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {role === 'patient' && (
            <>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Data Governance (Consents)</Text>
                <Card>
                    <SettingItem 
                        icon={Smartphone} 
                        label="Wearable Data" 
                        type="switch" 
                        value={consents.includes('wearable')} 
                        onPress={() => toggleConsent('wearable')} 
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                    <SettingItem 
                        icon={Heart} 
                        label="Clinical Records" 
                        type="switch" 
                        value={consents.includes('clinical')} 
                        onPress={() => toggleConsent('clinical')} 
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                    <SettingItem 
                        icon={Activity} 
                        label="Behavioral Analysis" 
                        type="switch" 
                        value={consents.includes('behavioral')} 
                        onPress={() => toggleConsent('behavioral')} 
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                    <SettingItem 
                        icon={BrainCircuit} 
                        label="Speech Features" 
                        type="switch" 
                        value={consents.includes('speech')} 
                        onPress={() => toggleConsent('speech')} 
                    />
                </Card>
            </>
        )}

        <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Preferences</Text>
        <Card>
            <SettingItem 
                icon={Bell} 
                label="Push Notifications" 
                type="switch" 
                value={preferences.notifications} 
                onPress={toggleNotifications} 
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <SettingItem 
                icon={Moon} 
                label="Dark Mode" 
                type="switch" 
                value={preferences.darkMode} 
                onPress={toggleDarkMode} 
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <SettingItem 
                icon={Globe} 
                label="Language" 
                onPress={() => setLangModalVisible(true)} 
            />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Security</Text>
        <Card>
            <SettingItem 
                icon={Shield} 
                label="Face ID / Biometrics" 
                type="switch" 
                value={preferences.biometrics} 
                onPress={toggleBiometrics} 
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <SettingItem 
                icon={CircleUser} 
                label="Two-Factor Auth" 
                onPress={() => {}} 
            />
        </Card>

        {devices.length > 0 && (
            <>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Authenticated Devices</Text>
                <Card>
                    {devices.map((device, idx) => (
                        <View key={device.id}>
                            <View style={styles.deviceRow}>
                                <View style={styles.deviceInfo}>
                                    <Text style={[styles.deviceName, { color: theme.colors.text.primary }]}>{device.device_name || 'UPIP Node'}</Text>
                                    <Text style={[styles.deviceMeta, { color: theme.colors.text.secondary }]}>{device.platform.toUpperCase()} • {device.app_version || 'v1.0'}</Text>
                                </View>
                                <View style={[styles.activeStatus, { backgroundColor: device.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)' }]}>
                                    <Text style={[styles.activeText, { color: device.is_active ? '#22C55E' : '#6B7280' }]}>{device.is_active ? 'Active' : 'Offline'}</Text>
                                </View>
                            </View>
                            {idx < devices.length - 1 && <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />}
                        </View>
                    ))}
                </Card>
            </>
        )}

        <Text style={[styles.sectionTitle, { color: theme.colors.text.muted }]}>Support</Text>
        <Card>
            <SettingItem 
                icon={Mail} 
                label="Contact Support" 
                onPress={() => {}} 
            />
        </Card>

        <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
        >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
            <Text style={[styles.version, { color: theme.colors.text.muted }]}>UPIP Version 1.0.0 (Build 42)</Text>
            <Text style={[styles.copyright, { color: theme.colors.text.muted }]}>© 2026 UPIP Healthcare AI. All rights reserved.</Text>
        </View>
      </ScrollView>

      <LogoutModal 
        visible={logoutVisible}
        onClose={() => setLogoutVisible(false)}
        onLogout={() => {
          setLogoutVisible(false);
          logout();
        }}
      />

      <Modal
        visible={langModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBlur} 
            onPress={() => setLangModalVisible(false)} 
          />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>Select Language</Text>
            </View>
            {languages.map((l) => (
              <TouchableOpacity 
                key={l.code}
                style={styles.langItem}
                onPress={() => {
                  updatePreferences({ language: l.code });
                  setLangModalVisible(false);
                }}
              >
                <Text style={[
                  styles.langName, 
                  { color: preferences.language === l.code ? theme.colors.primary : theme.colors.text.primary }
                ]}>
                  {l.name}
                </Text>
                {preferences.language === l.code && <Check size={20} color={theme.colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBlur} 
            onPress={() => setEditModalVisible(false)} 
          />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>Edit Profile</Text>
              <TouchableOpacity 
                onPress={() => setEditModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <X size={24} color={theme.colors.text.muted} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text.secondary }]}>Full Name</Text>
              <TextInput 
                style={[styles.textInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                value={editingName}
                onChangeText={setEditingName}
                placeholder="Enter your name"
                placeholderTextColor={theme.colors.text.muted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text.secondary }]}>Email Address</Text>
              <TextInput 
                style={[styles.textInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                value={editingEmail}
                onChangeText={setEditingEmail}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.text.muted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
              onPress={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Save size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
  },
  avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: '#4F9DFF',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
  },
  avatarText: {
      fontSize: 28,
      fontWeight: '800',
      color: '#FFFFFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    borderWidth: 3,
  },
  profileInfo: {
      marginLeft: 20,
      flex: 1,
  },
  userName: {
      fontSize: 20,
      fontWeight: '800',
  },
  userEmail: {
      fontSize: 13,
      marginBottom: 10,
  },
  profileActions: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  editProfileBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sosBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    zIndex: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingLabel: {
      fontSize: 16,
      fontWeight: '500',
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langText: {
    fontSize: 14,
    marginRight: 8,
  },
  divider: {
      height: 1,
      opacity: 0.5,
  },
  logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
      paddingVertical: 16,
      borderRadius: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutText: {
      color: '#EF4444',
      fontWeight: '700',
      marginLeft: 8,
  },
  footer: {
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 48,
  },
  version: {
      fontSize: 12,
      fontWeight: '600',
  },
  copyright: {
      fontSize: 10,
      marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBlur: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 48,
    borderTopWidth: 1,
  },
  modalHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(156, 163, 175, 0.1)',
  },
  langName: {
    fontSize: 16,
    fontWeight: '600',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '700',
  },
  deviceMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  activeStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  saveBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});