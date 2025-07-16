import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json({ 
    message: `Hello ${req.user.name} this is a protected route!`,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role
    }
  });
});

export default router;
