import { request, response } from "express";
import db from "../conn.js";

class TaskLogController {
    // untuk ambil data TaskLog 
    async getAllTasksLogs(req, res = response) {
        try {
          const tasks = await db.taskLog.findMany({
            orderBy: { tanggal: 'desc' },
          });
      
          const tasksWithDuration = tasks.map((task) => {
            const startDate = new Date(task.tanggal);  
            const endDate = task.tanggalSelesai ? new Date(task.tanggalSelesai) : null;
            const now = new Date();
      
            const durasiDeadline = endDate
              ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
              : 0;
      
            const durasiSekarang = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      
            return {
              ...task,
              durasi_deadline: durasiDeadline ? `${durasiDeadline} hari` : 'Belum selesai',
              durasi_saat_ini: `${durasiSekarang} hari`,
            };
          });
      
          return res.status(200).json({ success: true, data: tasksWithDuration });
        } catch (error) {
          console.error('Error getting tasks:', error);
          return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data task',
            error: error.message,
          });
        }
    }

    // untuk Hapus satu TaskLog 
    async deleteTaskLogById(req = request, res = response) {
        try {
        const { id } = req.params;

        const log = await db.taskLog.findUnique({ where: { id } });

        if (!log) {
            return res.status(404).json({
            success: false,
            message: "TaskLog tidak ditemukan",
            });
        }

        await db.taskLog.delete({ where: { id } });

        return res.status(200).json({
            success: true,
            message: "TaskLog berhasil dihapus",
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus TaskLog",
            error: error.message,
        });
        }
    }

    // untuk Hapus banyak TaskLog
    async deleteMultipleTaskLogs(req = request, res = response) {
        try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
            success: false,
            message: "Harap sertakan array ID TaskLog yang akan dihapus",
            });
        }

        await db.taskLog.deleteMany({
            where: { id: { in: ids } },
        });

        return res.status(200).json({
            success: true,
            message: `${ids.length} TaskLog berhasil dihapus`,
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus TaskLog",
            error: error.message,
        });
        }
    }
}

export default new TaskLogController();