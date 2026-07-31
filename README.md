# Sistem Layanan Pendampingan Berbasis Web

Sistem layanan pendampingan berbasis web yang dibangun menggunakan **React + TypeScript + Express + Google Workspace Integration**.

---

## 🏗️ Struktur Project

```
project/
├── frontend/             # React + TypeScript + Material UI 3 + React Router
│   ├── src/
│   │   ├── assets/
│   │   ├── components/   # Navbar, Sidebar, PageContainer, Loading, ErrorBoundary
│   │   ├── context/      # AppContext
│   │   ├── hooks/        # useApi Hook
│   │   ├── layouts/      # PublicLayout & AdminLayout
│   │   ├── pages/        # LandingPage, NotFoundPage, AdminPlaceholderPage
│   │   ├── routes/       # AppRoutes
│   │   ├── services/     # ApiClient
│   │   ├── styles/
│   │   ├── theme/        # MUI Global Theme Provider
│   │   ├── types/
│   │   └── utils/
├── backend/              # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # Environment & App Config
│   │   ├── controllers/  # Health, JenisLayanan, Submit, Admin Controllers
│   │   ├── middleware/   # Logger, RateLimiter, Auth, NotFound, ErrorHandler
│   │   ├── routes/       # Health, JenisLayanan, Submit, Admin Routes
│   │   ├── services/     # AppScriptService Gateway
│   │   ├── types/
│   │   ├── utils/
│   │   └── validators/
│   ├── app.ts
├── apps-script/          # Google Apps Script Web App Skeleton
│   ├── Code.gs           # Web App Handler (doGet / doPost)
│   ├── Config.gs         # Constants & Sheet Names
│   ├── Routes.gs         # Action Router
│   ├── MasterService.gs
│   ├── RequestService.gs
│   ├── SpreadsheetService.gs
│   ├── DriveService.gs
│   ├── LockService.gs     # Sequential Request ID Generator (REQ-YYYY-000001)
│   ├── Utils.gs          # Secret validator
│   └── Response.gs       # Standardized JSON Response
├── shared/               # Shared Types, Interfaces, Schemas & Constants
│   ├── constants/
│   ├── interfaces/
│   ├── schemas/
│   └── types/
├── docs/                 # Dokumentasi Arsitektur
├── server.ts             # Root Full-Stack Express Server (Port 3000)
├── package.json
└── README.md
```

---

## 🚀 Cara Menjalankan Project

### 1. Mode Development (Frontend + Backend Terintegrasi)
```bash
npm run dev
```
Perintah ini akan menjalankan server Express pada port `3000` dengan Vite Middleware aktif, menyajikan React Frontend dan Express API secara bersamaan di `http://localhost:3000`.

### 2. Mode Production Build
```bash
npm run build
npm start
```
Perintah ini mengompilasi bundel Vite frontend dan server Express ke `dist/server.cjs`, kemudian menjalankannya di Node.js.

---

## 🏛️ Penjelasan Singkat Arsitektur
- **Browser (React Frontend)** menghubungi Express Server di `/api/*`.
- **Express Backend** bertindak sebagai *Business Logic Layer*, menangani validasi input, verifikasi otorisasi, rate limiting, logging, serta Express Cache (TTL 5 menit).
- **Google Apps Script** bertindak sebagai *Data Service Layer*, bertugas khusus melakukan operasi I/O ke Google Spreadsheet dan Google Drive secara aman menggunakan autentikasi *Shared Secret* (`X-App-Secret`).
