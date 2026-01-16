"use client"

import { useAuth } from "@/contexts/auth-context"
import { getUpcomingTasks, getOverdueTasks, type Task } from "@/frontend/lib/tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { AlertTriangle, Clock } from "lucide-react"
import { format, differenceInDays } from "date-fns"

interface DeadlineAlertsProps {
  tasks?: Task[]
  isLoading?: boolean
}

export function DeadlineAlerts({ tasks = [], isLoading = false }: DeadlineAlertsProps) {
  const { user } = useAuth()

  if (!user || user.role !== "student") return null

  if (isLoading) return null

  const upcomingTasks = getUpcomingTasks(tasks, 3) // Next 3 days
  const overdueTasks = getOverdueTasks(tasks)

  if (upcomingTasks.length === 0 && overdueTasks.length === 0) return null

  return (
    <div className="space-y-4">
      {overdueTasks.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Overdue Tasks ({overdueTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-800">{task.title}</h4>
                  <p className="text-sm text-red-600">{task.course}</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive">Overdue</Badge>
                  <p className="text-xs text-red-600 mt-1">Due: {format(new Date(task.dueDate), "MMM dd")}</p>
                </div>
              </div>
            ))}
            {overdueTasks.length > 3 && (
              <p className="text-sm text-red-600 text-center">+{overdueTasks.length - 3} more overdue tasks</p>
            )}
          </CardContent>
        </Card>
      )}

      {upcomingTasks.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((task) => {
              const daysUntil = differenceInDays(new Date(task.dueDate), new Date())
              return (
                <div key={task.id} className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                  <div>
                    <h4 className="font-medium text-orange-800">{task.title}</h4>
                    <p className="text-sm text-orange-600">{task.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">
                      {daysUntil === 0 ? "Due today" : `${daysUntil} day${daysUntil > 1 ? "s" : ""} left`}
                    </Badge>
                    <p className="text-xs text-orange-600 mt-1">{format(new Date(task.dueDate), "MMM dd, h:mm a")}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
