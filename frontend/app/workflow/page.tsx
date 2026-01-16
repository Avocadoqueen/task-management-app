"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/frontend/components/layout/navbar"
import { createTask, getTasks, type Task } from "@/frontend/lib/tasks"
import { KanbanBoard } from "@/frontend/components/tasks/kanban-board"
import { TaskDialog } from "@/frontend/components/tasks/task-dialog"
import { updateTask } from "@/frontend/lib/tasks"
import { Button } from "@/frontend/components/ui/button"
import { Plus } from "lucide-react"

export default function WorkflowPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
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
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load tasks', e)
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
      const all = await getTasks(user.id)
      setTasks(all)
      setIsDialogOpen(false)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  const handleTaskCreate = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createTask(user.id, task)
      const all = await getTasks(user.id)
      setTasks(all)
      setIsDialogOpen(false)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workflow Visualization</h1>
            <p className="text-gray-600 mt-1">Track your tasks through different stages</p>
          </div>
          <Button
            onClick={() => {
              setSelectedTask(null)
              setIsDialogOpen(true)
            }}
            className="bg-maroon-600 hover:bg-maroon-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: tasks.length, tone: "text-gray-900" },
            { label: "Pending", value: tasks.filter((task) => task.status === "pending").length, tone: "text-gray-600" },
            {
              label: "In Progress",
              value: tasks.filter((task) => task.status === "in-progress").length,
              tone: "text-blue-600",
            },
            {
              label: "Completed",
              value: tasks.filter((task) => task.status === "completed").length,
              tone: "text-green-600",
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-semibold ${stat.tone}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <KanbanBoard
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskClick={(task) => {
            setSelectedTask(task)
            setIsDialogOpen(true)
          }}
        />
      </main>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        onSave={selectedTask ? (updates) => handleTaskUpdate(selectedTask.id, updates) : handleTaskCreate}
      />
    </div>
  )
}
