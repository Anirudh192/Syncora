import express from 'express';
import { createProject, deleteProjectByTeamId, deleteProjectById, listProjects, listProjectsByTeamId } from "../controllers/project.controller.js"
import authMiddleware from '../middlewares/auth.middleware.js';

// POST /api/project: Add a project to a team.
const router = express.Router();

router.get('/list', authMiddleware, listProjects);
router.get('/:teamId', authMiddleware, listProjectsByTeamId);
router.post('/create/:teamId', authMiddleware, createProject);
router.delete('/project/:projectId', authMiddleware, deleteProjectById);
router.delete('/:teamId', authMiddleware, deleteProjectByTeamId);

export default router;