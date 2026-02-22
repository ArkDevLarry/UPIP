import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LogOut, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const LogoutModal = ({ visible, onClose, onLogout }: LogoutModalProps) => {
  const { theme } = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          entering={FadeIn}
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} 
        />
        
        <Animated.View 
          entering={FadeInDown.duration(300).springify().damping(20).stiffness(100)}
          style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <View style={styles.header}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <LogOut size={24} color="#EF4444" />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.colors.text.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Confirm Logout</Text>
            <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
              Are you sure you want to end your secure session? You will need to re-authorize to access your health data.
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              onPress={onClose}
              style={[styles.button, styles.cancelBtn, { borderColor: theme.colors.border }]}
            >
              <Text style={[styles.cancelText, { color: theme.colors.text.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onLogout}
              style={[styles.button, styles.logoutBtn]}
            >
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
