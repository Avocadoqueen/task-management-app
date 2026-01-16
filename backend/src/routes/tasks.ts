import { Router } from "express";
import prisma from "../prismaClient";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    const tasks = await prisma.task.findMany({
      where: Number.isFinite(userId) ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      userId,
      status,
      priority,
      course,
      assignedBy,
      dueDate,
      submissionUrl,
      grade,
      feedback,
    } = req.body;
    if (!title) return res.status(400).json({ error: "title required" });
    const parsedUserId = Number(userId);
    const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        course,
        assignedBy,
        dueDate: parsedDueDate,
        userId: Number.isFinite(parsedUserId) ? parsedUserId : undefined,
        completed: status === "completed",
        submissionUrl,
        grade,
        feedback,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Failed to create task" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      title,
      description,
      status,
      priority,
      course,
      assignedBy,
      dueDate,
      userId,
      submissionUrl,
      grade,
      feedback,
    } = req.body;
    const parsedUserId = Number(userId);
    const data: Record<string, any> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) {
      data.status = status;
      data.completed = status === "completed";
    }
    if (priority !== undefined) data.priority = priority;
    if (course !== undefined) data.course = course;
    if (assignedBy !== undefined) data.assignedBy = assignedBy;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (Number.isFinite(parsedUserId)) data.userId = parsedUserId;
    if (submissionUrl !== undefined) data.submissionUrl = submissionUrl;
    if (grade !== undefined) data.grade = grade;
    if (feedback !== undefined) data.feedback = feedback;
    const task = await prisma.task.update({ where: { id }, data });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: "Failed to update task" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.task.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: "Failed to delete task" });
  }
});

export default router;
