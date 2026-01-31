import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './layouts/Layout';

import LeadsPage from './pages/LeadsPage';
import UsersPage from './pages/UsersPage';
import CompaniesPage from './pages/CompaniesPage';
import NotificationsPage from './pages/NotificationsPage';
import LogsPage from './pages/LogsPage';
import ReportsPage from './pages/ReportsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// New Permission Guard Component
const PermissionGuard = ({ perm, children }) => {
  const { user } = useAuth();
  if (user?.role === 'super_admin') return children;
  if (user?.permissions?.includes(perm)) return children;
  return <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={
          user?.role === 'tech_team' ? <Navigate to="/leads" replace /> : (
            <PermissionGuard perm="dashboard.view">
              <DashboardPage />
            </PermissionGuard>
          )
        } />
        <Route path="leads" element={<PermissionGuard perm="leads.view"><LeadsPage /></PermissionGuard>} />

        <Route path="companies" element={<PermissionGuard perm="companies.manage"><CompaniesPage /></PermissionGuard>} />
        <Route path="notifications" element={<NotificationsPage />} />

        {/* Strictly protected admin pages */}
        <Route path="logs" element={<PermissionGuard perm="logs.view"><LogsPage /></PermissionGuard>} />
        <Route path="reports" element={<PermissionGuard perm="reports.view"><ReportsPage /></PermissionGuard>} />
        <Route path="users" element={<PermissionGuard perm="users.manage"><UsersPage /></PermissionGuard>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
