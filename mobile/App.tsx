import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme/ThemeContext';
import { CustomAlert } from './src/components/CustomAlert';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
        <CustomAlert />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}