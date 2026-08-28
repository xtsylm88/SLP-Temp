// frontend/src/pages/PengajuanPage.tsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { StepPersonal, PersonalInfo } from '../components/StepPersonal';
import { StepDynamic } from '../components/StepDynamic';
import { StepConfirmation } from '../components/StepConfirmation';
import { RequestSuccess } from '../components/RequestSuccess';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorState } from '../components/ErrorState';

import { useSubmitPermohonan } from '../hooks/useSubmitPermohonan';
import { jenisLayananService, FieldSchemaItem } from '../services/jenisLayanan.service';

const STEPS = ['Identitas Pemohon', 'Detail Pendampingan', 'Konfirmasi'];

export const PengajuanPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Selected Service metadata
  const [jenisLayananId, setJenisLayananId] = useState<string>('');
  const [namaLayanan, setNamaLayanan] = useState<string>('');
  const [schemaVersion, setSchemaVersion] = useState<number>(1);
  const [fieldSchema, setFieldSchema] = useState<FieldSchemaItem[]>([]);
  const [loadingService, setLoadingService] = useState<boolean>(true);

  // Active Wizard Step
  const [activeStep, setActiveStep] = useState<number>(0);

  // Step 1: Personal Info State
  const [personalData, setPersonalData] = useState<PersonalInfo>({
    nama: '',
    jabatan: '',
    nip: '',
    instansi: '',
    wilayah: '',
    kontak: '',
    email: '',
  });
  const [personalErrors, setPersonalErrors] = useState<Record<string, string>>({});

  // Step 2: Dynamic Form Values State (Hanya mengenal formValues)
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [dynamicErrors, setDynamicErrors] = useState<Record<string, string>>({});

  // Submit Hook
  const { submit, submitting, error: submitError, result: submitResult } = useSubmitPermohonan();

  // Inisialisasi data Layanan dari State atau Query Params / Fallback
  useEffect(() => {
    async function initServiceData() {
      setLoadingService(true);

      const state = location.state as {
        jenis_layanan_id?: string;
        nama_layanan?: string;
        schema_version?: number;
        field_schema?: FieldSchemaItem[];
      } | null;

      const paramLayananId = searchParams.get('layanan') || state?.jenis_layanan_id;

      if (state && state.jenis_layanan_id && state.field_schema) {
        setJenisLayananId(state.jenis_layanan_id);
        setNamaLayanan(state.nama_layanan || state.jenis_layanan_id);
        setSchemaVersion(state.schema_version || 1);
        setFieldSchema(state.field_schema);
        setLoadingService(false);
      } else if (paramLayananId) {
        try {
          const fetched = await jenisLayananService.getById(paramLayananId);
          setJenisLayananId(fetched.id);
          setNamaLayanan(fetched.nama);
          setSchemaVersion(fetched.schema_version);
          setFieldSchema(fetched.field_schema || []);
        } catch {
          try {
            const all = await jenisLayananService.getAll();
            if (all.length > 0) {
              setJenisLayananId(all[0].id);
              setNamaLayanan(all[0].nama);
              setSchemaVersion(all[0].schema_version);
              setFieldSchema(all[0].field_schema || []);
            }
          } catch {
            // Handled
          }
        } finally {
          setLoadingService(false);
        }
      } else {
        try {
          const all = await jenisLayananService.getAll();
          if (all.length > 0) {
            setJenisLayananId(all[0].id);
            setNamaLayanan(all[0].nama);
            setSchemaVersion(all[0].schema_version);
            setFieldSchema(all[0].field_schema || []);
          }
        } catch {
          // Handled
        } finally {
          setLoadingService(false);
        }
      }
    }

    initServiceData();
  }, [location.state, searchParams]);

  // Handlers untuk Personal Data Change
  const handlePersonalChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
    if (personalErrors[field]) {
      setPersonalErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Handlers untuk Dynamic Form Change
  const handleDynamicChange = (fieldId: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    if (dynamicErrors[fieldId]) {
      setDynamicErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldId];
        return updated;
      });
    }
  };

  // Validasi Step 1 (Identitas)
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!personalData.nama.trim()) errors.nama = 'Nama lengkap wajib diisi.';
    if (!personalData.email.trim()) {
      errors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalData.email.trim())) {
      errors.email = 'Format email tidak valid.';
    }
    if (!personalData.instansi.trim()) errors.instansi = 'Nama instansi wajib diisi.';
    if (!personalData.kontak.trim()) errors.kontak = 'Nomor kontak wajib diisi.';

    setPersonalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validasi Step 2 (Formulir Dinamis)
  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    (fieldSchema || []).forEach((field) => {
      if (field.required) {
        const val = formValues[field.id];
        if (val === undefined || val === null || val === '') {
          errors[field.id] = `${field.label} wajib diisi.`;
        }
      }
    });

    setDynamicErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step Navigation Next
  const handleNext = () => {
    if (activeStep === 0) {
      if (validateStep1()) {
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      if (validateStep2()) {
        setActiveStep(2);
      }
    }
  };

  // Step Navigation Back
  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Submit Handler Akhir (Step 3 -> Submit)
  const handleSubmit = async () => {
    if (!jenisLayananId) return;

    await submit({
      nama: personalData.nama,
      jabatan: personalData.jabatan,
      nip: personalData.nip,
      instansi: personalData.instansi,
      wilayah: personalData.wilayah,
      kontak: personalData.kontak,
      email: personalData.email,
      jenis_layanan_id: jenisLayananId,
      schema_version: schemaVersion,
      formValues: formValues, // Direct Pass formValues
    });
  };

  // Tampilan Sukses Pengajuan
  if (submitResult) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <RequestSuccess
          requestId={submitResult.request_id}
          status={submitResult.status}
          createdAt={submitResult.created_at}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
      <LoadingOverlay open={submitting} message="Sedang mengirimkan permohonan pendampingan ke server..." />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: '12px',
          border: '1px solid #C8D2E3',
          bgcolor: '#FFFFFF',
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Chip
            label="FORMULIR PENGAJUAN RESMI"
            size="small"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.65rem',
              bgcolor: '#EBF2FF',
              color: '#1249B8',
              border: '1px solid #C8D2E3',
              mb: 1.5,
            }}
          />
          <Typography variant="h2" sx={{ fontSize: '2rem', color: '#081F4F', mb: 1 }}>
            Permohonan Pendampingan
          </Typography>
          {loadingService ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 1 }}>
              <CircularProgress size={16} sx={{ color: '#1249B8' }} />
              <Typography variant="body2" sx={{ color: '#4F5D75' }}>Memuat data jenis layanan...</Typography>
            </Box>
          ) : (
            <Typography variant="subtitle1" sx={{ color: '#1249B8', fontWeight: 600 }}>
              {namaLayanan || 'Layanan Pendampingan Teknis'}
            </Typography>
          )}
        </Box>

        {/* Stepper UI Header */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {STEPS.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: activeStep === index ? 700 : 500,
                    color: activeStep === index ? '#1249B8' : '#4F5D75',
                    fontSize: '0.85rem',
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 4, borderColor: '#C8D2E3' }} />

        {/* Dynamic Step Content */}
        <Box sx={{ minHeight: 320 }}>
          {activeStep === 0 && (
            <StepPersonal data={personalData} onChange={handlePersonalChange} errors={personalErrors} />
          )}

          {activeStep === 1 && (
            <StepDynamic
              fields={fieldSchema}
              values={formValues}
              onChange={handleDynamicChange}
              errors={dynamicErrors}
              namaLayanan={namaLayanan}
            />
          )}

          {activeStep === 2 && (
            <StepConfirmation
              personalData={personalData}
              dynamicFields={fieldSchema}
              formValues={formValues}
              namaLayanan={namaLayanan}
            />
          )}
        </Box>

        {/* Submit Error Banner if occurred */}
        {submitError && (
          <Box sx={{ mt: 3 }}>
            <ErrorState error={submitError} onRetry={handleSubmit} />
          </Box>
        )}

        <Divider sx={{ my: 4, borderColor: '#C8D2E3' }} />

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            onClick={activeStep === 0 ? () => navigate('/') : handleBack}
            sx={{
              borderRadius: '6px',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderColor: '#C8D2E3',
              color: '#1249B8',
              '&:hover': { borderColor: '#1249B8', bgcolor: '#EBF2FF' },
            }}
          >
            {activeStep === 0 ? 'Batal / Beranda' : 'Kembali'}
          </Button>

          {activeStep < STEPS.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              onClick={handleNext}
              sx={{
                borderRadius: '6px',
                fontWeight: 600,
                px: 4,
                py: 1,
                bgcolor: '#1249B8',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#0A2E73' },
              }}
            >
              Lanjutkan
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<SendIcon sx={{ fontSize: 16 }} />}
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                borderRadius: '6px',
                fontWeight: 600,
                px: 4,
                py: 1,
                bgcolor: '#1249B8',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#0A2E73' },
                fontSize: '0.925rem',
              }}
            >
              Kirim Permohonan
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

