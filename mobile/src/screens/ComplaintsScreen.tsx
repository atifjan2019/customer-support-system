import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../config/theme';
import { complaintsAPI } from '../services/api';

interface Complaint {
  id: number;
  lead: {
    id: number;
    customer_name: string;
    status: string;
    priority: string;
    assigned_agent?: {
      name: string;
    };
  };
  category: string;
  severity: string;
  description: string;
}

const ComplaintsScreen = ({ navigation }: any) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = async () => {
    try {
      const response = await complaintsAPI.getAll();
      setComplaints(response.data || response);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchComplaints();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return { bg: COLORS.dangerLight, text: COLORS.danger };
      case 'medium':
        return { bg: COLORS.warningLight, text: COLORS.warning };
      default:
        return { bg: COLORS.infoLight, text: COLORS.info };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return { bg: COLORS.successLight, text: COLORS.success };
      default:
        return { bg: COLORS.warningLight, text: COLORS.warning };
    }
  };

  const renderComplaintItem = ({ item }: { item: Complaint }) => {
    const severityColors = getSeverityColor(item.severity);
    const statusColors = getStatusColor(item.lead?.status);

    return (
      <TouchableOpacity
        style={styles.complaintCard}
        onPress={() => navigation.navigate('ComplaintDetail', { id: item.id })}
      >
        <View style={styles.complaintHeader}>
          <Text style={styles.complaintName}>
            {item.lead?.customer_name || 'Unknown'}
          </Text>
          <View style={[styles.severityBadge, { backgroundColor: severityColors.bg }]}>
            <Text style={[styles.severityText, { color: severityColors.text }]}>
              {item.severity?.toUpperCase() || 'NORMAL'}
            </Text>
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg, alignSelf: 'flex-start' }]}>
          <Text style={[styles.statusText, { color: statusColors.text }]}>
            {item.lead?.status?.toUpperCase() || 'OPEN'}
          </Text>
        </View>
        
        {item.category && (
          <Text style={styles.complaintInfo}>🏷️ {item.category}</Text>
        )}
        
        {item.description && (
          <Text style={styles.complaintDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        {item.lead?.assigned_agent && (
          <Text style={styles.complaintInfo}>👤 {item.lead.assigned_agent.name}</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Complaints</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaints</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ComplaintForm', { mode: 'create' })}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚠️ COMPLAINTS</Text>
          </View>
          
          <Text style={styles.title}>Customer Complaints</Text>
          <Text style={styles.subtitle}>Track urgent issues and resolution status.</Text>
        </View>

        <FlatList
          data={complaints}
          renderItem={renderComplaintItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>✅ No complaints found</Text>
              <Text style={styles.emptySubtext}>All caught up! Great work.</Text>
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
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  headerTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    color: COLORS.white,
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radiusSm,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSm,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: SIZES.md,
    paddingBottom: SIZES.xxl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    ...SHADOWS.medium,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radiusFull,
    marginBottom: SIZES.md,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: SIZES.fontXs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: SIZES.fontXl,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
  },
  listContent: {
    paddingBottom: SIZES.xxl + SIZES.xxl,
  },
  complaintCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.xs,
  },
  complaintName: {
    fontSize: SIZES.fontMd,
    fontWeight: '600',
    color: COLORS.textDark,
    flex: 1,
  },
  severityBadge: {
    paddingVertical: 2,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.radiusSm,
  },
  severityText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    marginBottom: SIZES.xs,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  complaintInfo: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  complaintDescription: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
    marginTop: SIZES.xs,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
  },
  emptyText: {
    fontSize: SIZES.fontLg,
    color: COLORS.textMuted,
    marginBottom: SIZES.xs,
  },
  emptySubtext: {
    fontSize: SIZES.fontSm,
    color: COLORS.textLight,
  },
});

export default ComplaintsScreen;
