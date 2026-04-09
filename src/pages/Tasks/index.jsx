import { useState } from 'react'
import { Plus, Search, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import TaskCard from '@/components/TaskCard'
import TaskFormModal from '@/components/TaskFormModal'
import { useTasks } from '@/context/TaskContext'
import { cn } from '@/utils/cn'

const FILTERS = ['All', 'Pending', 'Completed']

export default function Tasks() {
  const { state, addTask, updateTask, deleteTask, toggleTask } = useTasks()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const filtered = state.tasks.filter((t) => {
    const matchFilter =
      filter === 'All' ||
      (filter === 'Completed' && t.completed) ||
      (filter === 'Pending' && !t.completed)
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    if (b.priority !== a.priority) return b.priority - a.priority
    if (a.deadline && b.deadline) return a.deadline - b.deadline
    if (a.deadline) return -1
    if (b.deadline) return 1
    return 0
  })

  const handleSave = (data) => {
    if (editingTask) {
      updateTask({ ...editingTask, ...data })
    } else {
      addTask(data)
    }
    setEditingTask(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {state.tasks.filter((t) => !t.completed).length} pending ·{' '}
            {state.tasks.filter((t) => t.completed).length} completed
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null)
            setModalOpen(true)
          }}
          id="add-task-btn"
        >
          <Plus className="w-4 h-4 mr-1" strokeWidth={2} />
          New Task
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="bg-card rounded-xl border border-border shadow-soft p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              strokeWidth={1.75}
            />
            <Input
              id="task-search"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex rounded-md border border-border overflow-hidden shrink-0">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium transition-colors duration-200',
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task list */}
      {sorted.length === 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-soft p-4">
          <div className="text-center py-12">
            <Inbox
              className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3"
              strokeWidth={1.25}
            />
            <p className="font-medium text-foreground">No tasks found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === 'All'
                ? 'Create your first task to get started.'
                : `No ${filter.toLowerCase()} tasks.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {sorted.map((task) => (
            <div key={task.id} className="animate-fade-in">
              <TaskCard
                task={task}
                onEdit={() => {
                  setEditingTask(task)
                  setModalOpen(true)
                }}
                onDelete={() => deleteTask(task.id)}
                onToggle={() => toggleTask(task.id)}
              />
            </div>
          ))}
        </div>
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTask(null)
        }}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  )
}
