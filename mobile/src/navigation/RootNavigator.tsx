import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { AuthStack } from './AuthStack';
import { PatientStack } from './PatientStack';
import { ClinicianTabs } from './ClinicianTabs';
import { AdminTabs } from './AdminTabs';

export const RootNavigator = () => {
  const { token, role } = useAuthStore();

  return (
    <NavigationContainer>
      {!token ? (
        <AuthStack />
      ) : role === 'patient' ? (
        <PatientStack />
      ) : role === 'clinician' ? (
        <ClinicianTabs />
      ) : (
        <AdminTabs />
      )}
    </NavigationContainer>
  );
};