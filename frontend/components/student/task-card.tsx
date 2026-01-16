"use client"

import { type Task, getPriorityColor, getStatusColor } from "@/frontend/lib/tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { Button } from "@/frontend/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/frontend/components/ui/dialog"
import { Input } from "@/frontend/components/ui/input"
import { Label } from "@/frontend/components/ui/label"
import { Calendar, Clock, User, BookOpen, CheckCircle, Circle, PlayCircle, Upload, Link2 } from "lucide-react"
import { format } from "date-fns"
import { useEffect, useState } from "react"

interface TaskCardProps {
  task: Task
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void
  onSubmitAssignment?: (taskId: string, submissionUrl: string) => void
}

export function TaskCard({ task, onStatusChange, onSubmitAssignment }: TaskCardProps) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed"
  const isPastDue = new Date(task.dueDate) < new Date()
  const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [submissionUrl, setSubmissionUrl] = useState(task.submissionUrl ?? "")

  useEffect(() => {
    setSubmissionUrl(task.submissionUrl ?? "")
  }, [task.submissionUrl])

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <PlayCircle className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const handleStatusChange = (newStatus: Task["status"]) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus)
    }
  }

  const handleSubmit = () => {
    const trimmed = submissionUrl.trim()
    if (!trimmed || !onSubmitAssignment) return
    onSubmitAssignment(task.id, trimmed)
    setIsSubmitOpen(false)
  }

  return (
    <Card className={`transition-all hover:shadow-md ${isOverdue ? "border-red-200 bg-red-50/30" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">{task.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {getStatusIcon(task.status)}
              <span className="ml-1 capitalize">{task.status.replace("-", " ")}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{task.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{task.course}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{task.assignedBy}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className={isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}>
              {isOverdue ? "Overdue" : daysUntilDue === 0 ? "Due today" : `${daysUntilDue} days left`}
            </span>
          </div>
        </div>

        {task.grade && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Grade: {task.grade}/100</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            {task.feedback && <p className="text-sm text-green-700 mt-1">{task.feedback}</p>}
          </div>
        )}

        {task.submissionUrl && (
          <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Link2 className="h-4 w-4" />
              <span>Submission attached</span>
            </div>
            <a
              href={task.submissionUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              View
            </a>
          </div>
        )}

        {task.status !== "completed" && (
          <div className="flex flex-wrap gap-2 pt-2">
            {task.status === "pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("in-progress")}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            {task.status === "in-progress" && (
              <Button
                size="sm"
                onClick={() => handleStatusChange("completed")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
            <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={isPastDue} className="border-primary/30">
                  <Upload className="h-4 w-4 mr-1" />
                  {task.submissionUrl ? "Update Submission" : "Submit"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Assignment</DialogTitle>
                  <DialogDescription>Upload a link or file path for {task.title}.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {isPastDue && <p className="text-sm text-red-600">This task is closed (deadline passed).</p>}
                  <div className="space-y-2">
                    <Label htmlFor={`submission-${task.id}`}>Submission Link</Label>
                    <Input
                      id={`submission-${task.id}`}
                      placeholder="https://drive.google.com/..."
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      disabled={isPastDue}
                    />
                  </div>
                  <Button onClick={handleSubmit} disabled={!submissionUrl.trim() || isPastDue} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
