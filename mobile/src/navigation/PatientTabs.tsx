import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, BrainCircuit, FileText, User } from 'lucide-react-native';
import { PatientDashboardScreen } from '../screens/patient/PatientDashboardScreen';
import { PredictiveAnalyticsScreen } from '../screens/patient/PredictiveAnalyticsScreen';
import { AlertSystemScreen } from '../screens/patient/AlertSystemScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();

export const PatientTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarStyle: { 
          backgroundColor: theme.colors.background,
          borderTopWidth: 1, 
          borderTopColor: theme.colors.border,
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={PatientDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Insights"
        component={PredictiveAnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <BrainCircuit color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={AlertSystemScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};