export interface SystemStats {
  totalUsers: number
  totalStudents: number
  totalLecturers: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  averageCompletionRate: number
}

export interface CourseAnalytics {
  courseId: string
  courseName: string
  courseCode: string
  instructor: string
  totalStudents: number
  totalTasks: number
  averageGrade: number
  completionRate: number
  submissionRate: number
}

export interface UserActivity {
  userId: string
  userName: string
  userRole: "student" | "lecturer" | "admin"
  lastActive: Date
  tasksCompleted: number
  tasksAssigned?: number
  averageGrade?: number
}

export interface PerformanceMetrics {
  period: string
  tasksCreated: number
  tasksCompleted: number
  averageGrade: number
  activeUsers: number
}

// Mock data for admin dashboard
export const mockSystemStats: SystemStats = {
  totalUsers: 127,
  totalStudents: 98,
  totalLecturers: 28,
  totalTasks: 245,
  completedTasks: 156,
  pendingTasks: 67,
  overdueTasks: 22,
  averageCompletionRate: 73.5,
}

export const mockCourseAnalytics: CourseAnalytics[] = [
  {
    courseId: "1",
    courseName: "Computer Science Fundamentals",
    courseCode: "CS101",
    instructor: "Dr. Smith",
    totalStudents: 45,
    totalTasks: 12,
    averageGrade: 82.3,
    completionRate: 89.2,
    submissionRate: 94.1,
  },
  {
    courseId: "2",
    courseName: "Data Structures & Algorithms",
    courseCode: "CS201",
    instructor: "Prof. Johnson",
    totalStudents: 38,
    totalTasks: 15,
    averageGrade: 78.9,
    completionRate: 76.8,
    submissionRate: 87.3,
  },
  {
    courseId: "3",
    courseName: "Database Systems",
    courseCode: "CS301",
    instructor: "Dr. Williams",
    totalStudents: 32,
    totalTasks: 10,
    averageGrade: 85.1,
    completionRate: 91.4,
    submissionRate: 96.2,
  },
  {
    courseId: "4",
    courseName: "Software Engineering",
    courseCode: "CS401",
    instructor: "Prof. Brown",
    totalStudents: 28,
    totalTasks: 18,
    averageGrade: 80.7,
    completionRate: 82.6,
    submissionRate: 89.8,
  },
]

export const mockUserActivity: UserActivity[] = [
  {
    userId: "1",
    userName: "John Student",
    userRole: "student",
    lastActive: new Date("2024-11-15"),
    tasksCompleted: 8,
    averageGrade: 85.2,
  },
  {
    userId: "2",
    userName: "Dr. Smith",
    userRole: "lecturer",
    lastActive: new Date("2024-11-14"),
    tasksCompleted: 0,
    tasksAssigned: 12,
  },
  {
    userId: "3",
    userName: "Jane Doe",
    userRole: "student",
    lastActive: new Date("2024-11-13"),
    tasksCompleted: 6,
    averageGrade: 92.1,
  },
  {
    userId: "4",
    userName: "Prof. Johnson",
    userRole: "lecturer",
    lastActive: new Date("2024-11-12"),
    tasksCompleted: 0,
    tasksAssigned: 15,
  },
]

export const mockPerformanceMetrics: PerformanceMetrics[] = [
  { period: "Week 1", tasksCreated: 15, tasksCompleted: 12, averageGrade: 82.5, activeUsers: 89 },
  { period: "Week 2", tasksCreated: 18, tasksCompleted: 16, averageGrade: 79.3, activeUsers: 92 },
  { period: "Week 3", tasksCreated: 22, tasksCompleted: 19, averageGrade: 84.1, activeUsers: 95 },
  { period: "Week 4", tasksCreated: 20, tasksCompleted: 18, averageGrade: 81.7, activeUsers: 88 },
  { period: "Week 5", tasksCreated: 25, tasksCompleted: 21, averageGrade: 83.9, activeUsers: 97 },
  { period: "Week 6", tasksCreated: 19, tasksCompleted: 17, averageGrade: 86.2, activeUsers: 91 },
]

export const getTopPerformingCourses = (limit = 3): CourseAnalytics[] => {
  return mockCourseAnalytics.sort((a, b) => b.averageGrade - a.averageGrade).slice(0, limit)
}

export const getRecentUserActivity = (limit = 10): UserActivity[] => {
  return mockUserActivity
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
    .slice(0, limit)
}

export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}
