// frontend/src/pages/admin/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { adminPermohonanService } from '../../services/adminPermohonan.service';
import { LoadingState } from '../../components/admin/LoadingState';
import { ErrorState } from '../../components/admin/ErrorState';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    inReview: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminPermohonanService.getPermohonanList({ page: 1, pageSize: 100 });
      const items = res.items || [];

      let inReviewCount = 0; // SUBMITTED / IN_REVIEW / PROSES
      let approvedCount = 0; // APPROVED
      let completedCount = 0; // COMPLETED / SELESAI
      let rejectedCount = 0; // REJECTED / DITOLAK

      items.forEach((item) => {
        const s = (item.status || '').toUpperCase();
        if (s === 'APPROVED') {
          approvedCount++;
        } else if (s === 'COMPLETED' || s === 'SELESAI') {
          completedCount++;
        } else if (s === 'REJECTED' || s === 'DITOLAK') {
          rejectedCount++;
        } else if (s === 'SUBMITTED' || s === 'IN_REVIEW' || s === 'PROSES') {
          inReviewCount++;
        }
      });

      setStats({
        total: res.total || items.length,
        inReview: inReviewCount,
        approved: approvedCount,
        completed: completedCount,
        rejected: rejectedCount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat ringkasan dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <LoadingState message="Memuat Dashboard Admin..." variant="spinner" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardStats} />;
  }

  const cards = [
    {
      title: 'Total Permohonan',
      value: stats.total,
      color: '#4f46e5',
      bgColor: 'rgba(79, 70, 229, 0.08)',
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Dalam Review',
      value: stats.inReview,
      color: '#0284c7',
      bgColor: 'rgba(2, 132, 199, 0.08)',
      icon: <PendingActionsIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Disetujui (Approved)',
      value: stats.approved,
      color: '#d97706',
      bgColor: 'rgba(217, 119, 6, 0.08)',
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Selesai (Completed)',
      value: stats.completed,
      color: '#16a34a',
      bgColor: 'rgba(22, 163, 74, 0.08)',
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Ditolak',
      value: stats.rejected,
      color: '#dc2626',
      bgColor: 'rgba(220, 38, 38, 0.08)',
      icon: <HighlightOffIcon sx={{ fontSize: 32 }} />,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Dashboard Admin
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Ringkasan permohonan pendampingan dan status pengerjaan saat ini.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 4 }}>
        {cards.map((card, idx) => (
          <Card
            key={idx}
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b' }}>
                  {card.title}
                </Typography>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    bgcolor: card.bgColor,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Quick Navigation Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
              <AssignmentIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Kelola Permohonan
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Lihat, verifikasi status, dan tindak lanjuti permohonan masuk.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/admin/permohonan')}
            sx={{ borderRadius: '10px', fontWeight: 700, textTransform: 'none', mt: 1 }}
          >
            Buka Daftar Permohonan
          </Button>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
              <CategoryIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Master Jenis Layanan
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Kelola katalog jenis layanan dan konfigurasi Field Schema JSON.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/admin/jenis-layanan')}
            sx={{ borderRadius: '10px', fontWeight: 700, textTransform: 'none', mt: 1 }}
          >
            Buka Master Jenis Layanan
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};
