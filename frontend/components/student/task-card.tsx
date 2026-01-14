"use client"

import { type Task, getPriorityColor, getStatusColor } from "@/frontend/lib/tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { Button } from "@/frontend/components/ui/button"
import { Calendar, Clock, User, BookOpen, CheckCircle, Circle, PlayCircle } from "lucide-react"
import { format } from "date-fns"

interface TaskCardProps {
  task: Task
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed"
  const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

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

        {task.status !== "completed" && (
          <div className="flex gap-2 pt-2">
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
