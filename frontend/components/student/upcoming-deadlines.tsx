import { type Task, getUpcomingTasks } from "@/frontend/lib/tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { Calendar, Clock, AlertTriangle } from "lucide-react"
import { format, differenceInDays } from "date-fns"

interface UpcomingDeadlinesProps {
  tasks: Task[]
}

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const upcomingTasks = getUpcomingTasks(tasks, 14).sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )

  const getDaysUntilDue = (dueDate: Date) => {
    const days = differenceInDays(new Date(dueDate), new Date())
    return days
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 1) return "text-red-600 bg-red-50 border-red-200"
    if (days <= 3) return "text-orange-600 bg-orange-50 border-orange-200"
    if (days <= 7) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-blue-600 bg-blue-50 border-blue-200"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No upcoming deadlines in the next 2 weeks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.slice(0, 5).map((task) => {
              const daysUntil = getDaysUntilDue(new Date(task.dueDate))
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.course}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getUrgencyColor(daysUntil)}>
                      {daysUntil === 0 ? (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Due today
                        </>
                      ) : daysUntil === 1 ? (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Tomorrow
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          {daysUntil} days
                        </>
                      )}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{format(new Date(task.dueDate), "MMM dd")}</span>
                  </div>
                </div>
              )
            })}
            {upcomingTasks.length > 5 && (
              <div className="text-center pt-2">
                <span className="text-sm text-muted-foreground">+{upcomingTasks.length - 5} more deadlines</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
