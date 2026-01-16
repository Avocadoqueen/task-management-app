"use client"

import { useAuth } from "@/contexts/auth-context"
import { mockCourses, type Task, getTasks, updateTask } from "@/frontend/lib/tasks"
import { DashboardStats } from "@/frontend/components/student/dashboard-stats"
import { TaskCard } from "@/frontend/components/student/task-card"
import { UpcomingDeadlines } from "@/frontend/components/student/upcoming-deadlines"
import { DeadlineAlerts } from "@/frontend/components/notifications/deadline-alerts"
import { NotificationBell } from "@/frontend/components/notifications/notification-bell"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { Progress } from "@/frontend/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs"
import { LogOut, BookOpen, Filter, Plus } from "lucide-react"
import { useEffect, useState } from "react"

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedFilter, setSelectedFilter] = useState<"all" | "pending" | "in-progress" | "completed" | "overdue">(
    "all",
  )
  const [isTasksLoading, setIsTasksLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "student") return
    let mounted = true
    setIsTasksLoading(true)
    getTasks(user.id)
      .then((data) => {
        if (mounted) setTasks(data)
      })
      .catch((error) => {
        console.error("Failed to load tasks", error)
      })
      .finally(() => {
        if (mounted) setIsTasksLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [user])

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

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    if (!user) return
    try {
      await updateTask(user.id, taskId, { status: newStatus })
      const refreshed = await getTasks(user.id)
      setTasks(refreshed)
    } catch (error) {
      console.error("Failed to update task status", error)
    }
  }

  const handleSubmission = async (taskId: string, submissionUrl: string) => {
    if (!user) return
    try {
      await updateTask(user.id, taskId, { submissionUrl, status: "completed" })
      const refreshed = await getTasks(user.id)
      setTasks(refreshed)
    } catch (error) {
      console.error("Failed to submit assignment", error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "overdue") {
      return new Date(task.dueDate) < new Date() && task.status !== "completed"
    }
    return task.status === selectedFilter
  })
  const submittedCount = tasks.filter((task) => Boolean(task.submissionUrl)).length
  const completionRate = tasks.length ? (submittedCount / tasks.length) * 100 : 0

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

          <DeadlineAlerts tasks={tasks} isLoading={isTasksLoading} />

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
                            <p>{isTasksLoading ? "Loading tasks..." : "No tasks found for the selected filter."}</p>
                          </div>
                        ) : (
                          filteredTasks.map((task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              onStatusChange={handleStatusChange}
                              onSubmitAssignment={handleSubmission}
                            />
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    Today&apos;s Focus
                    <span className="text-xs text-muted-foreground">
                      {tasks.filter((task) => task.status !== "completed").length} active
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks
                    .filter((task) => task.status !== "completed")
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 3)
                    .map((task) => (
                      <div key={task.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.course}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                  {tasks.filter((task) => task.status !== "completed").length === 0 && (
                    <p className="text-sm text-muted-foreground">No active tasks. You&apos;re all caught up.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    Submission Progress
                    <span className="text-sm text-muted-foreground">
                      {submittedCount}/{tasks.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={completionRate} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Submitted</span>
                    <span>{completionRate.toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>

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
