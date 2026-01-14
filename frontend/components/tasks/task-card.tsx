"use client"

import { Card, CardContent } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { Button } from "@/frontend/components/ui/button"
import { MoreVertical, Trash2, Edit } from "lucide-react"
import type { Task } from "@/frontend/lib/tasks"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/frontend/components/ui/dropdown-menu"

interface TaskCardProps {
  task: Task
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDelete: (taskId: string) => void
  onClick: () => void
}

export function TaskCard({ task, onUpdate, onDelete, onClick }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-red-600 text-red-600 bg-red-50"
      case "high":
        return "border-orange-600 text-orange-600 bg-orange-50"
      case "medium":
        return "border-yellow-600 text-yellow-600 bg-yellow-50"
      case "low":
        return "border-green-600 text-green-600 bg-green-50"
      default:
        return "border-gray-600 text-gray-600 bg-gray-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-600 text-green-600 bg-green-50"
      case "in-progress":
        return "border-blue-600 text-blue-600 bg-blue-50"
      case "pending":
        return "border-gray-600 text-gray-600 bg-gray-50"
      case "overdue":
        return "border-red-600 text-red-600 bg-red-50"
      default:
        return "border-gray-600 text-gray-600 bg-gray-50"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{task.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="font-normal">
                {task.course}
              </Badge>
              <Badge variant="outline" className={`font-normal ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </Badge>
              <Badge variant="outline" className={`font-normal ${getStatusColor(task.status)}`}>
                {task.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              <span>Assigned by: {task.assignedBy}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onClick()
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                }}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
