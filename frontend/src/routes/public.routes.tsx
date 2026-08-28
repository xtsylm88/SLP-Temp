// frontend/src/routes/public.routes.tsx

import React from 'react';
import { Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { PengajuanPage } from '../pages/PengajuanPage';
import { StatusPage } from '../pages/StatusPage';

export const publicRoutes = [
  <Route key="landing" path="/" element={<LandingPage />} />,
  <Route key="pengajuan" path="/pengajuan" element={<PengajuanPage />} />,
  <Route key="status" path="/status" element={<StatusPage />} />,
];
