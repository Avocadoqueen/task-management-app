"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/frontend/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/frontend/components/ui/dialog"
import { Input } from "@/frontend/components/ui/input"
import { Label } from "@/frontend/components/ui/label"
import { Textarea } from "@/frontend/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/frontend/components/ui/select"
import { ArrowLeft, Plus, Calendar, BookOpen, Megaphone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getCourseById, addTask, addAnnouncement, getAnnouncementsByCourse, type Task } from "@/frontend/lib/courses"

export default function TeacherCoursePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState(getCourseById(courseId))
  const [announcements, setAnnouncements] = useState(getAnnouncementsByCourse(courseId))
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false)
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false)

  // Assignment form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<Task["type"]>("assignment")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<Task["priority"]>("medium")

  // Announcement form state
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [announcementContent, setAnnouncementContent] = useState("")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "lecturer")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || !course) {
    return null
  }

  const handleAddAssignment = () => {
    const newTask = addTask(courseId, {
      title,
      description,
      type,
      dueDate,
      status: "pending",
      priority,
    })

    if (newTask) {
      setCourse(getCourseById(courseId))
      setIsAssignmentDialogOpen(false)
      // Reset form
      setTitle("")
      setDescription("")
      setType("assignment")
      setDueDate("")
      setPriority("medium")
    }
  }

  const handleAddAnnouncement = () => {
    const newAnnouncement = addAnnouncement({
      courseId,
      title: announcementTitle,
      content: announcementContent,
      createdBy: user.name,
    })

    if (newAnnouncement) {
      setAnnouncements(getAnnouncementsByCourse(courseId))
      setIsAnnouncementDialogOpen(false)
      // Reset form
      setAnnouncementTitle("")
      setAnnouncementContent("")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/neu-logo.png" alt="NEU Logo" width={50} height={50} className="object-contain" />
            <div>
              <h1 className="text-xl font-bold text-primary">Near East University</h1>
              <p className="text-sm text-gray-600">Task Management System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/teacher">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {course.code} - {course.name}
              </h2>
              <p className="text-gray-600 mt-1">Manage assignments and announcements</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Megaphone className="w-4 h-4 mr-2" />
                    New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="announcement-title">Title</Label>
                      <Input
                        id="announcement-title"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        placeholder="Enter announcement title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="announcement-content">Content</Label>
                      <Textarea
                        id="announcement-content"
                        value={announcementContent}
                        onChange={(e) => setAnnouncementContent(e.target.value)}
                        placeholder="Enter announcement content"
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleAddAnnouncement} className="w-full bg-primary hover:bg-primary/90">
                      Post Announcement
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Assignment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter assignment title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter assignment description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={type} onValueChange={(value: Task["type"]) => setType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="test">Test</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="due-date">Due Date</Label>
                      <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={priority} onValueChange={(value: Task["priority"]) => setPriority(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddAssignment} className="w-full bg-primary hover:bg-primary/90">
                      Create Assignment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Announcements Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <p className="text-sm text-gray-500">No announcements yet</p>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border-b pb-4 last:border-0">
                        <h4 className="font-semibold text-sm text-gray-900">{announcement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Assignments Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Assignments & Tasks
                </CardTitle>
                <CardDescription>Total: {course.tasks.length} tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                task.type === "exam"
                                  ? "bg-red-100 text-red-700"
                                  : task.type === "test"
                                    ? "bg-orange-100 text-orange-700"
                                    : task.type === "project"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {task.type}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : task.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            <span
                              className={`${
                                task.status === "completed"
                                  ? "text-green-600"
                                  : task.status === "in-progress"
                                    ? "text-blue-600"
                                    : "text-gray-600"
                              }`}
                            >
                              Status: {task.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
