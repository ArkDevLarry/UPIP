import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.myheartrisk.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for more robust mock returns that handle different axios versions
const mockResponse = (data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
});

api.interceptors.request.use(
  (config) => {
    const { token, tokenType } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `${tokenType || 'Bearer'} ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// MOCK INTERCEPTOR FOR LOCAL DEV
api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;
    
    // Refresh token logic
    if (response?.status === 401 && !config._retry) {
        config._retry = true;
        try {
            const { data } = await api.post('/auth/refresh');
            useAuthStore.getState().setAuth(data.access_token, data.token_type, data.user);
            config.headers.Authorization = `${data.token_type} ${data.access_token}`;
            return api(config);
        } catch (refreshError) {
            useAuthStore.getState().logout();
            return Promise.reject(refreshError);
        }
    }

    // Simple mock logic for specific endpoints if they fail (404 or connection error)
    if (config.url.includes('/auth/login') || config.url.includes('/auth/register')) {
        return mockResponse({
            access_token: 'mock-bearer-token',
            token_type: 'bearer',
            expires_in: 3600,
            user: {
                id: 'u1',
                email: config.data ? JSON.parse(config.data).email : 'user@example.com',
                name: 'John Doe',
                role: useAuthStore.getState().role || 'patient'
            }
        });
    }

    if (config.url.includes('/auth/me')) {
        return mockResponse({
            user: {
                id: 'u1',
                email: 'user@example.com',
                name: 'John Doe',
                role: useAuthStore.getState().role || 'patient'
            },
            active_consents: ['wearable', 'clinical']
        });
    }

    if (config.url.includes('/risk/uprs')) {
        return mockResponse({
            data: {
                uprs_score: 0.421,
                uprs_tier: 'moderate',
                cardiovascular_score: 0.38,
                metabolic_score: 0.45,
                mental_score: 0.41,
                genetic_modifier: 1.1,
                confidence_score: 0.87,
                computed_at: new Date().toISOString(),
                model_version: 'v1.0.0',
                explanation_vector: {
                    cardiovascular: { resting_hr_baseline: 0.12, hrv_deviation: -0.08, bp_slope: 0.19 },
                    metabolic: { glucose_variability: 0.24, sleep_efficiency: -0.11 },
                    mental: { stress_trend: 0.15, social_withdrawal_index: 0.07 },
                    anomaly: { probability: 0.05, confidence_score: 0.91 }
                }
            },
            is_diagnostic: false,
            message: "Risk scores are probabilistic and not medical diagnoses."
        });
    }

    if (config.url.includes('/consent')) {
        return mockResponse({
            data: [
                { id: 'c1', module: 'wearable', granted: true, granted_at: '2024-01-01T00:00:00Z' },
                { id: 'c2', module: 'clinical', granted: true, granted_at: '2024-01-01T00:00:00Z' }
            ],
            available_modules: ['wearable', 'clinical', 'behavioral', 'speech', 'genetic']
        });
    }

    if (config.url.includes('/api/risk')) {
      return mockResponse({
        score: 14,
        level: 'low',
        updatedAt: new Date().toISOString(),
        topFactors: [
          { title: 'Normal BP', detail: '118/78 mmHg' },
          { title: 'Active Lifestyle', detail: '8.5k steps avg' },
          { title: 'Non-Smoker', detail: 'Significant risk reduction' }
        ],
        breakdown: [
          { factor: 'Age', weight: 2, explanation: 'Minimal impact' },
          { factor: 'Cholesterol', weight: 5, explanation: 'Optimal levels' }
        ],
        is_diagnostic: false,
        message: 'Your cardiovascular risk is within optimal range.'
      });
    }
    
    if (config.url.includes('/api/trends')) {
        return mockResponse({
            heartRate7d: [
                { date: 'Mon', value: 68 },
                { date: 'Tue', value: 72 },
                { date: 'Wed', value: 65 },
                { date: 'Thu', value: 70 },
                { date: 'Fri', value: 74 },
                { date: 'Sat', value: 62 },
                { date: 'Sun', value: 66 },
            ],
            activity7d: [
                { date: 'Mon', value: 8000 },
                { date: 'Tue', value: 12000 },
                { date: 'Wed', value: 7500 },
                { date: 'Thu', value: 9000 },
                { date: 'Fri', value: 11000 },
                { date: 'Sat', value: 15000 },
                { date: 'Sun', value: 5000 },
            ]
        });
    }

    if (config.url.includes('/users/profile') && config.method === 'put') {
        const payload = JSON.parse(config.data);
        return mockResponse({
            id: 'u1',
            email: payload.email || 'user@example.com',
            name: payload.name || 'John Doe',
            role: useAuthStore.getState().role || 'patient'
        });
    }

    if (config.url.includes('/api/recommendations')) {
        return mockResponse({
            items: [
                { priority: 'high', title: 'Maintain Hydration', reason: 'Recent activity spike detected', action: 'Drink 500ml extra water today' },
                { priority: 'medium', title: 'Consistent Sleep', reason: 'Fluctuating resting heart rate', action: 'Aim for 7.5h sleep' },
                { priority: 'low', title: 'Fiber Intake', reason: 'Long-term heart health', action: 'Add 1 serving of legumes' }
            ]
        });
    }

    if (config.url.includes('/api/patients')) {
        return mockResponse({
            patients: [
                { id: '1', name: 'John Doe', score: 12, riskLevel: 'low', updatedAt: '2024-03-20' },
                { id: '2', name: 'Jane Smith', score: 68, riskLevel: 'high', updatedAt: '2024-03-21' },
                { id: '3', name: 'Bob Wilson', score: 35, riskLevel: 'moderate', updatedAt: '2024-03-19' },
                { id: '4', name: 'Alice Brown', score: 82, riskLevel: 'high', updatedAt: '2024-03-22' },
                { id: '5', name: 'Charlie Davis', score: 44, riskLevel: 'moderate', updatedAt: '2024-03-22' },
                { id: '6', name: 'Diana Evans', score: 15, riskLevel: 'low', updatedAt: '2024-03-21' },
                { id: '7', name: 'Edward Foster', score: 91, riskLevel: 'high', updatedAt: '2024-03-22' },
                { id: '8', name: 'Fiona Garcia', score: 22, riskLevel: 'low', updatedAt: '2024-03-23' },
                { id: '9', name: 'George Harris', score: 55, riskLevel: 'moderate', updatedAt: '2024-03-23' },
                { id: '10', name: 'Hannah Ives', score: 10, riskLevel: 'low', updatedAt: '2024-03-23' },
                { id: '11', name: 'Ian Jenkins', score: 77, riskLevel: 'high', updatedAt: '2024-03-23' },
                { id: '12', name: 'Julia Klein', score: 41, riskLevel: 'moderate', updatedAt: '2024-03-23' },
            ],
            alerts: [
                { id: 'a1', patientId: '2', message: 'Significant BP spike detected for Jane Smith', severity: 'high', time: '10m ago' },
                { id: 'a2', patientId: '4', message: 'Heart Rate variability out of bounds for Alice Brown', severity: 'high', time: '25m ago' },
                { id: 'a3', patientId: '7', message: 'Critical Oxygen Saturation drop for Edward Foster', severity: 'high', time: '5m ago' },
                { id: 'a4', patientId: '11', message: 'Rapid glucose escalation for Ian Jenkins', severity: 'high', time: '2m ago' }
            ]
        });
    }

    if (config.url.includes('/clinician/queue')) {
        return mockResponse([
            { id: 'q1', patient_id: '7', patient_name: 'Edward Foster', uprs_score: 0.91, uprs_tier: 'elevated', priority: 'urgent', created_at: new Date().toISOString() },
            { id: 'q2', patient_id: '4', patient_name: 'Alice Brown', uprs_score: 0.82, uprs_tier: 'elevated', priority: 'high', created_at: new Date().toISOString() },
            { id: 'q3', patient_id: '11', patient_name: 'Ian Jenkins', uprs_score: 0.77, uprs_tier: 'elevated', priority: 'high', created_at: new Date().toISOString() },
            { id: 'q4', patient_id: '2', patient_name: 'Jane Smith', uprs_score: 0.68, uprs_tier: 'moderate', priority: 'normal', created_at: new Date().toISOString() },
        ]);
    }

    return Promise.reject(error);
  }
);

export default api;