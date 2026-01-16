import { Router } from "express";

const router = Router();

// Minimal auth stubs: replace with real auth + DB
router.post("/login", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });
  res.json({ token: "dev-token", user: { id: 1, email } });
});

router.post("/register", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });
  res.status(201).json({ id: 1, email });
});

export default router;
