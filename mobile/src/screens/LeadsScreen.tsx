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
import { leadsAPI } from '../services/api';

interface Lead {
  id: number;
  customer_name: string;
  phone: string;
  lead_type: string;
  status: string;
  priority: string;
  assigned_agent?: {
    name: string;
  };
}

const LeadsScreen = ({ navigation }: any) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeads = async () => {
    try {
      const response = await leadsAPI.getAll();
      setLeads(response.data || response);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLeads();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'completed':
        return { bg: COLORS.successLight, text: COLORS.success };
      case 'pending':
      case 'in_progress':
        return { bg: COLORS.warningLight, text: COLORS.warning };
      default:
        return { bg: COLORS.primaryLight, text: COLORS.primary };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return { bg: COLORS.dangerLight, text: COLORS.danger };
      case 'medium':
        return { bg: COLORS.warningLight, text: COLORS.warning };
      default:
        return { bg: COLORS.infoLight, text: COLORS.info };
    }
  };

  const renderLeadItem = ({ item }: { item: Lead }) => {
    const statusColors = getStatusColor(item.status);
    const priorityColors = getPriorityColor(item.priority);

    return (
      <TouchableOpacity
        style={styles.leadCard}
        onPress={() => navigation.navigate('LeadDetail', { id: item.id })}
      >
        <View style={styles.leadHeader}>
          <Text style={styles.leadName}>{item.customer_name || 'Unknown'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {item.status?.toUpperCase() || 'OPEN'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.leadMeta}>
          {item.lead_type || 'Request'} • Priority: {item.priority || 'Normal'}
        </Text>
        
        {item.phone && (
          <Text style={styles.leadInfo}>📞 {item.phone}</Text>
        )}
        
        {item.assigned_agent && (
          <Text style={styles.leadInfo}>👤 {item.assigned_agent.name}</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Leads</Text>
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
        <Text style={styles.headerTitle}>Leads</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('LeadForm', { mode: 'create' })}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>👥 LEAD MANAGEMENT</Text>
          </View>
          
          <Text style={styles.title}>Customer Leads</Text>
          <Text style={styles.subtitle}>Review and manage customer requests.</Text>
        </View>

        <FlatList
          data={leads}
          renderItem={renderLeadItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>📝 No leads found</Text>
              <Text style={styles.emptySubtext}>Create your first lead to get started.</Text>
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
    paddingBottom: SIZES.xxl,
  },
  leadCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.xs,
  },
  leadName: {
    fontSize: SIZES.fontMd,
    fontWeight: '600',
    color: COLORS.textDark,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.radiusSm,
  },
  statusText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
  },
  leadMeta: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
    marginBottom: SIZES.xs,
  },
  leadInfo: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
    marginTop: 2,
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

export default LeadsScreen;
