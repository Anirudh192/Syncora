import env from "dotenv";
env.config();

import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors"
import http from "http"

import passport from "./config/passport.js";
import authRoute from "./routes/auth.route.js";
import protectedRoute from "./routes/protected.route.js";
import userRoute from "./routes/user.route.js";
import teamRoute from "./routes/team.route.js"
import projectRoute from "./routes/project.route.js"
import taskRoute from './routes/task.route.js'
import { initSocket } from './socket/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({ secret: "keyboardcat", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api", protectedRoute);
app.use("/api/users", userRoute);
app.use('/api/teams', teamRoute);
app.use('/api/projects', projectRoute);
app.use('/api/tasks', taskRoute);

const server = http.createServer(app);

global.io = initSocket(server);

app.get("/", (req, res) => {
  res.send("<h1>HOLA</h1>");
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
