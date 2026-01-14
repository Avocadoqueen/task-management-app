export type NotificationType =
  | "deadline"
  | "task_assigned"
  | "task_completed"
  | "grade_received"
  | "system"
  | "reminder"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  actionUrl?: string
  metadata?: {
    taskId?: string
    courseId?: string
    grade?: number
    dueDate?: Date
  }
}

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "deadline",
    title: "Assignment Due Tomorrow",
    message: "Programming Assignment 1 is due tomorrow at 11:59 PM",
    isRead: false,
    createdAt: new Date("2024-11-14T10:00:00"),
    actionUrl: "/student",
    metadata: {
      taskId: "1",
      courseId: "CS101",
      dueDate: new Date("2024-12-15"),
    },
  },
  {
    id: "2",
    userId: "1",
    type: "grade_received",
    title: "Grade Posted",
    message: "Your grade for Unit Testing Exercise has been posted: 95/100",
    isRead: false,
    createdAt: new Date("2024-11-13T14:30:00"),
    actionUrl: "/student",
    metadata: {
      taskId: "4",
      courseId: "CS401",
      grade: 95,
    },
  },
  {
    id: "3",
    userId: "1",
    type: "task_assigned",
    title: "New Assignment",
    message: "Database Design Project has been assigned in CS301",
    isRead: true,
    createdAt: new Date("2024-11-12T09:15:00"),
    actionUrl: "/student",
    metadata: {
      taskId: "3",
      courseId: "CS301",
    },
  },
  {
    id: "4",
    userId: "2",
    type: "task_completed",
    title: "Student Submission",
    message: "John Student has submitted Programming Assignment 1",
    isRead: false,
    createdAt: new Date("2024-11-14T16:45:00"),
    actionUrl: "/lecturer",
    metadata: {
      taskId: "1",
      courseId: "CS101",
    },
  },
  {
    id: "5",
    userId: "1",
    type: "reminder",
    title: "Study Reminder",
    message: "Don't forget to review your notes for upcoming assignments",
    isRead: true,
    createdAt: new Date("2024-11-11T08:00:00"),
  },
  {
    id: "6",
    userId: "3",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur this weekend from 2-4 AM",
    isRead: false,
    createdAt: new Date("2024-11-10T12:00:00"),
  },
]

export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter((notification) => notification.userId === userId)
}

export const getUnreadNotifications = (userId: string): Notification[] => {
  return getNotificationsByUser(userId).filter((notification) => !notification.isRead)
}

export const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "deadline":
      return "⏰"
    case "task_assigned":
      return "📝"
    case "task_completed":
      return "✅"
    case "grade_received":
      return "⭐"
    case "system":
      return "🔧"
    case "reminder":
      return "💡"
    default:
      return "📢"
  }
}

export const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "deadline":
      return "text-red-600 bg-red-50 border-red-200"
    case "task_assigned":
      return "text-blue-600 bg-blue-50 border-blue-200"
    case "task_completed":
      return "text-green-600 bg-green-50 border-green-200"
    case "grade_received":
      return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "system":
      return "text-purple-600 bg-purple-50 border-purple-200"
    case "reminder":
      return "text-orange-600 bg-orange-50 border-orange-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

export const markAsRead = (notificationId: string): void => {
  // In a real app, this would update the database
  const notification = mockNotifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.isRead = true
  }
}

export const markAllAsRead = (userId: string): void => {
  // In a real app, this would update the database
  mockNotifications.forEach((notification) => {
    if (notification.userId === userId) {
      notification.isRead = true
    }
  })
}

export const createNotification = (notification: Omit<Notification, "id" | "createdAt">): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    createdAt: new Date(),
  }
  mockNotifications.unshift(newNotification)
  return newNotification
}
