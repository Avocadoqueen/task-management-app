export interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  enrolledCourses: string[]
}

export interface Submission {
  id: string
  taskId: string
  studentId: string
  studentName: string
  submittedAt: Date
  status: "submitted" | "graded" | "late"
  grade?: number
  feedback?: string
  fileUrl?: string
}

export interface ClassStats {
  totalStudents: number
  submittedCount: number
  gradedCount: number
  averageGrade: number
  lateSubmissions: number
}

// Mock data for lecturer dashboard
export const mockStudents: Student[] = [
  { id: "1", name: "John Student", email: "john@university.edu", enrolledCourses: ["CS101", "CS201"] },
  { id: "2", name: "Jane Doe", email: "jane@university.edu", enrolledCourses: ["CS101", "CS301"] },
  { id: "3", name: "Mike Johnson", email: "mike@university.edu", enrolledCourses: ["CS201", "CS401"] },
  { id: "4", name: "Sarah Wilson", email: "sarah@university.edu", enrolledCourses: ["CS101", "CS201", "CS301"] },
  { id: "5", name: "David Brown", email: "david@university.edu", enrolledCourses: ["CS301", "CS401"] },
]

export const mockSubmissions: Submission[] = [
  {
    id: "1",
    taskId: "1",
    studentId: "1",
    studentName: "John Student",
    submittedAt: new Date("2024-11-12"),
    status: "graded",
    grade: 85,
    feedback: "Good work! Consider optimizing the algorithm for better performance.",
  },
  {
    id: "2",
    taskId: "1",
    studentId: "2",
    studentName: "Jane Doe",
    submittedAt: new Date("2024-11-13"),
    status: "graded",
    grade: 92,
    feedback: "Excellent implementation with proper error handling.",
  },
  {
    id: "3",
    taskId: "1",
    studentId: "4",
    studentName: "Sarah Wilson",
    submittedAt: new Date("2024-11-14"),
    status: "submitted",
  },
  {
    id: "4",
    taskId: "2",
    studentId: "1",
    studentName: "John Student",
    submittedAt: new Date("2024-11-15"),
    status: "submitted",
  },
  {
    id: "5",
    taskId: "4",
    studentId: "3",
    studentName: "Mike Johnson",
    submittedAt: new Date("2024-11-08"),
    status: "graded",
    grade: 95,
    feedback: "Outstanding work! Very comprehensive test coverage.",
  },
]

export const getSubmissionsByTask = (taskId: string): Submission[] => {
  return mockSubmissions.filter((submission) => submission.taskId === taskId)
}

export const getClassStats = (taskId: string): ClassStats => {
  const submissions = getSubmissionsByTask(taskId)
  const totalStudents = mockStudents.length
  const submittedCount = submissions.length
  const gradedCount = submissions.filter((s) => s.status === "graded").length
  const grades = submissions.filter((s) => s.grade !== undefined).map((s) => s.grade!)
  const averageGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0
  const lateSubmissions = submissions.filter((s) => s.status === "late").length

  return {
    totalStudents,
    submittedCount,
    gradedCount,
    averageGrade,
    lateSubmissions,
  }
}

export const getRecentSubmissions = (limit = 5): Submission[] => {
  return mockSubmissions
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, limit)
}

export const getPendingGrading = (): Submission[] => {
  return mockSubmissions.filter((submission) => submission.status === "submitted")
}
