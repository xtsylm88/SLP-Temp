// frontend/src/routes/AppRoutes.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { LandingPage } from '../pages/LandingPage';
import { PengajuanPage } from '../pages/PengajuanPage';
import { StatusPage } from '../pages/StatusPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LoginPage } from '../pages/LoginPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { PermohonanPage } from '../pages/admin/PermohonanPage';
import { PermohonanDetailPage } from '../pages/admin/PermohonanDetailPage';
import { JenisLayananPage } from '../pages/admin/JenisLayananPage';
import { AuditLogPage } from '../pages/admin/AuditLogPage';
import { TraceTimelinePage } from '../pages/admin/TraceTimelinePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pengajuan" element={<PengajuanPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Standalone Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/jenis-layanan" element={<JenisLayananPage />} />
        <Route path="/admin/permohonan" element={<PermohonanPage />} />
        <Route path="/admin/permohonan/:requestId" element={<PermohonanDetailPage />} />
        <Route path="/admin/audit-log" element={<AuditLogPage />} />
        <Route path="/admin/audit-log/:traceId" element={<TraceTimelinePage />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
