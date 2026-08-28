// frontend/src/hooks/useSubmitPermohonan.ts

import { useState } from 'react';
import { permohonanService, PermohonanFormData, SubmitResult } from '../services/permohonan.service';
import { ApiError } from '../services/api';

export function useSubmitPermohonan() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const submit = async (formData: PermohonanFormData) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await permohonanService.submit(formData);
      setResult(res);
      return res;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError(err instanceof Error ? err.message : 'Terjadi kesalahan saat pengajuan', 500));
      }
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitting(false);
    setError(null);
    setResult(null);
  };

  return { submit, submitting, error, result, reset };
}
