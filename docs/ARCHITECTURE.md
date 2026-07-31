// docs/ARCHITECTURE.md

# Arsitektur Sistem Layanan Pendampingan

## High-Level Data Flow
```
Browser (React Frontend)
  │
  ▼
Express Backend (Business Logic & Gateway Layer)
  │ (X-App-Secret Authorization)
  ▼
Google Apps Script (Data Service Layer)
  │
  ├── Google Spreadsheet (Single Source of Database)
  └── Google Drive (Storage berkas pendukung)
```

## Prinsip & Konvensi Utama
1. **Frontend Isolation**: React TIDAK BOLEH mengakses Apps Script secara langsung.
2. **Backend Gateway**: Express menangani validasi, auth admin, rate limiting, caching 5 menit, dan logging.
3. **Apps Script Storage**: Apps Script HANYA bertugas membaca/menulis Spreadsheet dan mengunggah berkas ke Google Drive.
4. **Dynamic Schema JSON**: Field Form Step 2 dirender secara dinamis berdasarkan `field_schema` JSON pada Master Jenis Layanan dengan dukungan `schema_version`.
5. **Request ID Sequence**: Format ID `REQ-YYYY-000001` digenerate menggunakan `LockService` di Apps Script untuk mencegah kondisi balapan (*race condition*).
