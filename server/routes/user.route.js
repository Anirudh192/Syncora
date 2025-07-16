import { Router } from 'express';
import { getAllUsers, getUserDeets } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from "../middlewares/admin.middleware.js"

const router = Router();

router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:userId',authMiddleware,getUserDeets);

export default router;
