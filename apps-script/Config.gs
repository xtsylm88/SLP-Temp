// apps-script/Config.gs
/**
 * Pusat Konfigurasi Aplikasi Google Apps Script
 * Seluruh konstanta dan konfigurasi global didefinisikan di sini.
 */

var Config = {
  // Nama-nama Sheet di Google Spreadsheet
  SHEETS: {
    MASTER_JENIS_LAYANAN: "Master Jenis Layanan",
    PERMOHONAN: "Permohonan",
    USER_ADMIN: "User Admin",
    SEQUENCE: "Sequence",
    LOG: "Log"
  },

  // Status Permohonan
  STATUS: {
    DRAFT: "DRAFT",
    SUBMITTED: "SUBMITTED",
    IN_REVIEW: "IN_REVIEW",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    COMPLETED: "COMPLETED"
  },

  // Role User Admin
  ROLES: {
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN",
    VERIFIER: "VERIFIER"
  },

  // Pengaturan Waktu & Format
  TIMEZONE: "Asia/Jakarta",
  DATE_FORMAT: "yyyy-MM-dd'T'HH:mm:ss'Z'",

  // Generator Request ID
  REQUEST_ID_PREFIX: "REQ",

  // Schema Version Default untuk form dinamis
  SCHEMA_VERSION_DEFAULT: 1,

  // Google Drive & Upload
  UPLOAD_FOLDER_ID: "YOUR_DRIVE_FOLDER_ID_PLACEHOLDER",
  MAX_UPLOAD_SIZE_BYTES: 10485760, // 10 MB
  ALLOWED_MIME_TYPES: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],

  // Authentication Shared Secret
  SHARED_SECRET: "YOUR_SHARED_SECRET_KEY_PLACEHOLDER",

  // Default Spreadsheet ID (jika tidak menggunakan SpreadsheetApp.getActiveSpreadsheet())
  SPREADSHEET_ID: "YOUR_SPREADSHEET_ID_PLACEHOLDER"
};
