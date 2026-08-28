// frontend/src/pages/LandingPage.tsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  InputBase,
  Button,
  Grid,
  Chip,
  Skeleton,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useNavigate } from 'react-router-dom';
import { ServiceList } from '../components/ServiceList';
import { useJenisLayanan } from '../hooks/useJenisLayanan';
import { apiFetch } from '../services/api';

interface HealthStatus {
  status: string;
  timestamp: string;
  appsScriptConfigured: boolean;
  latencyMs?: number;
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const { data: services, loading: servicesLoading } = useJenisLayanan();

  // Health state for Card 3 (Real connection to GET /health with 45s interval polling)
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchHealthStatus = () => {
      const startTime = Date.now();
      apiFetch<{ status: string; timestamp: string; appsScriptConfigured: boolean }>('/health')
        .then((res) => {
          if (isMounted && res.data) {
            const latency = Date.now() - startTime;
            setHealth({ ...res.data, latencyMs: latency });
            setHealthLoading(false);
            setHealthError(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setHealthError(true);
            setHealthLoading(false);
          }
        });
    };

    // Initial fetch on mount
    fetchHealthStatus();

    // Polling every 45 seconds (matching backend healthCacheTtlMs)
    const intervalId = setInterval(fetchHealthStatus, 45000);

    return () => {
      isMounted = false;
      clearInterval(intervalId); // Guarantees polling stops completely when component unmounts
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/status?id=${encodeURIComponent(searchId.trim().toUpperCase())}`);
    }
  };

  // Extract first active service's field_schema for Card 1 (REAL DATA)
  const activeService = services?.find((s) => s.aktif) || services?.[0];

  return (
    <Box sx={{ bgcolor: '#F3F6FB', minHeight: '100vh' }}>
      {/* Official BPMP Sumsel Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          px: 2,
          overflow: 'hidden',
          // Background photo layer overlaid with official BPMP navy gradient
          background: `linear-gradient(135deg, rgba(8, 31, 79, 0.92) 0%, rgba(10, 46, 115, 0.88) 50%, rgba(18, 63, 151, 0.94) 100%), url('https://i.postimg.cc/pyN0jP6Q/Chat-GPT-Image-Jul-22-2026-11-57-59-AM.png') center/cover no-repeat`,
          borderBottom: '1px solid #1249B8',
          boxShadow: 'inset 0 -1px 0 rgba(247, 181, 0, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(110, 168, 255, 0.15) 0%, rgba(10, 46, 115, 0) 70%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(247, 181, 0, 0.08) 0%, rgba(8, 31, 79, 0) 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        {/* Placeholder tag marker comment for official BPMP Sumsel background photo replaceability */}
        {/* FOTO LATAR HERO: Foto kegiatan pendidikan/gedung BPMP Sumsel (Placeholder via Unsplash HD Education) */}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              maxWidth: 840,
              mx: 'auto',
              textAlign: 'center',
              p: { xs: 3, md: 5 },
              borderRadius: '16px',
              backdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(10, 46, 115, 0.55)',
              border: '1px solid rgba(200, 210, 227, 0.2)',
              boxShadow: '0 8px 32px rgba(8, 31, 79, 0.45)',
            }}
          >
            {/* Official Kemendikdasmen & BPMP Lockup Logo */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                component="img"
                src="https://i.postimg.cc/QC5p7159/Chat-GPT-Image-Aug-7-2026-11-28-00-AM.png"
                alt="Kemendikdasmen BPMP Sumsel"
                referrerPolicy="no-referrer"
                sx={{
                  height: { xs: 72, sm: 90 },
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))',
                }}
              />
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                mb: 2.5,
                color: '#FFFFFF',
                lineHeight: 1.15,
                fontWeight: 700,
              }}
            >
              Layanan Pendampingan Digital Terpadu{' '}
              <Box component="span" sx={{ color: '#FFC93C' }}>
                BPMP Sumsel
              </Box>
            </Typography>

            {/* Gold Accent Divider */}
            <Box
              sx={{
                width: 80,
                height: 3,
                bgcolor: '#F7B500',
                mx: 'auto',
                mb: 3,
                borderRadius: '2px',
                boxShadow: '0 0 12px rgba(247, 181, 0, 0.6)',
              }}
            />

            <Typography
              variant="body1"
              sx={{
                color: '#C8D2E3',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.6,
                mb: 5,
                maxWidth: 680,
                mx: 'auto',
              }}
            >
              Platform resmi BPMP Sumsel untuk permohonan pendampingan teknis dan tata kelola pendidikan.
              Diproses transparan dengan validasi formulir dinamis secara real-time.
            </Typography>

            {/* Hero Quick Action Box */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Paper
                component="form"
                onSubmit={handleSearch}
                elevation={0}
                sx={{
                  p: '4px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  width: { xs: '100%', sm: 420 },
                  borderRadius: '8px',
                  border: '1px solid #C8D2E3',
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(8, 31, 79, 0.2)',
                  '&:focus-within': {
                    borderColor: '#F7B500',
                  },
                }}
              >
                <SearchIcon sx={{ color: '#4F5D75', ml: 1, mr: 0.5, fontSize: 20 }} />
                <InputBase
                  placeholder="Masukkan Request ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  sx={{ ml: 1, flex: 1, fontSize: '0.875rem', color: '#081F4F', fontWeight: 500 }}
                />
                <Box
                  component="kbd"
                  sx={{
                    px: 1,
                    py: 0.25,
                    mr: 1,
                    fontSize: '0.7rem',
                    fontFamily: '"JetBrains Mono", monospace',
                    bgcolor: '#F3F6FB',
                    border: '1px solid #C8D2E3',
                    borderRadius: '4px',
                    color: '#4F5D75',
                    display: { xs: 'none', sm: 'inline-block' },
                  }}
                >
                  REQ-XXXX
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: '6px',
                    px: 2.5,
                    py: 0.8,
                    fontWeight: 600,
                    bgcolor: '#1249B8',
                    color: '#FFFFFF',
                    '&:hover': { bgcolor: '#2C74F5' },
                  }}
                >
                  Cari
                </Button>
              </Paper>

              <Button
                variant="outlined"
                onClick={() => {
                  const el = document.getElementById('daftar-layanan');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: '6px',
                  py: 1.1,
                  px: 3,
                  borderColor: '#C8D2E3',
                  color: '#FFFFFF',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': { borderColor: '#F7B500', bgcolor: 'rgba(255, 255, 255, 0.08)' },
                }}
              >
                Mulai Pengajuan
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Bento Box Feature Grids Section (Asymmetrical CSS Grid) */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              fontFamily: '"JetBrains Mono", monospace',
              color: '#4F5D75',
              letterSpacing: '0.05em',
              mb: 1,
              fontWeight: 700,
            }}
          >
            KEUNGGULAN SISTEM
          </Typography>
          <Typography variant="h2" sx={{ fontSize: '1.75rem', color: '#081F4F' }}>
            Fitur Utama & Integrasi Layanan
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Bento Card 1: Asymmetrical 7 Columns - Live Dynamic Form Schema */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                height: '100%',
                borderRadius: '12px',
                border: '1px solid #C8D2E3',
                bgcolor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      minHeight: 44,
                      borderRadius: '50%',
                      bgcolor: '#EBF2FF',
                      border: '1px solid #C8D2E3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <DescriptionOutlinedIcon sx={{ color: '#1249B8', fontSize: 22 }} />
                  </Box>
                  <Chip
                    label="SCHEMATIC PREVIEW"
                    size="small"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.65rem',
                      bgcolor: '#EBF2FF',
                      color: '#1249B8',
                      border: '1px solid #C8D2E3',
                    }}
                  />
                </Box>

                <Typography variant="h3" sx={{ mb: 1, fontSize: '1.25rem', color: '#081F4F' }}>
                  Formulir Dinamis Berbasis Skema
                </Typography>

                <Typography variant="body2" sx={{ color: '#4F5D75', mb: 3 }}>
                  Struktur input dibuat fleksibel mengikuti skema metadata resmi yang dikonfigurasi pada master data.
                </Typography>

                {/* Real Data Preview from GET /api/jenis-layanan */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    bgcolor: '#F3F6FB',
                    border: '1px solid #C8D2E3',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontFamily: '"JetBrains Mono", monospace',
                      color: '#4F5D75',
                      mb: 1.5,
                    }}
                  >
                    SKEMA AKTIF: {servicesLoading ? 'MEMUAT...' : (activeService?.nama.toUpperCase() || 'TIDAK ADA DATA')}
                  </Typography>

                  {servicesLoading ? (
                    <Stack spacing={1}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="90%" height={20} />
                      <Skeleton variant="text" width="75%" height={20} />
                    </Stack>
                  ) : activeService && activeService.field_schema && activeService.field_schema.length > 0 ? (
                    <Stack spacing={1}>
                      {activeService.field_schema.slice(0, 3).map((field, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'space-between',
                            p: 1,
                            borderRadius: '4px',
                            bgcolor: '#FFFFFF',
                            border: '1px solid #C8D2E3',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.825rem', color: '#081F4F' }}>
                            {field.label}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={field.type.toUpperCase()}
                              size="small"
                              sx={{
                                fontFamily: '"JetBrains Mono", monospace',
                                fontSize: '0.6rem',
                                height: 20,
                                bgcolor: '#EBF2FF',
                                color: '#1249B8',
                                border: '1px solid #C8D2E3',
                              }}
                            />
                            {field.required && (
                              <Chip
                                label="WAJIB"
                                size="small"
                                sx={{
                                  fontFamily: '"JetBrains Mono", monospace',
                                  fontSize: '0.6rem',
                                  height: 20,
                                  bgcolor: '#FFF8E5',
                                  color: '#F7B500',
                                  border: '1px solid #F7B500',
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      ))}

                      {activeService.field_schema.length > 3 && (
                        <Typography variant="caption" sx={{ color: '#4F5D75', fontStyle: 'italic', pt: 0.5 }}>
                          + {activeService.field_schema.length - 3} atribut bidang tambahan lainnya
                        </Typography>
                      )}
                    </Stack>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#4F5D75', fontStyle: 'italic' }}>
                      Belum ada atribut bidang yang terdefinisi pada skema ini.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Bento Card 2: Asymmetrical 5 Columns - Pelacakan Progres */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                height: '100%',
                borderRadius: '12px',
                border: '1px solid #C8D2E3',
                bgcolor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      minHeight: 44,
                      borderRadius: '50%',
                      bgcolor: '#EBF2FF',
                      border: '1px solid #C8D2E3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <TrackChangesOutlinedIcon sx={{ color: '#1249B8', fontSize: 22 }} />
                  </Box>
                  <Chip
                    label="TIMELINE STATUS"
                    size="small"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.65rem',
                      bgcolor: '#EBF2FF',
                      color: '#1249B8',
                      border: '1px solid #C8D2E3',
                    }}
                  />
                </Box>

                <Typography variant="h3" sx={{ mb: 1, fontSize: '1.25rem', color: '#081F4F' }}>
                  Pelacakan Real-Time
                </Typography>

                <Typography variant="body2" sx={{ color: '#4F5D75', mb: 3 }}>
                  Pantau alur verifikasi dokumen dan penetapan PIC permohonan secara mandiri kapan saja.
                </Typography>

                {/* Status Timeline Workflow Visual */}
                <Stack spacing={1.5}>
                  {[
                    { label: 'DRAFT', desc: 'Permohonan berhasil terdaftar di sistem' },
                    { label: 'PROSES', desc: 'Verifikasi berkas & penetapan Petugas PIC' },
                    { label: 'SELESAI', desc: 'Pendampingan selesai dilaksanakan' },
                  ].map((st, idx) => (
                    <Box
                      key={st.label}
                      sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        border: '1px solid #C8D2E3',
                        bgcolor: idx === 0 ? '#EBF2FF' : '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleOutlinedIcon
                          sx={{ fontSize: 16, color: idx === 0 ? '#1249B8' : '#4F5D75', flexShrink: 0 }}
                        />
                        <Chip
                          label={st.label}
                          size="small"
                          sx={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            height: 22,
                            bgcolor: idx === 0 ? '#1249B8' : '#EBF2FF',
                            color: idx === 0 ? '#FFFFFF' : '#1249B8',
                            border: '1px solid #C8D2E3',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#4F5D75', fontSize: '0.8rem', pl: 3 }}>
                        {st.desc}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Bento Card 3: Asymmetrical 12 Columns (Full Width) - Status Layanan Sistem */}
          <Grid size={{ xs: 12, md: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: '12px',
                border: '1px solid #C8D2E3',
                bgcolor: '#FFFFFF',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  justifyContent: 'space-between',
                  gap: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      minHeight: 44,
                      borderRadius: '50%',
                      bgcolor: healthError ? '#FFEBEE' : '#E8F5E9',
                      border: `1px solid ${healthError ? '#FFCDD2' : '#A5D6A7'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <DnsOutlinedIcon sx={{ color: healthError ? '#C62828' : '#2E7D32', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontSize: '1.15rem', mb: 0.25, color: '#081F4F' }}>
                      Status Layanan Sistem
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4F5D75' }}>
                      Sistem dipantau secara otomatis untuk memastikan seluruh layanan pendampingan selalu siap digunakan.
                    </Typography>
                  </Box>
                </Box>

                {/* Real Health Data Metrics in friendly language */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#4F5D75', display: 'block', mb: 0.5, fontWeight: 600 }}>
                      KONDISI SISTEM
                    </Typography>
                    {healthLoading ? (
                      <Skeleton variant="text" width={90} height={28} />
                    ) : (
                      <Chip
                        icon={
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: healthError ? '#C62828' : '#2E7D32',
                              ml: '6px !important',
                            }}
                          />
                        }
                        label={healthError ? 'Sistem Bermasalah' : 'Sistem Aktif'}
                        size="small"
                        sx={{
                          fontSize: '0.75rem',
                          bgcolor: healthError ? '#FFEBEE' : '#E8F5E9',
                          color: healthError ? '#C62828' : '#2E7D32',
                          border: `1px solid ${healthError ? '#FFCDD2' : '#A5D6A7'}`,
                          fontWeight: 700,
                          py: 0.5,
                        }}
                      />
                    )}
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#4F5D75', display: 'block', mb: 0.5, fontWeight: 600 }}>
                      PEMERIKSAAN TERAKHIR
                    </Typography>
                    {healthLoading ? (
                      <Skeleton variant="text" width={110} height={24} />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#081F4F',
                          fontSize: '0.85rem',
                        }}
                      >
                        {health?.timestamp
                          ? `Diperiksa ${Math.max(1, Math.floor((Date.now() - new Date(health.timestamp).getTime()) / 1000))} detik lalu`
                          : 'Diperiksa baru saja'}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Main Services Section */}
      <Box id="daftar-layanan" sx={{ py: { xs: 8, md: 10 }, borderTop: '1px solid #C8D2E3', bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontFamily: '"JetBrains Mono", monospace',
                color: '#4F5D75',
                letterSpacing: '0.05em',
                mb: 1,
              }}
            >
              02 / DAFTAR LAYANAN
            </Typography>
            <Typography variant="h2" sx={{ fontSize: '1.75rem', color: '#081F4F', mb: 1 }}>
              Pilih Jenis Layanan Pendampingan
            </Typography>
            <Typography variant="body1" sx={{ color: '#4F5D75', maxWidth: 640 }}>
              Pilih salah satu jenis layanan di bawah ini untuk memulai proses pengajuan permohonan resmi BPMP Sumsel.
            </Typography>
          </Box>

          <ServiceList />
        </Container>
      </Box>
    </Box>
  );
};

