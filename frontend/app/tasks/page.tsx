"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/frontend/components/layout/navbar"
import { Card, CardContent } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs"
import { getTasks, updateTask, deleteTask, createTask, type Task } from "@/frontend/lib/tasks"
import { LayoutList, LayoutGrid, Plus, Search } from "lucide-react"
import { Input } from "@/frontend/components/ui/input"
import { TaskDialog } from "@/frontend/components/tasks/task-dialog"
import { TaskCard } from "@/frontend/components/tasks/task-card"
import { KanbanBoard } from "@/frontend/components/tasks/kanban-board"

export default function TasksPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [view, setView] = useState<"list" | "kanban">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

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
        console.error("Failed to load tasks", e)
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
      const updated = await updateTask(user.id, taskId, updates)
      if (updated) {
        const all = await getTasks(user.id)
        setTasks(all)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(user.id, taskId)
      const all = await getTasks(user.id)
      setTasks(all)
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

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.course.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 mt-1">Manage and track all your assignments</p>
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

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
              className={view === "list" ? "bg-maroon-600 hover:bg-maroon-700" : ""}
            >
              <LayoutList className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={view === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("kanban")}
              className={view === "kanban" ? "bg-maroon-600 hover:bg-maroon-700" : ""}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Kanban
            </Button>
          </div>
        </div>

        {view === "list" ? (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No tasks found. Create your first task to get started!</p>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                    onClick={() => {
                      setSelectedTask(task)
                      setIsDialogOpen(true)
                    }}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filteredTasks
                .filter((t) => t.status === "pending")
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                    onClick={() => {
                      setSelectedTask(task)
                      setIsDialogOpen(true)
                    }}
                  />
                ))}
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-4">
              {filteredTasks
                .filter((t) => t.status === "in-progress")
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                    onClick={() => {
                      setSelectedTask(task)
                      setIsDialogOpen(true)
                    }}
                  />
                ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filteredTasks
                .filter((t) => t.status === "completed")
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                    onClick={() => {
                      setSelectedTask(task)
                      setIsDialogOpen(true)
                    }}
                  />
                ))}
            </TabsContent>
          </Tabs>
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskClick={(task) => {
              setSelectedTask(task)
              setIsDialogOpen(true)
            }}
          />
        )}
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
