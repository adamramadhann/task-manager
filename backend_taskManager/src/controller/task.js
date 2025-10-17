import { request, response } from 'express';
import db from '../conn.js';

class TaskController {
  // untuk membuat task 
  async createTask(req = request, res = response) {
    try {
      const { penanggung_jawab, task, tanggalMulai, tanggalDeadline, detail_aktivitas } = req.body;

      if (!penanggung_jawab || !task || !tanggalMulai || !tanggalDeadline) {
        return res.status(400).json({
          success: false,
          message: 'Data tidak lengkap. Mohon isi semua field yang diperlukan.',
        });
      }

      const startDate = new Date(tanggalMulai);
      const deadlineDate = new Date(tanggalDeadline);

      if (deadlineDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'Tanggal deadline harus setelah tanggal mulai.',
        });
      }

      const durasi = Math.ceil((deadlineDate - startDate) / (1000 * 60 * 60 * 24));

        const newTask = await db.progresTeam.create({
          data: {
            penanggung_jawab,
            task,
            tanggalMulai: startDate,
            tanggalDeadline: deadlineDate,
            tanggalSelesai: null,
            status: 'Sedang Dikerjakan',
            detail_aktivitas: detail_aktivitas || null,
          },
        });

        // untuk menyimpan output dari created task
        await db.taskLog.create({
          data: {
            task: newTask.task,
            tanggal: newTask.tanggalMulai,
            detail_aktivitas: newTask.detail_aktivitas || '-',
            tanggalSelesai: newTask.tanggalDeadline,
            status: newTask.status, 
          },
        });

      return res.status(201).json({
        success: true,
        message: 'Task berhasil dibuat',
        data: { ...newTask, durasi: `${durasi} hari` },
      });
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat membuat task',
        error: error.message,
      });
    }
  }

  // untuk ambil data task
  async getAllTasks(req, res) {
    try {
      const tasks = await db.progresTeam.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const tasksWithDuration = tasks.map((task) => {
        const durasi = Math.ceil(
          (new Date(task.tanggalDeadline) - new Date(task.tanggalMulai)) / (1000 * 60 * 60 * 24)
        );
        return { ...task, durasi: `${durasi} hari` };
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

  // untuk edited task
  async editTask(req = request, res = response) {
    try {
      const { id } = req.params;
      const { penanggung_jawab, task, tanggalMulai, tanggalDeadline, detail_aktivitas, status } = req.body;
  
      const existingTask = await db.progresTeam.findUnique({ where: { id } });
      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: 'Task tidak ditemukan',
        });
      }
  
      if (!penanggung_jawab || !task || !tanggalMulai || !tanggalDeadline) {
        return res.status(400).json({
          success: false,
          message: 'Data tidak lengkap. Mohon isi semua field yang diperlukan.',
        });
      }
  
      const startDate = new Date(tanggalMulai);
      const deadlineDate = new Date(tanggalDeadline);
  
      if (deadlineDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'Tanggal deadline harus setelah tanggal mulai.',
        });
      }
  
      const updatedTask = await db.progresTeam.update({
        where: { id },
        data: {
          penanggung_jawab,
          task,
          tanggalMulai: startDate,
          tanggalDeadline: deadlineDate,
          detail_aktivitas: detail_aktivitas || null,
          status: status || existingTask.status,
          tanggalSelesai: status === 'Selesai' ? new Date() : existingTask.tanggalSelesai,
        },
      });
  
      await db.taskLog.create({
        data: {
          task: updatedTask.task,
          tanggal: updatedTask.tanggalMulai,
          detail_aktivitas: updatedTask.detail_aktivitas || '-',
          tanggalSelesai: updatedTask.tanggalDeadline,
          status: updatedTask.status,
        },
      });
  
      const durasi = Math.ceil(
        (new Date(updatedTask.tanggalDeadline) - new Date(updatedTask.tanggalMulai)) /
          (1000 * 60 * 60 * 24)
      );
  
      return res.status(200).json({
        success: true,
        message: 'Task berhasil diperbarui dan log disimpan',
        data: { ...updatedTask, durasi: `${durasi} hari` },
      });
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memperbarui task',
        error: error.message,
      });
    }
  }

  // untuk deleted task
  async deletedTask(req = request, res = response) {
    const { id}  = req.params;
    try {
      const result = await db.progresTeam.findUnique({
        where : { id }
      })

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Data tidak ditemukan"
        });
      }

      await db.progresTeam.delete({
        where : { id }
      })
      
      
      
      return res.json({
        status: true,
        message: "Data berhasil dihapus"
      });

    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  }

  // untuk deleted banyak task
  async deletedTaskMany(req = request, res = response) {
    try {

      const { ids } = req.body

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Harap sertakan array ID Task yang akan dihapus",
        });
      }

      const found = await db.progresTeam.findMany({
        where: { id: { in: ids } },
        select: { id: true },
      });
  
      if (found.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Semua data sudah dihapus sebelumnya atau tidak ditemukan",
        });
      }
  
      const existingIds = found.map((item) => item.id);
      await db.progresTeam.deleteMany({
        where: { id: { in: existingIds } },
      });

      return res.json({
        status: true,
        message: `${existingIds.length} Data berhasil dihapus`
      });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  }
}

export default new TaskController();