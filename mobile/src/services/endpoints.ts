import api from './api';
import { 
  AuthTokenResponse,
  AuthRegisterPayload,
  AuthLoginPayload,
  ConsentRecord,
  ConsentModule,
  ObservationPayload,
  UPRSResponse,
  RiskResponse,
  TrendsResponse,
  RecommendationsResponse,
  PatientsResponse,
  VitalsPayload,
  DevicePayload,
  DeviceRecord,
  ClinicianQueueItem,
  ReviewPayload,
  AdminWeightsPayload,
  AuditLogEntry,
  User
} from '../types/api';

export const endpoints = {
  auth: {
    register: (data: AuthRegisterPayload) => api.post<AuthTokenResponse>('/auth/register', data),
    login: (data: AuthLoginPayload) => api.post<AuthTokenResponse>('/auth/login', data),
    refresh: () => api.post<AuthTokenResponse>('/auth/refresh'),
    logout: () => api.post<{ message: string }>('/auth/logout'),
    me: () => api.get<{ user: User; active_consents: string[] }>('/auth/me'),
  },
  consent: {
    list: () => api.get<{ data: ConsentRecord[]; available_modules: string[] }>('/consent'),
    grant: (modules: ConsentModule[]) => api.post<ConsentRecord[]>('/consent', { modules }),
    revoke: (module: ConsentModule) => api.delete(`/consent/${module}`),
  },
  observations: {
    postWearable: (data: ObservationPayload) => api.post('/observations/wearable', data),
    postBehavioral: (data: any) => api.post('/observations/behavioral', data),
    postSpeech: (data: any) => api.post('/observations/speech', data),
    postDiagnostic: (data: any) => api.post('/observations/diagnostic', data),
    list: (params?: any) => api.get('/observations', { params }),
    get: (id: string) => api.get(`/observations/${id}`),
  },
  risk: {
    getUPRS: () => api.get<UPRSResponse>('/risk/uprs'),
    getScores: () => api.get<UPRSResponse>('/risk/scores'),
    getHistory: (params?: any) => api.get('/risk/history', { params }),
    postFamilyHistory: (data: any) => api.post('/risk/family-history', data),
    postGenetic: (data: any) => api.post('/risk/genetic', data),
    // Legacy support or specific uses
    get: (patientId?: string) => api.get<RiskResponse>(`/api/risk${patientId ? `?patientId=${patientId}` : ''}`),
  },
  devices: {
    register: (data: DevicePayload) => api.post<DeviceRecord>('/devices', data),
    list: () => api.get<DeviceRecord[]>('/devices'),
    unregister: (id: string) => api.delete(`/devices/${id}`),
  },
  clinician: {
    getQueue: (params?: any) => api.get<ClinicianQueueItem[]>('/clinician/queue', { params }),
    getCase: (caseId: string) => api.get(`/clinician/cases/${caseId}`),
    submitReview: (caseId: string, data: ReviewPayload) => api.post(`/clinician/review/${caseId}`, data),
    getPatients: (params?: any) => api.get<PatientsResponse>('/clinician/patients', { params }),
    getPatientHistory: (userId: string) => api.get(`/clinician/patients/${userId}/history`),
  },
  admin: {
    getWeights: () => api.get<AdminWeightsPayload>('/admin/risk-weights'),
    updateWeights: (data: AdminWeightsPayload) => api.put('/admin/risk-weights', data),
    getAuditLogs: (params?: any) => api.get<AuditLogEntry[]>('/admin/audit-logs', { params }),
    getModelVersions: () => api.get('/admin/model-versions'),
  },
  user: {
    getProfile: () => api.get<User>('/users/profile'),
    updateProfile: (data: Partial<User>) => api.put<User>('/users/profile', data),
    getAuditLogs: (params?: any) => api.get<AuditLogEntry[]>('/audit-logs', { params }),
  },
  // Legacy/other mocks
  vitals: {
    post: (data: VitalsPayload) => api.post('/api/vitals', data),
  },
  trends: {
    get: (patientId?: string) => api.get<TrendsResponse>(`/api/trends${patientId ? `?patientId=${patientId}` : ''}`),
  },
  recommendations: {
    get: (patientId?: string) => api.get<RecommendationsResponse>(`/api/recommendations${patientId ? `?patientId=${patientId}` : ''}`),
  },
  patients: {
    get: () => api.get<PatientsResponse>('/api/patients'),
  },
};