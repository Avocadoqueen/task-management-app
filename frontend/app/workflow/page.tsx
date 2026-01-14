"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/frontend/components/layout/navbar"
import { getTasks, type Task } from "@/frontend/lib/tasks"
import { KanbanBoard } from "@/frontend/components/tasks/kanban-board"
import { TaskDialog } from "@/frontend/components/tasks/task-dialog"
import { updateTask } from "@/frontend/lib/tasks"

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
    if (user) {
      const allTasks = getTasks(user.id)
      setTasks(allTasks)
    }
  }, [user])

  if (isLoading || !user) {
    return null
  }

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const updated = updateTask(user.id, taskId, updates)
    if (updated) {
      setTasks(getTasks(user.id))
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workflow Visualization</h1>
          <p className="text-gray-600 mt-1">Track your tasks through different stages</p>
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
        onSave={(updates) => selectedTask && handleTaskUpdate(selectedTask.id, updates)}
      />
    </div>
  )
}
