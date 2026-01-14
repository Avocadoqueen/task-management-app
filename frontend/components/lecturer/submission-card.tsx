"use client"

import type { Submission } from "@/frontend/lib/lecturer"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { Button } from "@/frontend/components/ui/button"
import { Input } from "@/frontend/components/ui/input"
import { Textarea } from "@/frontend/components/ui/textarea"
import { User, Calendar, FileText, Star } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

interface SubmissionCardProps {
  submission: Submission
  onGrade?: (submissionId: string, grade: number, feedback: string) => void
}

export function SubmissionCard({ submission, onGrade }: SubmissionCardProps) {
  const [isGrading, setIsGrading] = useState(false)
  const [grade, setGrade] = useState(submission.grade?.toString() || "")
  const [feedback, setFeedback] = useState(submission.feedback || "")

  const handleGradeSubmit = () => {
    const gradeNum = Number.parseInt(grade)
    if (gradeNum >= 0 && gradeNum <= 100 && onGrade) {
      onGrade(submission.id, gradeNum, feedback)
      setIsGrading(false)
    }
  }

  const getStatusColor = (status: Submission["status"]) => {
    switch (status) {
      case "graded":
        return "text-green-600 bg-green-50 border-green-200"
      case "submitted":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "late":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{submission.studentName}</CardTitle>
          <Badge variant="outline" className={getStatusColor(submission.status)}>
            {submission.status === "submitted" ? "Pending Review" : submission.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Student ID: {submission.studentId}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Submitted: {format(new Date(submission.submittedAt), "MMM dd, yyyy")}</span>
          </div>
        </div>

        {submission.fileUrl && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Submission file attached</span>
            <Button variant="link" size="sm" className="ml-auto p-0 h-auto">
              Download
            </Button>
          </div>
        )}

        {submission.status === "graded" && !isGrading ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Grade: {submission.grade}/100</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsGrading(true)}>
                Edit Grade
              </Button>
            </div>
            {submission.feedback && <p className="text-sm text-green-700">{submission.feedback}</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {(submission.status === "submitted" || isGrading) && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Grade (0-100)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Feedback</label>
                  <Textarea
                    placeholder="Enter feedback for the student"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleGradeSubmit} size="sm" className="flex-1">
                    {isGrading ? "Update Grade" : "Submit Grade"}
                  </Button>
                  {isGrading && (
                    <Button variant="outline" size="sm" onClick={() => setIsGrading(false)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
