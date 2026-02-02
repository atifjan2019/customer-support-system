import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const LeadDetailScreen = ({ navigation, route }: any) => {
  const leadId = route?.params?.id;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lead Detail</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Lead #{leadId ?? 'N/A'}</Text>
          <Text style={styles.subtitle}>Detail screen placeholder.</Text>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.medium,
  },
  headerTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSpacer: {
    width: 50,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radiusSm,
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    ...SHADOWS.medium,
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
});

export default LeadDetailScreen;
