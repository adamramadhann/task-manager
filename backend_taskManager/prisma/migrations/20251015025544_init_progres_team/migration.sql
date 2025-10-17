-- CreateTable
CREATE TABLE "ProgresTeam" (
    "id" TEXT NOT NULL,
    "penanggung_jawab" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "detail_aktivitas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgresTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskLog" (
    "id" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "detail_aktivitas" TEXT NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "progresTeamId" TEXT NOT NULL,

    CONSTRAINT "TaskLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskLog" ADD CONSTRAINT "TaskLog_progresTeamId_fkey" FOREIGN KEY ("progresTeamId") REFERENCES "ProgresTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
