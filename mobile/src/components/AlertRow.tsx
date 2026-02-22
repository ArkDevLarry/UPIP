import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Alert } from '../types/api';

interface AlertRowProps {
  alert: Alert;
}

export const AlertRow: React.FC<AlertRowProps> = ({ alert }) => {
  const isHigh = alert.severity === 'high';
  
  return (
    <View className={`flex-row items-center rounded-xl p-3 mb-2 border ${isHigh ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
      <AlertTriangle size={20} color={isHigh ? '#ef4444' : '#f59e0b'} />
      <View className="ml-3 flex-1">
        <Text className={`font-semibold text-sm ${isHigh ? 'text-red-800' : 'text-amber-800'}`}>
          {alert.message}
        </Text>
        <Text className={`text-xs ${isHigh ? 'text-red-600' : 'text-amber-600'}`}>
          {alert.time}
        </Text>
      </View>
    </View>
  );
};
