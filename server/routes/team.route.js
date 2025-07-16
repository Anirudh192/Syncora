import express from 'express';
import { createTeam, inviteMember, getTeamDetails, getMyTeam } from '../controllers/team.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

//POST /api/teams: Make a new team.

// POST /api/teams/:id/invite: Add someone to the team.

// GET /api/teams/:id: View a team's info.

//GET /api/list : List all the teams for current user

const router = express.Router();

router.get('/list', authMiddleware, getMyTeam);
router.get('/:teamId', authMiddleware, getTeamDetails);
router.post('/create', authMiddleware, createTeam);
router.post('/:teamId/invite', authMiddleware, inviteMember);

export default router;