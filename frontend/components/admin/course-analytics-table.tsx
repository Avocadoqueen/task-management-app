import type { CourseAnalytics } from "@/frontend/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { Progress } from "@/frontend/components/ui/progress"
import { BookOpen, Users, Star, TrendingUp } from "lucide-react"

interface CourseAnalyticsTableProps {
  courses: CourseAnalytics[]
}

export function CourseAnalyticsTable({ courses }: CourseAnalyticsTableProps) {
  const getPerformanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600 bg-green-50 border-green-200"
    if (rate >= 80) return "text-blue-600 bg-blue-50 border-blue-200"
    if (rate >= 70) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 85) return "text-green-600"
    if (grade >= 75) return "text-blue-600"
    if (grade >= 65) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Course Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.courseId} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{course.courseName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.courseCode} • {course.instructor}
                  </p>
                </div>
                <Badge variant="outline" className={getPerformanceColor(course.completionRate)}>
                  {course.completionRate.toFixed(1)}% Complete
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Students</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">{course.totalStudents}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Tasks</span>
                  </div>
                  <div className="text-xl font-bold text-purple-600">{course.totalTasks}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Avg Grade</span>
                  </div>
                  <div className={`text-xl font-bold ${getGradeColor(course.averageGrade)}`}>
                    {course.averageGrade.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Submission</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">{course.submissionRate.toFixed(1)}%</div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span>{course.completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Submission Rate</span>
                    <span>{course.submissionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={course.submissionRate} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
