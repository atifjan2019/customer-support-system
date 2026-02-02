import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../config/theme';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = () => {
  const { user, logout } = useAuth();

  const handleContact = () => {
    Linking.openURL('mailto:support@isp.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚙️ SETTINGS</Text>
          </View>
          
          <Text style={styles.title}>Account & Preferences</Text>
          <Text style={styles.subtitle}>Manage your account settings.</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.card, { marginTop: SIZES.md }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'user@email.com'}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {user?.role?.replace('_', ' ').toUpperCase() || 'USER'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings List */}
        <View style={[styles.card, { marginTop: SIZES.md }]}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: COLORS.infoLight }]}>
                <Text>📱</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>App Version</Text>
                <Text style={styles.settingValue}>1.0.0</Text>
              </View>
            </View>
            
            <View style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: COLORS.successLight }]}>
                <Text>🔔</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingValue}>Enabled</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleContact}>
              <View style={[styles.settingIcon, { backgroundColor: COLORS.warningLight }]}>
                <Text>📧</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Contact Support</Text>
                <Text style={styles.settingValue}>support@isp.com</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out */}
        <View style={[styles.card, { marginTop: SIZES.md }]}>
          <TouchableOpacity style={styles.signOutButton} onPress={logout}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ISP Support v1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2026 All rights reserved</Text>
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
    ...SHADOWS.medium,
  },
  headerTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    color: COLORS.white,
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
    fontSize: SIZES.fontXl,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  avatarText: {
    fontSize: SIZES.fontXl,
    fontWeight: '700',
    color: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: SIZES.fontLg,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  profileEmail: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    marginTop: SIZES.xs,
  },
  roleText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SIZES.md,
  },
  settingsList: {
    gap: SIZES.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusSm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: SIZES.fontMd,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  settingValue: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  signOutButton: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.md,
    alignItems: 'center',
  },
  signOutText: {
    color: COLORS.danger,
    fontSize: SIZES.fontMd,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
  },
  footerText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
  },
  footerSubtext: {
    fontSize: SIZES.fontXs,
    color: COLORS.textLight,
    marginTop: SIZES.xs,
  },
});

export default SettingsScreen;
