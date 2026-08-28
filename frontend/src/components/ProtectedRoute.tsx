// frontend/src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading message="Memverifikasi autentikasi administrator..." />
      </div>
    );
  }

  if (!authenticated) {
    // Redirect ke halaman login dengan menyimpan lokasi asal (state)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
