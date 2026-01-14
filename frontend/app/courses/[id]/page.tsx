"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { Input } from "@/frontend/components/ui/input"
import { Label } from "@/frontend/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog"
import { ArrowLeft, Calendar, CheckCircle2, Circle, Clock, Upload, Check } from "lucide-react"
import { getCourseById, updateTaskStatus, submitAssignment } from "@/frontend/lib/courses"
import Link from "next/link"
import Image from "next/image"

export default function CourseDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState(getCourseById(courseId))
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [submissionFile, setSubmissionFile] = useState<string>("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || !course) {
    return null
  }

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed"
    updateTaskStatus(courseId, taskId, newStatus)
    setCourse(getCourseById(courseId))
  }

  const handleSubmitAssignment = (taskId: string) => {
    submitAssignment(courseId, taskId, submissionFile)
    setCourse(getCourseById(courseId))
    setSelectedTask(null)
    setSubmissionFile("")
  }

  const getTaskIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-green-600" />
    if (status === "in-progress") return <Clock className="w-5 h-5 text-blue-600" />
    return <Circle className="w-5 h-5 text-gray-400" />
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "exam":
        return "bg-red-100 text-red-700"
      case "test":
        return "bg-orange-100 text-orange-700"
      case "assignment":
        return "bg-blue-100 text-blue-700"
      case "project":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Image src="/neu-logo.png" alt="NEU" width={48} height={48} className="bg-white rounded-full p-1" />
            <div>
              <h1 className="text-2xl font-bold">Near East University</h1>
              <p className="text-sm text-primary-foreground/90">{user.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/courses">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{course.name}</h2>
                <Badge variant="secondary" className="text-sm">
                  {course.code}
                </Badge>
              </div>
              <p className="text-gray-600">{course.lecturer}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Tasks & Deadlines</h3>
          {course.tasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">No tasks assigned yet</CardContent>
            </Card>
          ) : (
            course.tasks.map((task) => (
              <Card key={task.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => handleToggleTask(task.id, task.status)}
                        className="mt-1 hover:scale-110 transition-transform"
                      >
                        {getTaskIcon(task.status)}
                      </button>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
                        <CardDescription className="text-sm mb-3">{task.description}</CardDescription>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getTypeColor(task.type)}>{task.type}</Badge>
                          <Badge className={getPriorityColor(task.priority)}>{task.priority} priority</Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Badge>
                          <Badge
                            variant={
                              task.status === "completed"
                                ? "default"
                                : task.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {task.type === "assignment" && task.status !== "completed" && (
                      <Dialog
                        open={selectedTask === task.id}
                        onOpenChange={(open) => setSelectedTask(open ? task.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Submit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Submit Assignment</DialogTitle>
                            <DialogDescription>Submit your work for {task.title}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="submission">Assignment File or Link</Label>
                              <Input
                                id="submission"
                                placeholder="Enter file link or upload path..."
                                value={submissionFile}
                                onChange={(e) => setSubmissionFile(e.target.value)}
                              />
                            </div>
                            <Button
                              onClick={() => handleSubmitAssignment(task.id)}
                              disabled={!submissionFile}
                              className="w-full"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Submit Assignment
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
