import { Router } from 'express';
import TaskLogController from '../controller/taskLog.js';

const taskLogRoute = Router();

taskLogRoute.get('/get-task-log', TaskLogController.getAllTasksLogs); // untuk get data task
taskLogRoute.delete("/task-log/:id", TaskLogController.deleteTaskLogById); // untuk Hapus satu
taskLogRoute.post("/task-log/delete-multiple", TaskLogController.deleteMultipleTaskLogs); // untuk Hapus banyak

export default taskLogRoute;