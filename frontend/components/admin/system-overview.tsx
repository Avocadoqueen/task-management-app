import type { SystemStats } from "@/frontend/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Progress } from "@/frontend/components/ui/progress"
import { Users, BookOpen, CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react"

interface SystemOverviewProps {
  stats: SystemStats
}

export function SystemOverview({ stats }: SystemOverviewProps) {
  const overviewCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      subtitle: `${stats.totalStudents} Students, ${stats.totalLecturers} Lecturers`,
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      subtitle: "Across all courses",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      subtitle: `${((stats.completedTasks / stats.totalTasks) * 100).toFixed(1)}% completion rate`,
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      subtitle: "Awaiting completion",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card) => (
          <Card key={card.title} className={`${card.borderColor} ${card.bgColor}/30`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Completion Rate</span>
                <span className="font-medium">{stats.averageCompletionRate.toFixed(1)}%</span>
              </div>
              <Progress value={stats.averageCompletionRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Task Distribution</span>
                <span className="text-xs text-muted-foreground">Completed vs Pending</span>
              </div>
              <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
                <div
                  className="bg-green-500"
                  style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                />
                <div className="bg-orange-500" style={{ width: `${(stats.pendingTasks / stats.totalTasks) * 100}%` }} />
                <div className="bg-red-500" style={{ width: `${(stats.overdueTasks / stats.totalTasks) * 100}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Completed: {stats.completedTasks}</span>
                <span>Pending: {stats.pendingTasks}</span>
                <span>Overdue: {stats.overdueTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">Overdue Tasks</p>
                  <p className="text-sm text-red-600">{stats.overdueTasks} tasks need immediate attention</p>
                </div>
                <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                <div>
                  <p className="font-medium text-orange-800">Low Completion Rate</p>
                  <p className="text-sm text-orange-600">Some courses below 80% completion</p>
                </div>
                <div className="text-2xl font-bold text-orange-600">3</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
