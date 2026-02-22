import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  TextInput,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Bell, Search, Filter, Users, AlertTriangle, UserPlus } from 'lucide-react-native';
import { endpoints } from '../../services/endpoints';
import { PatientsResponse, ClinicianQueueItem } from '../../types/api';
import { RiskBadge } from '../../components/RiskBadge';
import { Card } from '../../components/Card';
import { useTheme } from '../../theme/ThemeContext';

export const ClinicianDashboardScreen = ({ navigation }: any) => {
  const [patientData, setPatientData] = useState<PatientsResponse | null>(null);
  const [queue, setQueue] = useState<ClinicianQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  const fetchData = async () => {
    try {
      const [patientsRes, queueRes] = await Promise.all([
        endpoints.clinician.getPatients(),
        endpoints.clinician.getQueue()
      ]);
      setPatientData(patientsRes.data);
      setQueue(queueRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const filteredPatients = patientData?.patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPatient = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.patientRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate('PatientDetail', { patientId: item.id, name: item.name })}
      activeOpacity={0.7}
    >
      <View style={[styles.patientAvatar, { backgroundColor: `${theme.colors.primary}10`, borderColor: `${theme.colors.primary}30` }]}>
        <Text style={[styles.avatarText, { color: theme.colors.primary }]}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.patientInfo}>
        <Text style={[styles.patientName, { color: theme.colors.text.primary }]}>{item.name}</Text>
        <View style={styles.patientMetaRow}>
            <Text style={[styles.lastUpdated, { color: theme.colors.text.muted }]}>ID: {item.id.slice(0, 8)}</Text>
            <View style={[styles.dot, { backgroundColor: theme.colors.text.muted }]} />
            <Text style={[styles.lastUpdated, { color: theme.colors.text.muted }]}>{item.updatedAt}</Text>
        </View>
      </View>
      <View style={styles.patientRisk}>
        <Text style={[styles.scoreText, { color: theme.colors.text.primary }]}>{item.score}%</Text>
        <RiskBadge level={item.riskLevel} />
      </View>
      <ChevronRight size={16} color={theme.colors.text.muted} style={{ marginLeft: 8 }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>Clinician Portal</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>Intelligent Patient Monitoring</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.notificationBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Bell size={22} color={theme.colors.text.primary} />
            {queue.length > 0 && <View style={[styles.alertBadge, { borderColor: theme.colors.surface, backgroundColor: '#EF4444' }]} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Search size={18} color={theme.colors.text.muted} style={styles.searchIcon} />
            <TextInput 
                style={[styles.searchInput, { color: theme.colors.text.primary }]}
                placeholder="Search patients by name..."
                placeholderTextColor={theme.colors.text.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterBtn}>
                <Filter size={18} color={theme.colors.text.primary} />
            </TouchableOpacity>
        </View>

        {queue.length > 0 && searchQuery === '' && (
          <View style={styles.alertsSection}>
            <View style={styles.sectionHeader}>
                <AlertTriangle size={16} color="#EF4444" />
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Review Queue ({queue.length})</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.alertsScroll}>
                {queue.map(item => (
                  <TouchableOpacity 
                    key={item.id} 
                    onPress={() => navigation.navigate('PatientDetail', { patientId: item.patient_id, caseId: item.id })}
                  >
                    <Card className={`mr-4 w-64 border-l-4 ${item.priority === 'urgent' ? 'border-red-600' : 'border-red-400'} py-3`}>
                      <View style={styles.alertContent}>
                          <Text style={[styles.alertMessage, { color: theme.colors.text.primary }]} numberOfLines={1}>{item.patient_name}</Text>
                          <Text style={[styles.alertTime, { color: theme.colors.text.secondary }]}>UPRS: {Math.round(item.uprs_score * 100)}% • {item.priority.toUpperCase()}</Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.listHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Patient Directory</Text>
        </View>

        <FlatList
          data={filteredPatients}
          renderItem={renderPatient}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.accent} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.colors.text.muted }]}>{loading ? 'Syncing records...' : 'No patients found matching your search'}</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  alertBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterBtn: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  alertsSection: {
    marginBottom: 24,
  },
  alertsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  alertTime: {
    fontSize: 10,
    marginTop: 4,
  },
  listHeader: {
    marginBottom: 16,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
  },
  patientMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.5,
  },
  lastUpdated: {
    fontSize: 11,
  },
  patientRisk: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
  },
});