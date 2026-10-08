import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { useBusinessProfileStore } from './stores/useBusinessProfileStore';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AppShell } from './pages/AppShell';
import { BusinessOnboarding } from './components/onboarding/BusinessOnboarding';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const { initAuth } = useAuthStore();
  const { isCompleted } = useBusinessProfileStore();

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            {!isCompleted ? <BusinessOnboarding /> : <AppShell />}
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
