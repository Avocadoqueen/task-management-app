"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/frontend/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react"
import { getTasks, type Task } from "@/frontend/lib/tasks"
import Link from "next/link"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return
    let mounted = true
    ;(async () => {
      try {
        const allTasks = await getTasks(user.id)
        if (mounted) setTasks(allTasks)
      } catch (error) {
        console.error("Failed to load tasks", error)
      }
    })()
    return () => {
      mounted = false
    }
  }, [user])

  if (isLoading || !user) {
    return null
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length
  const pendingTasks = tasks.filter((t) => t.status === "pending").length
  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your tasks and progress</p>
        </div>

        {/* Quick Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
              <ListTodo className="w-4 h-4 text-maroon-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
              <Clock className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{inProgressTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{pendingTasks}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Tasks</CardTitle>
            <Link href="/tasks">
              <Button
                variant="outline"
                size="sm"
                className="border-maroon-600 text-maroon-600 hover:bg-maroon-50 bg-transparent"
              >
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No tasks yet. Start by creating your first task!</p>
              ) : (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{task.course}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge
                          variant="outline"
                          className={
                            task.priority === "high"
                              ? "border-red-600 text-red-600"
                              : task.priority === "medium"
                                ? "border-orange-600 text-orange-600"
                                : "border-green-600 text-green-600"
                          }
                        >
                          {task.priority}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            task.status === "completed"
                              ? "border-green-600 text-green-600"
                              : task.status === "in-progress"
                                ? "border-blue-600 text-blue-600"
                                : "border-gray-600 text-gray-600"
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
