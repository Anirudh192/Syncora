import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role, avatar: user.avatar? user.avatar:"", email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role, avatar: user.avatar? user.avatar:"", email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};
