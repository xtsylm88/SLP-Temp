// shared/schemas/index.ts

import { FieldSchema } from '../types';

export const DEFAULT_SCHEMA_VERSION = 1;

export const INITIAL_FIELD_SCHEMA_TEMPLATE: FieldSchema = {
  version: DEFAULT_SCHEMA_VERSION,
  fields: {
    alasan_permohonan: {
      type: 'textarea',
      label: 'Alasan Permohonan',
      required: true,
      placeholder: 'Jelaskan alasan atau latar belakang permohonan pendampingan',
    },
    tanggal_kegiatan: {
      type: 'date',
      label: 'Rencana Tanggal Pelaksanaan',
      required: true,
    },
  },
};
