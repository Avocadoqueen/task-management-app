"use client"

import { useAuth } from "@/contexts/auth-context"
import { mockTasks, mockCourses } from "@/frontend/lib/tasks"
import { DashboardStats } from "@/frontend/components/student/dashboard-stats"
import { TaskCard } from "@/frontend/components/student/task-card"
import { UpcomingDeadlines } from "@/frontend/components/student/upcoming-deadlines"
import { DeadlineAlerts } from "@/frontend/components/notifications/deadline-alerts"
import { NotificationBell } from "@/frontend/components/notifications/notification-bell"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs"
import { LogOut, BookOpen, Filter, Plus } from "lucide-react"
import { useState } from "react"

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState(mockTasks)
  const [selectedFilter, setSelectedFilter] = useState<"all" | "pending" | "in-progress" | "completed" | "overdue">(
    "all",
  )

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Access Denied</h1>
          <p className="text-muted-foreground">This page is only accessible to students.</p>
        </div>
      </div>
    )
  }

  const handleStatusChange = (taskId: string, newStatus: any) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date() } : task)),
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "overdue") {
      return new Date(task.dueDate) < new Date() && task.status !== "completed"
    }
    return task.status === selectedFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary">TaskFlow</h1>
            <Badge variant="secondary" className="text-blue-600 bg-blue-50 border-blue-200">
              <BookOpen className="h-4 w-4 mr-1" />
              Student Portal
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground">Here's an overview of your academic tasks and deadlines.</p>
          </div>

          <DeadlineAlerts />

          {/* Dashboard Stats */}
          <DashboardStats tasks={tasks} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tasks Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      My Tasks
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedFilter} onValueChange={(value: any) => setSelectedFilter(value)}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="overdue">Overdue</TabsTrigger>
                    </TabsList>
                    <TabsContent value={selectedFilter} className="mt-6">
                      <div className="space-y-4">
                        {filteredTasks.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No tasks found for the selected filter.</p>
                          </div>
                        ) : (
                          filteredTasks.map((task) => (
                            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                          ))
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <UpcomingDeadlines tasks={tasks} />

              {/* Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    My Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className={`w-3 h-3 rounded-full ${course.color}`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{course.code}</h4>
                          <p className="text-xs text-muted-foreground">{course.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
