"use client"

import { useAuth } from "@/contexts/auth-context"
import {
  mockSystemStats,
  mockCourseAnalytics,
  mockUserActivity,
  mockPerformanceMetrics,
  getTopPerformingCourses,
  getRecentUserActivity,
} from "@/frontend/lib/admin"
import { SystemOverview } from "@/frontend/components/admin/system-overview"
import { CourseAnalyticsTable } from "@/frontend/components/admin/course-analytics-table"
import { PerformanceChart } from "@/frontend/components/admin/performance-chart"
import { UserActivityTable } from "@/frontend/components/admin/user-activity-table"
import { NotificationBell } from "@/frontend/components/notifications/notification-bell"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs"
import { LogOut, BarChart3, Download, RefreshCw } from "lucide-react"

export default function AdminDashboard() {
  const { user, logout } = useAuth()

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Access Denied</h1>
          <p className="text-muted-foreground">This page is only accessible to administrators.</p>
        </div>
      </div>
    )
  }

  const topCourses = getTopPerformingCourses()
  const recentActivity = getRecentUserActivity()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary">TaskFlow</h1>
            <Badge variant="secondary" className="text-purple-600 bg-purple-50 border-purple-200">
              <BarChart3 className="h-4 w-4 mr-1" />
              Admin Portal
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">System Administration Dashboard</h2>
            <p className="text-muted-foreground">
              Monitor system performance, analyze user activity, and track educational outcomes.
            </p>
          </div>

          {/* System Overview */}
          <SystemOverview stats={mockSystemStats} />

          {/* Main Analytics */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">System Overview</TabsTrigger>
              <TabsTrigger value="courses">Course Analytics</TabsTrigger>
              <TabsTrigger value="performance">Performance Trends</TabsTrigger>
              <TabsTrigger value="users">User Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CourseAnalyticsTable courses={topCourses} />
                <UserActivityTable activities={recentActivity} />
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <CourseAnalyticsTable courses={mockCourseAnalytics} />
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <PerformanceChart data={mockPerformanceMetrics} />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UserActivityTable activities={mockUserActivity} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
