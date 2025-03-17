import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme';
import LoginForm from './components/auth/LoginForm';
import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import Header from './components/layout/Header';

// Main App content component that handles role-based rendering
const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Box>
      <Header />
      <Box component="main" sx={{ p: 3 }}>
        {user.role === 'SUPER_ADMIN' && <SuperAdminDashboard />}
        {user.role === 'ADMIN' && <AdminDashboard />}
        {user.role === 'EMPLOYEE' && <EmployeeDashboard />}
      </Box>
    </Box>
  );
};

// Main App component
const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppContent />
      </Box>
    </AuthProvider>
  </ThemeProvider>
);

export default App;