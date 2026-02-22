import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Users, User } from 'lucide-react-native';
import { ClinicianDashboardScreen } from '../screens/clinician/ClinicianDashboardScreen';
import { PatientDetailScreen } from '../screens/clinician/PatientDetailScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ClinicianDashboardStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ClinicianDashboardMain" component={ClinicianDashboardScreen} />
        <Stack.Screen name="PatientDetail" component={PatientDetailScreen} />
    </Stack.Navigator>
);

export const ClinicianTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: { 
          backgroundColor: theme.colors.background,
          borderTopWidth: 1, 
          borderTopColor: theme.colors.border 
        },
      }}
    >
      <Tab.Screen
        name="PatientsTab"
        component={ClinicianDashboardStack}
        options={{
          tabBarLabel: 'Patients',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
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