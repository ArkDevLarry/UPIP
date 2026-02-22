import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { RiskBadge } from './RiskBadge';
import { Patient } from '../types/api';

interface PatientRowProps {
  patient: Patient;
  onPress: () => void;
}

export const PatientRow: React.FC<PatientRowProps> = ({ patient, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center bg-white border border-slate-100 rounded-xl p-4 mb-3 shadow-sm active:opacity-70"
    >
      <View className="flex-1">
        <Text className="font-semibold text-slate-800 text-base">{patient.name}</Text>
        <Text className="text-slate-500 text-xs mt-1">Last updated: {new Date(patient.updatedAt).toLocaleDateString()}</Text>
      </View>
      <View className="flex-row items-center">
        <View className="items-end mr-3">
          <Text className="text-xl font-bold text-slate-800">{patient.score}%</Text>
          <RiskBadge level={patient.riskLevel} />
        </View>
        <ChevronRight size={20} color="#94a3b8" />
      </View>
    </TouchableOpacity>
  );
};
