"use client"

import { useAuth } from "@/contexts/auth-context"
import { createTask, getTasks, type Task } from "@/frontend/lib/tasks"
import { getClassStats, getRecentSubmissions, getPendingGrading } from "@/frontend/lib/lecturer"
import { TaskCreationForm } from "@/frontend/components/lecturer/task-creation-form"
import { SubmissionCard } from "@/frontend/components/lecturer/submission-card"
import { ClassStatsCard } from "@/frontend/components/lecturer/class-stats"
import { NotificationBell } from "@/frontend/components/notifications/notification-bell"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs"
import { LogOut, Users, Plus, BookOpen, Clock, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function LecturerDashboard() {
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)

  if (!user || user.role !== "lecturer") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Access Denied</h1>
          <p className="text-muted-foreground">This page is only accessible to lecturers.</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (!user || user.role !== "lecturer") return
    let mounted = true
    setIsLoadingTasks(true)
    getTasks(user.id)
      .then((data) => {
        if (mounted) setTasks(data)
      })
      .catch((error) => {
        console.error("Failed to load tasks", error)
      })
      .finally(() => {
        if (mounted) setIsLoadingTasks(false)
      })
    return () => {
      mounted = false
    }
  }, [user])

  const handleCreateTask = async (taskData: any) => {
    if (!user) return
    try {
      await createTask(user.id, {
        ...taskData,
        status: "pending",
        assignedBy: user.name,
      })
      const refreshed = await getTasks(user.id)
      setTasks(refreshed)
      setShowCreateForm(false)
    } catch (error) {
      console.error("Failed to create task", error)
    }
  }

  const handleGradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    // In a real app, this would update the database
    console.log("Grading submission:", { submissionId, grade, feedback })
  }

  const recentSubmissions = getRecentSubmissions()
  const pendingGrading = getPendingGrading()
  const myTasks = tasks.filter((task) => task.assignedBy === user.name)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary">TaskFlow</h1>
            <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200">
              <Users className="h-4 w-4 mr-1" />
              Lecturer Portal
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
            <p className="text-muted-foreground">
              Manage your assignments, track submissions, and monitor student progress.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Assignments</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{myTasks.length}</div>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Grading</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingGrading.length}</div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Recent Submissions</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{recentSubmissions.length}</div>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">24</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="assignments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assignments">My Assignments</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="grading">Grading</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Assignment Management</h3>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>

              {showCreateForm && (
                <TaskCreationForm onSubmit={handleCreateTask} onCancel={() => setShowCreateForm(false)} />
              )}

              <div className="grid gap-4">
                {isLoadingTasks ? (
                  <Card>
                    <CardContent className="text-center py-8 text-muted-foreground">Loading assignments...</CardContent>
                  </Card>
                ) : myTasks.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8 text-muted-foreground">
                      No assignments yet. Create your first one.
                    </CardContent>
                  </Card>
                ) : (
                  myTasks.map((task) => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{task.course}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{task.priority}</Badge>
                            <Badge variant="outline">{task.status}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          <Button variant="outline" size="sm" onClick={() => setSelectedTask(task)}>
                            View Submissions
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="space-y-6">
              <h3 className="text-xl font-semibold">Recent Submissions</h3>
              <div className="grid gap-4">
                {recentSubmissions.map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} onGrade={handleGradeSubmission} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="grading" className="space-y-6">
              <h3 className="text-xl font-semibold">Pending Grading</h3>
              {pendingGrading.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
                    <p className="text-muted-foreground">All submissions have been graded!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pendingGrading.map((submission) => (
                    <SubmissionCard key={submission.id} submission={submission} onGrade={handleGradeSubmission} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <h3 className="text-xl font-semibold">Class Analytics</h3>
              <div className="grid gap-6">
                {myTasks.slice(0, 3).map((task) => (
                  <ClassStatsCard key={task.id} stats={getClassStats(task.id)} taskTitle={task.title} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
