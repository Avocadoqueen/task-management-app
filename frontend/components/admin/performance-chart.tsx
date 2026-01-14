"use client"

import type { PerformanceMetrics } from "@/frontend/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts"
import { TrendingUp } from "lucide-react"

interface PerformanceChartProps {
  data: PerformanceMetrics[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Task Creation vs Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="tasksCreated"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Tasks Created"
              />
              <Line
                type="monotone"
                dataKey="tasksCompleted"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                name="Tasks Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Average Grades & Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageGrade" fill="hsl(var(--primary))" name="Average Grade" />
              <Bar dataKey="activeUsers" fill="hsl(221 83% 53%)" name="Active Users" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
