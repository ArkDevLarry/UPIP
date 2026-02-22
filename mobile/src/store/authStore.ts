import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthRole, User } from '../types/api';

interface AuthState {
  token: string | null;
  tokenType: string | null;
  user: User | null;
  role: AuthRole | null;
  consents: string[];
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    language: string;
    biometrics: boolean;
  };
  setAuth: (token: string, tokenType: string, user: User) => void;
  setRole: (role: AuthRole) => void;
  setConsents: (consents: string[]) => void;
  updatePreferences: (prefs: Partial<AuthState['preferences']>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      tokenType: null,
      user: null,
      role: null,
      consents: [],
      preferences: {
        darkMode: true, // Default to dark as per futuristic medical AI theme
        notifications: true,
        language: 'en',
        biometrics: false,
      },
      setAuth: (token, tokenType, user) => set({ token, tokenType, user, role: user.role }),
      setRole: (role) => set({ role }),
      setConsents: (consents) => set({ consents }),
      updatePreferences: (prefs) => 
        set((state) => ({ preferences: { ...state.preferences, ...prefs } })),
      logout: () => set({ token: null, tokenType: null, user: null, role: null, consents: [] }),
    }),
    {
      name: 'upip-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);