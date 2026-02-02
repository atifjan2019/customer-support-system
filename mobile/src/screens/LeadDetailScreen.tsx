import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../config/theme';
import { leadsAPI } from '../services/api';

interface LeadDetail {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  location?: string;
  company?: string;
  lead_type: string;
  status: string;
  priority: string;
  assigned_to?: number;
  assignedAgent?: {
    name: string;
  };
  creator?: {
    name: string;
  };
  complaint?: any;
}

const LeadDetailScreen = ({ navigation, route }: any) => {
  const leadId = route?.params?.id;
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeadDetail();
  }, [leadId]);

  const fetchLeadDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await leadsAPI.getOne(leadId);
      setLead(response);
    } catch (err: any) {
      console.error('Error fetching lead:', err);
      setError(err.response?.data?.message || 'Failed to fetch lead');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lead Detail</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lead Detail</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchLeadDetail}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lead Detail</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Lead #{lead?.id ?? 'N/A'}</Text>
            <View style={[styles.statusBadge, { backgroundColor: lead?.status === 'resolved' ? COLORS.successLight : COLORS.warningLight }]}>
              <Text style={[styles.statusText, { color: lead?.status === 'resolved' ? COLORS.success : COLORS.warning }]}>
                {lead?.status?.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Customer Name:</Text>
            <Text style={styles.value}>{lead?.customer_name || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{lead?.phone || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{lead?.address || 'N/A'}</Text>
          </View>

          {lead?.location && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{lead.location}</Text>
            </View>
          )}

          {lead?.company && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Company:</Text>
              <Text style={styles.value}>{lead.company}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Lead Type:</Text>
            <Text style={styles.value}>{lead?.lead_type?.replace('_', ' ').toUpperCase() || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Priority:</Text>
            <View style={[styles.priorityBadge, { backgroundColor: lead?.priority === 'urgent' ? COLORS.dangerLight : lead?.priority === 'high' ? COLORS.warningLight : COLORS.infoLight }]}>
              <Text style={[styles.priorityText, { color: lead?.priority === 'urgent' ? COLORS.danger : lead?.priority === 'high' ? COLORS.warning : COLORS.info }]}>
                {lead?.priority?.toUpperCase()}
              </Text>
            </View>
          </View>

          {lead?.assignedAgent && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Assigned Agent:</Text>
              <Text style={styles.value}>{lead.assignedAgent.name}</Text>
            </View>
          )}

          {lead?.creator && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Created By:</Text>
              <Text style={styles.value}>{lead.creator.name}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Mark as Resolved</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.medium,
  },
  headerTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radiusSm,
    minWidth: 60,
  },
  backText: {
    color: COLORS.white,
    fontSize: SIZES.fontSm,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SIZES.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.md,
  },
  errorText: {
    fontSize: SIZES.fontMd,
    color: COLORS.danger,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.radiusMd,
  },
  retryText: {
    color: COLORS.white,
    fontSize: SIZES.fontMd,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    ...SHADOWS.medium,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: SIZES.fontXl,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: SIZES.fontMd,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  value: {
    fontSize: SIZES.fontMd,
    color: COLORS.textMuted,
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.radiusSm,
  },
  statusText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.radiusSm,
  },
  priorityText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SIZES.md,
    paddingBottom: SIZES.xl,
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.fontMd,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.fontMd,
    fontWeight: '600',
  },
});

export default LeadDetailScreen;
