import { Router } from 'express';
import TaskController from '../controller/task.js';

const taskRoute = Router();

taskRoute.post('/task-created', TaskController.createTask); // untuk created task
taskRoute.get('/get-task', TaskController.getAllTasks); // untuk ambil data task
taskRoute.put("/task-updated/:id", TaskController.editTask); // untuk edit task
taskRoute.delete('/deleted-task/:id', TaskController.deletedTask); // untuk deleted task
taskRoute.post('/task/delete-multiple', TaskController.deletedTaskMany); // untuk deleted banyak task

export default taskRoute;