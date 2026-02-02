import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../config/theme';
import { useAuth } from '../context/AuthContext';
import {
  LoginScreen,
  DashboardScreen,
  LeadsScreen,
  ComplaintsScreen,
  SettingsScreen,
  LeadDetailScreen,
  LeadFormScreen,
  ComplaintDetailScreen,
  ComplaintFormScreen,
} from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icon Component
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: { [key: string]: string } = {
    Dashboard: '📊',
    Leads: '👥',
    Complaints: '⚠️',
    Settings: '⚙️',
  };

  return (
    <View style={styles.tabIconContainer}>
      <Text style={styles.tabIcon}>{icons[name]}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{name}</Text>
    </View>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Leads" component={LeadsScreen} />
      <Tab.Screen name="Complaints" component={ComplaintsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// Auth Stack Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

// App Stack Navigator
const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="LeadDetail" component={LeadDetailScreen} />
      <Stack.Screen name="LeadForm" component={LeadFormScreen} />
      <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
      <Stack.Screen name="ComplaintForm" component={ComplaintFormScreen} />
    </Stack.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>ISP Support</Text>
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  loadingText: {
    fontSize: SIZES.fontXxl,
    fontWeight: '700',
    color: COLORS.white,
  },
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 70,
    paddingTop: SIZES.sm,
    paddingBottom: SIZES.sm,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default AppNavigator;
