"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/frontend/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { getTasks, type Task } from "@/frontend/lib/tasks"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/frontend/components/ui/button"
import { TaskDialog } from "@/frontend/components/tasks/task-dialog"
import { updateTask } from "@/frontend/lib/tasks"

export default function CalendarPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return
    let mounted = true
    ;(async () => {
      try {
        const allTasks = await getTasks(user.id)
        if (mounted) setTasks(allTasks)
      } catch (error) {
        console.error("Failed to load tasks", error)
      }
    })()
    return () => {
      mounted = false
    }
  }, [user])

  if (isLoading || !user) {
    return null
  }

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(user.id, taskId, updates)
      const refreshed = await getTasks(user.id)
      setTasks(refreshed)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to update task", error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-1">View tasks organized by due date</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{monthName}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const date = new Date(year, month, day)
                  const dayTasks = getTasksForDate(date)
                  const isToday = new Date().toDateString() === date.toDateString()
                  const isSelected = selectedDate?.toDateString() === date.toDateString()

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      className={`aspect-square p-2 rounded-lg border transition-colors ${
                        isSelected
                          ? "bg-maroon-600 text-white border-maroon-600"
                          : isToday
                            ? "bg-maroon-50 border-maroon-600 text-maroon-600"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm font-semibold">{day}</div>
                      {dayTasks.length > 0 && (
                        <div className={`mt-1 text-xs ${isSelected ? "text-white" : "text-maroon-600"}`}>
                          {dayTasks.length} task{dayTasks.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })
                  : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No tasks for this date</p>
              ) : (
                <div className="space-y-3">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedTask(task)
                        setIsDialogOpen(true)
                      }}
                    >
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">{task.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{task.course}</p>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className={
                            task.priority === "urgent" || task.priority === "high"
                              ? "border-red-600 text-red-600 text-xs"
                              : "border-gray-600 text-gray-600 text-xs"
                          }
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        onSave={(updates) => selectedTask && handleTaskUpdate(selectedTask.id, updates)}
      />
    </div>
  )
}
