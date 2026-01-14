"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { LogOut, BookOpen, Bell } from "lucide-react"
import { getCourses } from "@/frontend/lib/courses"
import Link from "next/link"
import Image from "next/image"

export default function CoursesPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const courses = getCourses()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/neu-logo.png" alt="NEU" width={48} height={48} className="bg-white rounded-full p-1" />
              <div>
                <h1 className="text-2xl font-bold">Near East University</h1>
                <p className="text-sm text-primary-foreground/90">Task Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-primary-foreground/80">{user.studentNumber}</p>
              </div>
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Bell className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => logout()} className="text-white hover:bg-white/20">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}</h2>
          <p className="text-gray-600">Select a course to view tasks and deadlines</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const pendingTasks = course.tasks.filter((t) => t.status !== "completed").length
            const totalTasks = course.tasks.length

            return (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{course.code}</Badge>
                    </div>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription>{course.lecturer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tasks</span>
                      <span className="font-semibold">
                        {pendingTasks} / {totalTasks}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
