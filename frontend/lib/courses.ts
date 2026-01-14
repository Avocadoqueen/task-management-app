export interface Task {
  id: string
  title: string
  description: string
  type: "assignment" | "test" | "exam" | "project"
  dueDate: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  submissionUrl?: string // Added for assignment submissions
}

export interface Course {
  id: string
  code: string
  name: string
  lecturer: string
  tasks: Task[]
}

// Mock courses data
export const mockCourses: Course[] = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Computer Science",
    lecturer: "Dr. Sarah Johnson",
    tasks: [
      {
        id: "1",
        title: "Assignment 1: Basic Programming",
        description: "Complete the basic programming exercises covering variables, loops, and functions.",
        type: "assignment",
        dueDate: "2024-02-15",
        status: "pending",
        priority: "high",
      },
      {
        id: "2",
        title: "Midterm Exam",
        description: "Covers chapters 1-5",
        type: "exam",
        dueDate: "2024-02-20",
        status: "pending",
        priority: "high",
      },
    ],
  },
  {
    id: "2",
    code: "MATH201",
    name: "Calculus II",
    lecturer: "Prof. Michael Chen",
    tasks: [
      {
        id: "3",
        title: "Problem Set 3",
        description: "Integration problems from chapter 7",
        type: "assignment",
        dueDate: "2024-02-18",
        status: "in-progress",
        priority: "medium",
      },
      {
        id: "4",
        title: "Quiz 2",
        description: "Derivatives and limits",
        type: "test",
        dueDate: "2024-02-22",
        status: "pending",
        priority: "medium",
      },
    ],
  },
  {
    id: "3",
    code: "ENG105",
    name: "English Composition",
    lecturer: "Dr. Emily Watson",
    tasks: [
      {
        id: "5",
        title: "Essay: Literary Analysis",
        description: "Analyze a chosen novel from the reading list",
        type: "assignment",
        dueDate: "2024-02-25",
        status: "pending",
        priority: "high",
      },
    ],
  },
  {
    id: "4",
    code: "PHYS150",
    name: "Physics I",
    lecturer: "Dr. Robert Lee",
    tasks: [
      {
        id: "6",
        title: "Lab Report 2",
        description: "Newton's Laws experiment",
        type: "assignment",
        dueDate: "2024-02-16",
        status: "completed",
        priority: "low",
      },
      {
        id: "7",
        title: "Final Exam",
        description: "Comprehensive final exam covering all topics",
        type: "exam",
        dueDate: "2024-03-15",
        status: "pending",
        priority: "high",
      },
    ],
  },
]

export interface Announcement {
  id: string
  courseId: string
  title: string
  content: string
  createdAt: string
  createdBy: string
}

if (typeof window !== "undefined") {
  const savedCourses = localStorage.getItem("courses")
  if (savedCourses) {
    try {
      const parsed = JSON.parse(savedCourses)
      mockCourses.splice(0, mockCourses.length, ...parsed)
    } catch (e) {
      console.error("Failed to parse saved courses", e)
    }
  }
}

export function getCourses(): Course[] {
  return mockCourses
}

export function getCourseById(id: string): Course | undefined {
  return mockCourses.find((course) => course.id === id)
}

export function getAllTasks(): Task[] {
  return mockCourses.flatMap((course) => course.tasks)
}

export function getUpcomingTasks(): Task[] {
  const now = new Date()
  return getAllTasks()
    .filter((task) => task.status !== "completed" && new Date(task.dueDate) >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}

export function updateTaskStatus(courseId: string, taskId: string, status: Task["status"]) {
  const course = mockCourses.find((c) => c.id === courseId)
  if (course) {
    const task = course.tasks.find((t) => t.id === taskId)
    if (task) {
      task.status = status
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("courses", JSON.stringify(mockCourses))
      }
    }
  }
}

export function submitAssignment(courseId: string, taskId: string, submissionUrl: string) {
  const course = mockCourses.find((c) => c.id === courseId)
  if (course) {
    const task = course.tasks.find((t) => t.id === taskId)
    if (task) {
      task.status = "completed"
      task.submissionUrl = submissionUrl // Save the submission URL
      if (typeof window !== "undefined") {
        localStorage.setItem("courses", JSON.stringify(mockCourses))
      }
    }
  }
}

export function addTask(courseId: string, task: Omit<Task, "id">) {
  const course = mockCourses.find((c) => c.id === courseId)
  if (course) {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    }
    course.tasks.push(newTask)
    if (typeof window !== "undefined") {
      localStorage.setItem("courses", JSON.stringify(mockCourses))
    }
    return newTask
  }
  return null
}

const mockAnnouncements: Announcement[] = []

if (typeof window !== "undefined") {
  const savedCourses = localStorage.getItem("courses")
  if (savedCourses) {
    try {
      const parsed = JSON.parse(savedCourses)
      mockCourses.splice(0, mockCourses.length, ...parsed)
    } catch (e) {
      console.error("Failed to parse saved courses", e)
    }
  }

  const savedAnnouncements = localStorage.getItem("announcements")
  if (savedAnnouncements) {
    try {
      const parsed = JSON.parse(savedAnnouncements)
      mockAnnouncements.splice(0, mockAnnouncements.length, ...parsed)
    } catch (e) {
      console.error("Failed to parse saved announcements", e)
    }
  }
}

export function getAnnouncementsByCourse(courseId: string): Announcement[] {
  return mockAnnouncements.filter((a) => a.courseId === courseId)
}

export function addAnnouncement(announcement: Omit<Announcement, "id" | "createdAt">) {
  const newAnnouncement: Announcement = {
    ...announcement,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  mockAnnouncements.push(newAnnouncement)
  if (typeof window !== "undefined") {
    localStorage.setItem("announcements", JSON.stringify(mockAnnouncements))
  }
  return newAnnouncement
}
