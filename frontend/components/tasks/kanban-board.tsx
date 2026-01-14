"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import type { Task } from "@/frontend/lib/tasks"

interface KanbanBoardProps {
  tasks: Task[]
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskClick: (task: Task) => void
}

export function KanbanBoard({ tasks, onTaskUpdate, onTaskClick }: KanbanBoardProps) {
  const columns = [
    { id: "pending", title: "Pending", status: "pending" },
    { id: "in-progress", title: "In Progress", status: "in-progress" },
    { id: "completed", title: "Completed", status: "completed" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-600"
      case "high":
        return "border-l-orange-600"
      case "medium":
        return "border-l-yellow-600"
      case "low":
        return "border-l-green-600"
      default:
        return "border-l-gray-600"
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status)
        return (
          <div key={column.id} className="space-y-4">
            <Card className="bg-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {column.title}
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(task.priority)}`}
                  onClick={() => onTaskClick(task)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs font-normal">
                        {task.course}
                      </Badge>
                      <div className="text-xs text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {columnTasks.length === 0 && (
                <Card className="bg-gray-50">
                  <CardContent className="py-8 text-center text-sm text-gray-500">No tasks</CardContent>
                </Card>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
