import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import passport from "passport";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const saltrounds = 10;

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(saltrounds);
    const password_hash = await bcrypt.hash(password, salt);

    const userRole = role && role === "admin" ? "admin" : "member";

    const values = await pool.query(
      "INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *",
      [name, email, password_hash, userRole]
    );

    return res.status(201).json(values.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Both email and password are required" });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!userResult) {
      return res.status(400).json({ message: " Invalid credentials " });
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query(
      "INSERT INTO refresh_tokens (token, user_id) VALUES ($1, $2)",
      [refreshToken, user.id]
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: `Logged in successfully! as ${user.name}`,
      token: accessToken,
      name: user.name,
      email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const {accessToken, refreshToken} = req.user;
    
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`http://localhost:5173/oauth-success?token=${accessToken}`);
  }
);

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token missing" });

  const tokenRes = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = $1",
    [refreshToken]
  );
  if (tokenRes.rows.length === 0)
    return res.status(403).json({ message: "Invalid token" });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(payload);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Token expired" });
  }
});



router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      message: "You are not authenticated for logging out, login first",
    });
  };

  await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [
    refreshToken,
  ]);
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
});

// Add the missing /me route
router.get("/me", async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Get user from database
    const userResult = await pool.query(
      "SELECT id, name, email, avatar, role FROM users WHERE id = $1",
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    return res.json(user);
    
  } catch (error) {
    console.error("Error in /me route:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
