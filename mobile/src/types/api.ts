export interface RiskResponse {
  score: number;
  level: 'low' | 'moderate' | 'high';
  updatedAt: string;
  topFactors: { title: string; detail: string }[];
  breakdown?: { factor: string; weight: number; explanation: string }[];
  is_diagnostic: false;
  message: string;
}

export interface TrendsResponse {
  heartRate7d: { date: string; value: number }[];
  activity7d: { date: string; value: number }[];
}

export interface RecommendationsResponse {
  items: { priority: 'high' | 'medium' | 'low'; title: string; reason: string; action: string }[];
}

export interface PatientsResponse {
  patients: { id: string; name: string; score: number; riskLevel: 'low' | 'moderate' | 'high'; updatedAt: string }[];
  alerts: { id: string; patientId: string; message: string; severity: 'high' | 'medium'; time: string }[];
}

export interface VitalsPayload {
  source: 'manual' | 'wearable';
  timestamp: string;
  bpSystolic?: number;
  bpDiastolic?: number;
  cholesterol?: number;
  weight?: number;
  diabetes?: boolean;
  smoking?: boolean;
}

export type AuthRole = 'patient' | 'clinician' | 'admin';

export interface User {
  id: string;
  email: string;
  role: AuthRole;
  name: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  region?: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface AuthRegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  region?: string;
}

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export type ConsentModule = 'wearable' | 'clinical' | 'behavioral' | 'speech' | 'genetic';

export interface ConsentRecord {
  id: string;
  module: ConsentModule;
  granted: boolean;
  granted_at: string;
}

export interface ObservationPayload {
  sub_type: string;
  value?: number;
  unit?: string;
  observed_at: string;
  platform?: 'ios' | 'android';
  health_api?: 'HealthKit' | 'HealthConnect' | 'GoogleFit';
  device_id?: string;
  [key: string]: any; // For behavioral, speech, etc.
}

export interface UPRSResponse {
  data: {
    uprs_score: number;
    uprs_tier: 'low' | 'moderate' | 'elevated';
    cardiovascular_score: number;
    metabolic_score: number;
    mental_score: number;
    genetic_modifier: number;
    confidence_score: number;
    computed_at: string;
    model_version: string;
    explanation_vector: {
      cardiovascular: Record<string, number>;
      metabolic: Record<string, number>;
      mental: Record<string, number>;
      anomaly: { probability: number; confidence_score: number };
    };
  };
  is_diagnostic: false;
  message: string;
}

export interface DevicePayload {
  platform: 'ios' | 'android';
  device_id: string;
  device_name?: string;
  os_version?: string;
  app_version?: string;
  health_api?: 'HealthKit' | 'HealthConnect' | 'GoogleFit';
  push_token?: string;
}

export interface DeviceRecord extends DevicePayload {
  id: string;
  is_active: boolean;
  last_seen_at: string;
}

export interface ClinicianQueueItem {
  id: string;
  patient_id: string;
  patient_name: string;
  uprs_score: number;
  uprs_tier: string;
  priority: 'normal' | 'high' | 'urgent';
  created_at: string;
}

export interface ReviewPayload {
  decision: 'dismissed' | 'referred' | 'escalated';
  notes: string;
  recommendation?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
}

export interface AdminWeightsPayload {
  cardiovascular_weight: number;
  metabolic_weight: number;
  mental_weight: number;
}

export interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  details?: any;
  ip_address?: string;
  created_at: string;
}