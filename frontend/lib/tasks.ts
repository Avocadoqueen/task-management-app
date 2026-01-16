export type TaskStatus = "pending" | "in-progress" | "completed" | "overdue"
export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: string
  title: string
  description: string
  dueDate: Date
  status: TaskStatus
  priority: TaskPriority
  course: string
  assignedBy: string
  createdAt: Date
  updatedAt: Date
  submissionUrl?: string
  grade?: number
  feedback?: string
}

export interface Course {
  id: string
  name: string
  code: string
  instructor: string
  color: string
}

// Mock data for demonstration
export const mockCourses: Course[] = [
  { id: "1", name: "Computer Science Fundamentals", code: "CS101", instructor: "Dr. Smith", color: "bg-blue-500" },
  { id: "2", name: "Data Structures & Algorithms", code: "CS201", instructor: "Prof. Johnson", color: "bg-green-500" },
  { id: "3", name: "Database Systems", code: "CS301", instructor: "Dr. Williams", color: "bg-purple-500" },
  { id: "4", name: "Software Engineering", code: "CS401", instructor: "Prof. Brown", color: "bg-orange-500" },
]

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Programming Assignment 1",
    description: "Implement a basic calculator using Python",
    dueDate: new Date("2024-12-15"),
    status: "in-progress",
    priority: "high",
    course: "CS101",
    assignedBy: "Dr. Smith",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-10"),
  },
  {
    id: "2",
    title: "Binary Search Tree Implementation",
    description: "Create a BST with insert, delete, and search operations",
    dueDate: new Date("2024-12-20"),
    status: "pending",
    priority: "medium",
    course: "CS201",
    assignedBy: "Prof. Johnson",
    createdAt: new Date("2024-11-05"),
    updatedAt: new Date("2024-11-05"),
  },
  {
    id: "3",
    title: "Database Design Project",
    description: "Design and implement a library management system database",
    dueDate: new Date("2024-12-25"),
    status: "pending",
    priority: "high",
    course: "CS301",
    assignedBy: "Dr. Williams",
    createdAt: new Date("2024-11-08"),
    updatedAt: new Date("2024-11-08"),
  },
  {
    id: "4",
    title: "Unit Testing Exercise",
    description: "Write comprehensive unit tests for the given codebase",
    dueDate: new Date("2024-12-10"),
    status: "completed",
    priority: "medium",
    course: "CS401",
    assignedBy: "Prof. Brown",
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-11-08"),
    grade: 95,
    feedback: "Excellent work! Very thorough test coverage.",
  },
  {
    id: "5",
    title: "Research Paper Review",
    description: "Review and summarize 3 research papers on machine learning",
    dueDate: new Date("2024-11-30"),
    status: "overdue",
    priority: "urgent",
    course: "CS101",
    assignedBy: "Dr. Smith",
    createdAt: new Date("2024-10-20"),
    updatedAt: new Date("2024-11-01"),
  },
]

export const getTasksByStatus = (tasks: Task[], status: TaskStatus) => {
  return tasks.filter((task) => task.status === status)
}

export const getTasksByPriority = (tasks: Task[], priority: TaskPriority) => {
  return tasks.filter((task) => task.priority === priority)
}

export const getUpcomingTasks = (tasks: Task[], days = 7) => {
  const now = new Date()
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

  return tasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    return dueDate >= now && dueDate <= futureDate && task.status !== "completed"
  })
}

export const getOverdueTasks = (tasks: Task[]) => {
  const now = new Date()
  return tasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    return dueDate < now && task.status !== "completed"
  })
}

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "urgent":
      return "text-red-600 bg-red-50 border-red-200"
    case "high":
      return "text-orange-600 bg-orange-50 border-orange-200"
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "low":
      return "text-green-600 bg-green-50 border-green-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-50 border-green-200"
    case "in-progress":
      return "text-blue-600 bg-blue-50 border-blue-200"
    case "pending":
      return "text-gray-600 bg-gray-50 border-gray-200"
    case "overdue":
      return "text-red-600 bg-red-50 border-red-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

import api from "./api"

type ApiTask = {
  id: string | number
  title: string
  description?: string | null
  dueDate?: string | null
  status?: TaskStatus | null
  priority?: TaskPriority | null
  course?: string | null
  assignedBy?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  submissionUrl?: string | null
  grade?: number | null
  feedback?: string | null
}

const normalizeTask = (task: ApiTask): Task => {
  const createdAt = task.createdAt ? new Date(task.createdAt) : new Date()
  const updatedAt = task.updatedAt ? new Date(task.updatedAt) : createdAt
  const dueDate = task.dueDate ? new Date(task.dueDate) : createdAt
  return {
    id: String(task.id),
    title: task.title,
    description: task.description ?? "",
    dueDate,
    status: task.status ?? "pending",
    priority: task.priority ?? "medium",
    course: task.course ?? "General",
    assignedBy: task.assignedBy ?? "Unassigned",
    createdAt,
    updatedAt,
    submissionUrl: task.submissionUrl ?? undefined,
    grade: task.grade ?? undefined,
    feedback: task.feedback ?? undefined,
  }
}

export const getTasks = async (userId: string): Promise<Task[]> => {
  // call backend
  const data = await api.get(`/api/tasks?userId=${encodeURIComponent(userId)}`)
  return data.map((t: ApiTask) => normalizeTask(t))
}

export const getAllTasks = async (): Promise<Task[]> => {
  const data = await api.get(`/api/tasks`)
  return data.map((t: ApiTask) => normalizeTask(t))
}

export const createTask = async (userId: string, task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
  const payload = {
    ...task,
    userId: Number.isFinite(Number(userId)) ? Number(userId) : userId,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
  }
  const created = await api.post(`/api/tasks`, payload)
  return normalizeTask(created)
}

export const updateTask = async (userId: string, taskId: string, updates: Partial<Task>): Promise<Task | null> => {
  const payload = {
    ...updates,
    userId: Number.isFinite(Number(userId)) ? Number(userId) : userId,
    dueDate: updates.dueDate ? new Date(updates.dueDate).toISOString() : updates.dueDate,
  }
  const updated = await api.put(`/api/tasks/${taskId}`, payload)
  return normalizeTask(updated)
}

export const deleteTask = async (userId: string, taskId: string): Promise<boolean> => {
  await api.del(`/api/tasks/${taskId}`)
  return true
}
