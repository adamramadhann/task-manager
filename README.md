# Task Tracker - Full Stack Application

Aplikasi manajemen task lengkap dengan Frontend (React + TypeScript) dan Backend (Node.js + Express + Prisma) untuk memantau progress tim dan aktivitas task.

## 📁 Struktur Repository

```
task-manager-fullstack/
├── backend_taskManager/       # Backend API (Node.js + Express + Prisma)
│   ├── prisma/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── README.md             # Backend documentation
│
├── frontend_taskManager/     # Frontend App (React + TypeScript + Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md             # Frontend documentation
│
└── README.md                 # This file (Main documentation)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm atau yarn

### Clone Repository

```bash
git clone <repository-url>
cd task-manager-fullstack
```

## 📦 Setup Backend

```bash
# Masuk ke folder backend
cd backend_taskManager

# Install dependencies
npm install

# Setup environment variables
# Buat file .env dengan konfigurasi:
# DATABASE_URL="postgresql://username:password@localhost:5432/tasktracker_db"
# PORT=3000

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Jalankan server
npm run dev
```

Backend akan berjalan di: `http://localhost:3000`

**Dokumentasi lengkap Backend:** [backend_taskManager/README.md](./backend_taskManager/README.md)

## 🎨 Setup Frontend

```bash
# Masuk ke folder frontend
cd frontend_taskManager

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

**Dokumentasi lengkap Frontend:** [frontend_taskManager/README.md](./frontend_taskManager/README.md)

## 🔄 Menjalankan Full Stack

### Terminal 1 - Backend
```bash
cd backend_taskManager
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend_taskManager
npm run dev
```

Akses aplikasi di browser: `http://localhost:5173`

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Ant Design
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Styling:** Tailwind CSS

## ✨ Fitur Aplikasi

- ✅ **Authentication** - Login dengan session storage
- ✅ **Dashboard** - Overview statistik dan aktivitas tim
- ✅ **Task Management** - CRUD operations untuk task
- ✅ **Task Log** - Riwayat aktivitas dengan filter tanggal
- ✅ **Auto-calculate Duration** - Kalkulasi otomatis durasi task
- ✅ **Bulk Delete** - Hapus multiple data sekaligus
- ✅ **Responsive Design** - Mobile friendly
- ✅ **Real-time Updates** - Data dari API secara real-time

## 📊 Database Schema

### ProgresTeam
```
- id (UUID)
- penanggung_jawab (String)
- task (String)
- tanggalMulai (DateTime)
- tanggalDeadline (DateTime)
- tanggalSelesai (DateTime?)
- status (String)
- detail_aktivitas (String?)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### TaskLog
```
- id (UUID)
- task (String)
- tanggal (DateTime)
- detail_aktivitas (String)
- tanggalSelesai (DateTime)
- status (String)
```

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/task-created` | Create task baru |
| GET | `/api/get-task` | Get all tasks |
| PUT | `/api/task-updated/:id` | Update task |
| DELETE | `/api/deleted-task/:id` | Delete single task |
| POST | `/api/task/delete-multiple` | Delete multiple tasks |
| GET | `/api/get-task-log` | Get all task logs |
| DELETE | `/api/task-log/:id` | Delete single log |
| POST | `/api/task-log/delete-multiple` | Delete multiple logs |

## 🔐 Default Login

untuk login bisa copy teks di bawah button submit nyaa
```
Username: manager
Password: manager321
```


## 📝 Development Workflow

### 1. Membuat Perubahan Database Schema

```bash
cd backend_taskManager

# Edit file: prisma/schema.prisma
# Lalu jalankan:
npx prisma migrate dev --name nama_migration
npx prisma generate
```

### 2. Testing API

```bash
# Gunakan Thunder Client, Postman, atau cURL
curl http://localhost:3000/api/get-task
```

### 3. Build untuk Production

**Backend:**
```bash
cd backend_taskManager
npm run build
npm start
```

**Frontend:**
```bash
cd frontend_taskManager
npm run build
npm run preview
```


## 📚 Dokumentasi Lengkap

- **Backend:** [backend_taskManager/README.md](./backend_taskManager/README.md)
  - API endpoints detail
  - Database schema
  - Prisma commands
  - Deployment guide
  
- **Frontend:** [frontend_taskManager/README.md](./frontend_taskManager/README.md)
  - Component structure
  - State management
  - Styling guide
  - Build configuration
---

 
### Untuk Pengguna Baru:

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd task-manager-fullstack
   ```

2. **Setup Backend:**
   ```bash
   cd backend_taskManager
   npm install
   # Setup .env file dengan DATABASE_URL
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

3. **Setup Frontend (terminal baru):**
   ```bash
   cd frontend_taskManager
   npm install
   npm run dev
   ```

4. **Akses aplikasi:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

Untuk dokumentasi detail, lihat README.md di masing-masing folder!

---
