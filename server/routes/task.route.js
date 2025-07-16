import express from 'express';
import { createTask, getTasksByProject, updateTask, deleteTask, getTasksAssignedToMe } from '../controllers/task.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getTasksAssignedToMe)
router.get('/project/:projectId', authMiddleware, getTasksByProject);
router.post('/project/:projectId', authMiddleware, createTask);
router.put('/:taskId', authMiddleware, updateTask);
router.delete('/:taskId', authMiddleware, deleteTask);

export default router;
