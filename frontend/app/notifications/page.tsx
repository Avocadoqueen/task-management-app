"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { GraduationCap, ArrowLeft, Calendar, AlertCircle } from "lucide-react"
import { getUpcomingTasks } from "@/frontend/lib/courses"
import Link from "next/link"

export default function NotificationsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const upcomingTasks = getUpcomingTasks()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  const getDaysUntil = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Academic Task Manager</h1>
              <p className="text-sm text-primary-foreground/80">{user.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/courses">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h2>
          <p className="text-gray-600">All your upcoming tasks and deadlines</p>
        </div>

        {upcomingTasks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">No upcoming tasks</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingTasks.map((task) => {
              const daysUntil = getDaysUntil(task.dueDate)
              const isUrgent = daysUntil <= 3

              return (
                <Card key={task.id} className={isUrgent ? "border-red-500 border-2" : ""}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      {isUrgent && <AlertCircle className="w-5 h-5 text-red-500 mt-1" />}
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge variant={isUrgent ? "destructive" : "secondary"} className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Badge>
                          <span className={`text-sm font-medium ${isUrgent ? "text-red-600" : "text-gray-600"}`}>
                            {daysUntil === 0
                              ? "Due today"
                              : daysUntil === 1
                                ? "Due tomorrow"
                                : `Due in ${daysUntil} days`}
                          </span>
                          <Badge>{task.type}</Badge>
                          <Badge variant="outline">{task.priority} priority</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
