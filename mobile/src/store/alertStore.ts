import { create } from 'zustand';

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showAlert: (config: {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
  }) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: '',
  message: '',
  type: 'info',
  onConfirm: undefined,
  confirmText: 'OK',
  cancelText: undefined,
  showAlert: (config) => set({
    visible: true,
    title: config.title,
    message: config.message,
    type: config.type || 'info',
    onConfirm: config.onConfirm,
    confirmText: config.confirmText || 'OK',
    cancelText: config.cancelText,
  }),
  hideAlert: () => set({ visible: false }),
}));
