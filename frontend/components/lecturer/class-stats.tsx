import type { ClassStats } from "@/frontend/lib/lecturer"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Progress } from "@/frontend/components/ui/progress"
import { Users, CheckCircle, Star, Clock } from "lucide-react"

interface ClassStatsProps {
  stats: ClassStats
  taskTitle: string
}

export function ClassStatsCard({ stats, taskTitle }: ClassStatsProps) {
  const submissionRate = (stats.submittedCount / stats.totalStudents) * 100
  const gradingProgress = stats.submittedCount > 0 ? (stats.gradedCount / stats.submittedCount) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Class Statistics - {taskTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 border border-blue-200 mx-auto mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 border border-green-200 mx-auto mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.submittedCount}</div>
            <div className="text-sm text-muted-foreground">Submissions</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Submission Rate</span>
              <span>{submissionRate.toFixed(1)}%</span>
            </div>
            <Progress value={submissionRate} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Grading Progress</span>
              <span>{gradingProgress.toFixed(1)}%</span>
            </div>
            <Progress value={gradingProgress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Average Grade</span>
            </div>
            <div className="text-xl font-bold text-yellow-600">
              {stats.averageGrade > 0 ? stats.averageGrade.toFixed(1) : "N/A"}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Late Submissions</span>
            </div>
            <div className="text-xl font-bold text-red-600">{stats.lateSubmissions}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
