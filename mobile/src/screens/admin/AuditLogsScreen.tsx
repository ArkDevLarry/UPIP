import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { History, Search, Filter, ShieldCheck, User as UserIcon } from 'lucide-react-native';
import { endpoints } from '../../services/endpoints';
import { AuditLogEntry } from '../../types/api';
import { useTheme } from '../../theme/ThemeContext';

export const AuditLogsScreen = () => {
  const { theme } = useTheme();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await endpoints.admin.getAuditLogs();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const renderLog = ({ item }: { item: AuditLogEntry }) => (
    <View style={[styles.logItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.logHeader}>
        <View style={styles.actionBadge}>
            <Text style={[styles.actionText, { color: theme.colors.primary }]}>{item.action.toUpperCase()}</Text>
        </View>
        <Text style={[styles.logTime, { color: theme.colors.text.muted }]}>
            {new Date(item.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={styles.logDetail}>
        <View style={styles.detailRow}>
            <UserIcon size={12} color={theme.colors.text.secondary} />
            <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>User ID: {item.user_id}</Text>
        </View>
        {item.ip_address && (
          <View style={styles.detailRow}>
              <ShieldCheck size={12} color={theme.colors.text.secondary} />
              <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>IP: {item.ip_address}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>System Audit</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>Immutable transaction logs</Text>
      </View>

      <FlatList
        data={logs}
        renderItem={renderLog}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={
            loading ? <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} /> : (
                <View style={styles.emptyContainer}>
                    <History size={48} color={theme.colors.text.muted} />
                    <Text style={[styles.emptyText, { color: theme.colors.text.muted }]}>No audit entries recorded for the current epoch.</Text>
                </View>
            )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  logItem: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionBadge: {
    backgroundColor: 'rgba(79, 157, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '800',
  },
  logTime: {
    fontSize: 11,
    fontWeight: '600',
  },
  logDetail: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    maxWidth: '80%',
    lineHeight: 20,
  }
});
