import { type Task, getTasksByStatus, getUpcomingTasks, getOverdueTasks } from "@/frontend/lib/tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { CheckCircle, Clock, AlertTriangle, BookOpen } from "lucide-react"

interface DashboardStatsProps {
  tasks: Task[]
}

export function DashboardStats({ tasks }: DashboardStatsProps) {
  const completedTasks = getTasksByStatus(tasks, "completed")
  const inProgressTasks = getTasksByStatus(tasks, "in-progress")
  const upcomingTasks = getUpcomingTasks(tasks, 7)
  const overdueTasks = getOverdueTasks(tasks)

  const stats = [
    {
      title: "Completed Tasks",
      value: completedTasks.length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "In Progress",
      value: inProgressTasks.length,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Due This Week",
      value: upcomingTasks.length,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Overdue",
      value: overdueTasks.length,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className={`${stat.borderColor} ${stat.bgColor}/30`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
