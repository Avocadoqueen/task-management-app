import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import tasksRoutes from "./routes/tasks";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ status: "ok", message: "Backend running. Use /health or /api/*" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

export default app;
