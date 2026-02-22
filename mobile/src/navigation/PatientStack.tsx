import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PatientTabs } from './PatientTabs';
import { RiskDetailsScreen } from '../screens/patient/RiskDetailsScreen';
import { DataSyncScreen } from '../screens/patient/DataSyncScreen';
import { AIScanScreen } from '../screens/patient/AIScanScreen';
import { EmergencyScreen } from '../screens/patient/EmergencyScreen';
import { ReportDetailScreen } from '../screens/patient/ReportDetailScreen';

const Stack = createNativeStackNavigator();

export const PatientStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientTabs" component={PatientTabs} />
    <Stack.Screen name="RiskDetails" component={RiskDetailsScreen} />
    <Stack.Screen name="DataSync" component={DataSyncScreen} />
    <Stack.Screen name="AIScan" component={AIScanScreen} />
    <Stack.Screen name="Emergency" component={EmergencyScreen} />
    <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
  </Stack.Navigator>
);
