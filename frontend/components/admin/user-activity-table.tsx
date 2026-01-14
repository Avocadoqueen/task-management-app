import type { UserActivity } from "@/frontend/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { Avatar, AvatarFallback } from "@/frontend/components/ui/avatar"
import { Users, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface UserActivityTableProps {
  activities: UserActivity[]
}

export function UserActivityTable({ activities }: UserActivityTableProps) {
  const getRoleBadgeColor = (role: UserActivity["userRole"]) => {
    switch (role) {
      case "student":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "lecturer":
        return "text-green-600 bg-green-50 border-green-200"
      case "admin":
        return "text-purple-600 bg-purple-50 border-purple-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Recent User Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.userId}
              className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(activity.userName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{activity.userName}</h4>
                  <Badge variant="outline" className={getRoleBadgeColor(activity.userRole)}>
                    {activity.userRole}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Last active {formatDistanceToNow(new Date(activity.lastActive), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                {activity.userRole === "student" ? (
                  <div>
                    <div className="text-sm font-medium">{activity.tasksCompleted} tasks completed</div>
                    {activity.averageGrade && (
                      <div className="text-xs text-muted-foreground">Avg: {activity.averageGrade.toFixed(1)}%</div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-medium">{activity.tasksAssigned} tasks assigned</div>
                    <div className="text-xs text-muted-foreground">Lecturer</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
