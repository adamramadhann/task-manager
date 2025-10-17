# Task Tracker Dashboard

Aplikasi dashboard manajemen task berbasis React + TypeScript dengan Ant Design untuk memantau progress tim dan aktivitas task.

## 📁 Struktur Folder

```
task-tracker/
├── node_modules/          # Dependencies
├── public/                # Static assets
├── src/
│   ├── assets/           # Images, fonts, etc
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   └── dashboard/
│   │       ├── Header.tsx
│   │       ├── Home.tsx
│   │       ├── ProgresTeamPage.tsx
│   │       ├── Sidebar.tsx
│   │       └── TaskLogPage.tsx
│   ├── App.tsx           # Main app component
│   ├── index.css         # Global styles
│   ├── layout.tsx        # Dashboard layout
│   └── main.tsx          # Entry point
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🚀 Fitur

- ✅ Dashboard overview dengan statistik task
- ✅ Manajemen progress tim (CRUD operations)
- ✅ Task log dengan filter tanggal
- ✅ Authentication dengan session storage
- ✅ Responsive design
- ✅ Real-time data dari API

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Ant Design
- **Icons:** Lucide React
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS

## 📋 Prerequisites

Pastikan sistem Anda sudah terinstal:

- Node.js (versi 16 atau lebih baru)
- npm atau yarn
- Backend API berjalan di `http://localhost:3000`

## 🔧 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd task-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Pastikan backend API sudah berjalan di `http://localhost:3000` dengan endpoint:

- `GET /api/get-task` - Mengambil daftar task
- `GET /api/get-task-log` - Mengambil task log
- `POST /api/task-created` - Membuat task baru
- `PUT /api/task-updated/:id` - Update task
- `POST /api/task/delete-multiple` - Hapus multiple task
- `POST /api/task-log/delete-multiple` - Hapus multiple task log

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`


## 📦 Scripts

```bash
# Development
npm run dev          # Jalankan dev server

# Build
npm run build        # Build untuk production

# Preview
npm run preview      # Preview production build

# Lint
npm run lint         # Check code quality
```

## 🔐 Login

Default credentials (sesuaikan dengan backend Anda):
- Username: `admin`
- Password: `password`

## 📱 Halaman & Fitur

### 1. Dashboard (Home)
- Statistik task (berjalan, selesai)
- Jumlah anggota tim
- Member paling aktif
- Task terbaru (3 terakhir)
- Aktivitas terbaru (3 terakhir)

### 2. Progress Team
- Tabel daftar semua task
- Filter berdasarkan status
- Create task baru
- Edit task
- Delete multiple tasks
- Status: Task Dibatalkan, Sedang Dikerjakan, Sedang Direvisi, Blocked, Selesai

### 3. Task Log
- Riwayat aktivitas task
- Filter berdasarkan tanggal
- Delete multiple logs
- Informasi durasi dan deadline

## 🎨 Komponen Utama

### Header
- Notifikasi
- User profile
- Tanggal saat ini

### Sidebar
- Navigasi menu
- Settings
- Logout

### Layout
- Dashboard layout wrapper
- Responsive sidebar + header

## 🔄 API Integration

Aplikasi ini terintegrasi dengan REST API. Contoh struktur data:

**Task Object:**
```typescript
{
  id: string;
  penanggung_jawab: string;
  task: string;
  tanggalMulai: string;
  tanggalDeadline: string;
  status: Status;
  detail_aktivitas: string;
}
```

**Task Log Object:**
```typescript
{
  id: number;
  tanggal: string;
  detail_aktivitas: string;
  durasi_saat_ini: string;
  durasi_deadline: string;
  status: string;
}
```

## 🐛 Troubleshooting

### Port sudah digunakan
```bash
# Ubah port di vite.config.ts
export default defineConfig({
  server: {
    port: 3001 // Ganti port sesuai kebutuhan
  }
})
```

### API Connection Error
- Pastikan backend berjalan di `http://localhost:3000`
- Check CORS configuration di backend
- Pastikan endpoint API sesuai


## 📊 Status Task

Aplikasi mendukung 5 status task:

1. **Task Dibatalkan** - Task yang dibatalkan
2. **Sedang Dikerjakan** - Task yang sedang dalam progress
3. **Sedang Direvisi** - Task yang perlu revisi
4. **Blocked** - Task yang terhambat
5. **Selesai** - Task yang sudah selesai

## 🔒 Security

- Authentication menggunakan session storage

---

Made with ❤️ using React + TypeScript + Ant Design