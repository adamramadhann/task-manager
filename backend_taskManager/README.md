# Task Tracker Backend API

Backend REST API untuk aplikasi Task Tracker menggunakan Node.js, Express, dan Prisma ORM dengan PostgreSQL database.

## 📁 Struktur Folder

```
backend/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Prisma schema
├── src/
│   ├── controller/
│   │   ├── task.js         # Task controller
│   │   └── taskLog.js      # Task Log controller
│   ├── routes/
│   │   ├── taskRoute.js    # Task routes
│   │   └── taskLogRoute.js # Task Log routes
│   ├── conn.js             # Prisma client instance
│   └── server.js           # Main server file
├── .babelrc
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 🚀 Fitur API

### Task Management
- ✅ Create task baru
- ✅ Get all tasks dengan durasi otomatis
- ✅ Update task (semua field)
- ✅ Delete single task
- ✅ Delete multiple tasks (bulk delete)
- ✅ Auto-generate task log saat create/update

### Task Log
- ✅ Get all task logs dengan durasi kalkulasi
- ✅ Delete single task log
- ✅ Delete multiple task logs (bulk delete)
- ✅ Auto-calculate durasi saat ini dan deadline

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Additional:** 
  - CORS
  - dotenv
  - ES6 Modules

## 📋 Prerequisites

Pastikan sistem Anda sudah terinstal:

- Node.js (versi 16 atau lebih baru)
- PostgreSQL (versi 12 atau lebih baru)
- npm atau yarn

## 🔧 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd task-tracker-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/tasktracker_db"
PORT=3000
```

Ganti `username`, `password`, dan `tasktracker_db` sesuai konfigurasi PostgreSQL Anda.

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio untuk melihat data
npx prisma studio
```

### 5. Jalankan Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📊 Database Schema

### ProgresTeam Model

```prisma
model ProgresTeam {
  id               String     @id @default(uuid())
  penanggung_jawab String     // Nama anggota team
  task             String     // Nama task yang dikerjakan
  tanggalMulai     DateTime   // Tanggal mulai pengerjaan
  tanggalDeadline  DateTime   // Batas maksimal pengerjaan
  tanggalSelesai   DateTime?  // Tanggal selesai (nullable)
  status           String     // Status pengerjaan
  detail_aktivitas String?    // Detail task (nullable)
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
}
```

### TaskLog Model

```prisma
model TaskLog {
  id                String     @id @default(uuid())
  task              String     // Task yang dikerjakan
  tanggal           DateTime   // Tanggal pembuatan
  detail_aktivitas  String     // Detail aktivitas
  tanggalSelesai    DateTime   // Tanggal selesai/deadline
  status            String     // Status pengerjaan
}
```

## 🔌 API Endpoints

### Task Endpoints

#### 1. Create Task
```http
POST /api/task-created
Content-Type: application/json

{
  "penanggung_jawab": "John Doe",
  "task": "Membuat fitur login",
  "tanggalMulai": "2025-01-01",
  "tanggalDeadline": "2025-01-15",
  "detail_aktivitas": "Implementasi authentication"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task berhasil dibuat",
  "data": {
    "id": "uuid",
    "penanggung_jawab": "John Doe",
    "task": "Membuat fitur login",
    "tanggalMulai": "2025-01-01T00:00:00.000Z",
    "tanggalDeadline": "2025-01-15T00:00:00.000Z",
    "status": "Sedang Dikerjakan",
    "durasi": "14 hari"
  }
}
```

#### 2. Get All Tasks
```http
GET /api/get-task
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "penanggung_jawab": "John Doe",
      "task": "Membuat fitur login",
      "tanggalMulai": "2025-01-01T00:00:00.000Z",
      "tanggalDeadline": "2025-01-15T00:00:00.000Z",
      "status": "Sedang Dikerjakan",
      "durasi": "14 hari"
    }
  ]
}
```

#### 3. Update Task
```http
PUT /api/task-updated/:id
Content-Type: application/json

{
  "penanggung_jawab": "John Doe",
  "task": "Membuat fitur login - Updated",
  "tanggalMulai": "2025-01-01",
  "tanggalDeadline": "2025-01-20",
  "detail_aktivitas": "Implementasi authentication dengan JWT",
  "status": "Selesai"
}
```

#### 4. Delete Single Task
```http
DELETE /api/deleted-task/:id
```

#### 5. Delete Multiple Tasks
```http
POST /api/task/delete-multiple
Content-Type: application/json

{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "status": true,
  "message": "3 Data berhasil dihapus"
}
```

### Task Log Endpoints

#### 1. Get All Task Logs
```http
GET /api/get-task-log
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "task": "Membuat fitur login",
      "tanggal": "2025-01-01T00:00:00.000Z",
      "detail_aktivitas": "Implementasi authentication",
      "tanggalSelesai": "2025-01-15T00:00:00.000Z",
      "status": "Sedang Dikerjakan",
      "durasi_deadline": "14 hari",
      "durasi_saat_ini": "5 hari"
    }
  ]
}
```

#### 2. Delete Single Task Log
```http
DELETE /api/task-log/:id
```

#### 3. Delete Multiple Task Logs
```http
POST /api/task-log/delete-multiple
Content-Type: application/json

{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

## 🎯 Status Task

API mendukung status berikut:
- `Task Dibatalkan`
- `Sedang Dikerjakan` (default saat create)
- `Sedang Direvisi`
- `Blocked`
- `Selesai`

## ✨ Fitur Otomatis

### 1. Auto-Generate Task Log
Setiap kali task dibuat atau diupdate, otomatis membuat entry baru di TaskLog:
```javascript
await db.taskLog.create({
  data: {
    task: newTask.task,
    tanggal: newTask.tanggalMulai,
    detail_aktivitas: newTask.detail_aktivitas || '-',
    tanggalSelesai: newTask.tanggalDeadline,
    status: newTask.status,
  },
});
```

### 2. Auto-Calculate Durasi
- **Durasi Task:** Otomatis dihitung dari tanggalMulai ke tanggalDeadline
- **Durasi Saat Ini:** Dihitung dari tanggalMulai sampai waktu sekarang
- **Durasi Deadline:** Dihitung dari tanggalMulai sampai tanggalSelesai

### 3. Auto-Set tanggalSelesai
Jika status diubah menjadi "Selesai", otomatis set tanggalSelesai ke waktu sekarang:
```javascript
tanggalSelesai: status === 'Selesai' ? new Date() : existingTask.tanggalSelesai
```

## 🔒 Validasi

### Create/Update Task Validation
- ✅ Semua field wajib diisi (kecuali detail_aktivitas)
- ✅ tanggalDeadline harus setelah tanggalMulai
- ✅ Format tanggal harus valid

### Delete Validation
- ✅ Cek keberadaan data sebelum delete
- ✅ Validasi array IDs untuk bulk delete
- ✅ Return error jika data tidak ditemukan

## 🐛 Error Handling

Semua endpoint memiliki error handling yang konsisten:

```json
{
  "success": false,
  "message": "Deskripsi error",
  "error": "Error detail (development only)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Development

### Prisma Commands

```bash
# Generate Prisma Client setelah perubahan schema
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (CAUTION: will delete all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Format Prisma schema
npx prisma format
```

## 📝 Scripts

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "prisma:generate": "npx prisma generate",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:studio": "npx prisma studio"
  }
}
```

## 🔍 Testing

### Manual Testing dengan cURL

```bash
# Test Create Task
curl -X POST http://localhost:3000/api/task-created \
  -H "Content-Type: application/json" \
  -d '{
    "penanggung_jawab": "Test User",
    "task": "Test Task",
    "tanggalMulai": "2025-01-01",
    "tanggalDeadline": "2025-01-10",
    "detail_aktivitas": "Testing"
  }'

# Test Get All Tasks
curl http://localhost:3000/api/get-task
```

### Testing dengan Postman/Thunder Client
1. Import collection dari file
2. Set base URL ke `http://localhost:3000`
3. Test semua endpoints

## 🚀 Deployment

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create task-tracker-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

Made with ❤️ using Node.js + Express + Prisma