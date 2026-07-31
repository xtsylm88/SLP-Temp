// frontend/src/routes/AppRoutes.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { LandingPage } from '../pages/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AdminPlaceholderPage } from '../pages/AdminPlaceholderPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route
          path="/admin"
          element={
            <AdminPlaceholderPage
              title="Dashboard Admin"
              subtitle="Ringkasan statistik permohonan pendampingan"
            />
          }
        />
        <Route
          path="/admin/jenis-layanan"
          element={
            <AdminPlaceholderPage
              title="Master Jenis Layanan"
              subtitle="Kelola jenis layanan dan editor Schema JSON"
            />
          }
        />
        <Route
          path="/admin/permohonan"
          element={
            <AdminPlaceholderPage
              title="Daftar Permohonan"
              subtitle="Daftar permohonan pendampingan masuk"
            />
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminPlaceholderPage
              title="Pengaturan Sistem"
              subtitle="Konfigurasi Google Workspace Integration"
            />
          }
        />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
