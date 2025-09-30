import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';
import AuthPage from './components/Auth/AuthPage';
import ClientDashboard from './components/Client/ClientDashboard';
import CraftsmanDashboard from './components/Craftsman/CraftsmanDashboard';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (user?.role === UserRole.Client) {
    return <ClientDashboard />;
  }

  if (user?.role === UserRole.Craftsman) {
    return <CraftsmanDashboard />;
  }

  return <div>Invalid user role</div>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;
