import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { useAlertStore } from '../store/alertStore';

const { width } = Dimensions.get('window');

export const CustomAlert = () => {
  const { theme, isDark } = useTheme();
  const { visible, title, message, type, onConfirm, confirmText, cancelText, hideAlert } = useAlertStore();

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={32} color={theme.colors.success} />;
      case 'warning': return <AlertTriangle size={32} color={theme.colors.risk.moderate} />;
      case 'error': return <AlertCircle size={32} color={theme.colors.risk.high} />;
      default: return <Info size={32} color={theme.colors.primary} />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    hideAlert();
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View 
          entering={FadeIn.duration(200)} 
          exiting={FadeOut.duration(200)}
          style={[styles.backdrop, { backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)' }]}
        >
            <TouchableOpacity style={{ flex: 1 }} onPress={hideAlert} />
        </Animated.View>

        <Animated.View 
          entering={ZoomIn.duration(300).springify().damping(20).stiffness(100)} 
          exiting={ZoomOut.duration(200)}
          style={[styles.alertBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.background}` }]}>
              {getIcon()}
            </View>
            
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>
            <Text style={[styles.message, { color: theme.colors.text.secondary }]}>{message}</Text>
            
            <View style={styles.actions}>
              {cancelText && (
                <TouchableOpacity 
                  style={[styles.button, styles.cancelBtn, { borderColor: theme.colors.border }]} 
                  onPress={hideAlert}
                >
                  <Text style={[styles.cancelBtnText, { color: theme.colors.text.muted }]}>{cancelText}</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.button, styles.confirmBtn, { backgroundColor: theme.colors.primary }]} 
                onPress={handleConfirm}
              >
                <Text style={styles.confirmBtnText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.closeBtn} onPress={hideAlert}>
            <X size={20} color={theme.colors.text.muted} />
          </TouchableOpacity>
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  alertBox: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtn: {
    // shadowColor: tokens.colors.primary,
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
    // elevation: 4,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelBtn: {
    borderWidth: 1,
  },
  cancelBtnText: {
    fontWeight: '600',
    fontSize: 15,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
});
