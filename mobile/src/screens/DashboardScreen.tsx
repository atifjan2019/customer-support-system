import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../config/theme';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';

interface DashboardStats {
  open_complaints: number;
  pending_leads: number;
  resolved_today: number;
  total_leads: number;
  recent_activity: any[];
}

const DashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data || response);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.header}>
          <Text style={styles.logoText}>ISP <Text style={styles.logoLight}>Support</Text></Text>
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
        <Text style={styles.logoText}>ISP <Text style={styles.logoLight}>Support</Text></Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        <View style={styles.card}>
          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>📊 DASHBOARD</Text>
          </View>

          <Text style={styles.title}>Today's Overview</Text>
          <Text style={styles.subtitle}>Real-time metrics from your support system.</Text>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={[styles.statNumber, { color: COLORS.primary }]}>
                {stats?.open_complaints || 0}
              </Text>
              <Text style={styles.statLabel}>Open Complaints</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.warningLight }]}>
              <Text style={[styles.statNumber, { color: COLORS.warning }]}>
                {stats?.pending_leads || 0}
              </Text>
              <Text style={styles.statLabel}>Pending Leads</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.successLight }]}>
              <Text style={[styles.statNumber, { color: COLORS.success }]}>
                {stats?.resolved_today || 0}
              </Text>
              <Text style={styles.statLabel}>Resolved Today</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.infoLight }]}>
              <Text style={[styles.statNumber, { color: COLORS.info }]}>
                {stats?.total_leads || 0}
              </Text>
              <Text style={styles.statLabel}>Total Leads</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Leads')}
            >
              <Text style={styles.actionButtonText}>View All Leads</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => navigation.navigate('Complaints')}
            >
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                View Complaints
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Card */}
        <View style={[styles.card, { marginTop: SIZES.md }]}>
          <Text style={styles.welcomeText}>Welcome, {user?.name || 'User'}!</Text>
          <Text style={styles.roleText}>{user?.role?.replace('_', ' ').toUpperCase()}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  logoText: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    color: COLORS.white,
  },
  logoLight: {
    fontWeight: '400',
    opacity: 0.9,
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radiusSm,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: SIZES.fontSm,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.md,
    paddingBottom: SIZES.xxl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
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
    fontSize: SIZES.fontXxl,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.fontMd,
    color: COLORS.textMuted,
    marginBottom: SIZES.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
    marginBottom: SIZES.lg,
  },
  statCard: {
    width: '48%',
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: SIZES.font3xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
    marginTop: SIZES.xs,
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SIZES.md,
  },
  actions: {
    gap: SIZES.sm,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  actionButtonSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontMd,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: COLORS.textDark,
  },
  welcomeText: {
    fontSize: SIZES.fontLg,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  roleText: {
    fontSize: SIZES.fontSm,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: SIZES.xs,
  },
});

export default DashboardScreen;
