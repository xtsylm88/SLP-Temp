// backend/src/utils/validator.ts
import { BadRequestError } from './errors';
import { PermohonanInput } from '../types/appscript';

/**
 * Validasi payload pengajuan permohonan pendampingan
 */
export function validateSubmit(payload: unknown, traceId?: string): PermohonanInput {
  if (!payload || typeof payload !== 'object') {
    throw new BadRequestError('Payload request body tidak valid atau kosong', 'INVALID_PAYLOAD', traceId);
  }

  const p = payload as Record<string, unknown>;

  if (!p.nama || typeof p.nama !== 'string' || !p.nama.trim()) {
    throw new BadRequestError('Field nama wajib diisi', 'MISSING_NAMA', traceId);
  }

  if (!p.email || typeof p.email !== 'string' || !p.email.trim()) {
    throw new BadRequestError('Field email wajib diisi', 'MISSING_EMAIL', traceId);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(p.email.trim())) {
    throw new BadRequestError('Format email tidak valid', 'INVALID_EMAIL_FORMAT', traceId);
  }

  if (!p.jenis_layanan_id || typeof p.jenis_layanan_id !== 'string' || !p.jenis_layanan_id.trim()) {
    throw new BadRequestError('Field jenis_layanan_id wajib diisi', 'MISSING_JENIS_LAYANAN', traceId);
  }

  return {
    nama: p.nama.trim(),
    jabatan: typeof p.jabatan === 'string' ? p.jabatan.trim() : '',
    nip: typeof p.nip === 'string' ? p.nip.trim() : '',
    instansi: typeof p.instansi === 'string' ? p.instansi.trim() : '',
    wilayah: typeof p.wilayah === 'string' ? p.wilayah.trim() : '',
    kontak: typeof p.kontak === 'string' ? p.kontak.trim() : '',
    email: p.email.trim().toLowerCase(),
    jenis_layanan_id: p.jenis_layanan_id.trim(),
    schema_version: typeof p.schema_version === 'number' ? p.schema_version : 1,
    detail_json: p.detail_json && typeof p.detail_json === 'object' ? (p.detail_json as Record<string, unknown>) : {},
    pic: typeof p.pic === 'string' ? p.pic.trim() : '',
    catatan: typeof p.catatan === 'string' ? p.catatan.trim() : '',
  };
}

/**
 * Validasi parameter ID Jenis Layanan
 */
export function validateJenisLayananId(id: unknown, traceId?: string): string {
  if (!id || typeof id !== 'string' || !id.trim()) {
    throw new BadRequestError('Parameter ID jenis layanan wajib diisi', 'MISSING_ID', traceId);
  }
  return id.trim();
}
