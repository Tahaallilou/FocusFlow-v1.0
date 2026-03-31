import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
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

  // Sort: pending by priority desc, then deadline asc; completed last
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

  const openEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">All Tasks</h1>
          <p className="text-sm text-muted-foreground">
            {state.tasks.filter((t) => !t.completed).length} pending,{' '}
            {state.tasks.filter((t) => t.completed).length} completed
          </p>
        </div>
        <Button variant="brand" onClick={openAdd} id="add-task-btn">
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="task-search"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex rounded-lg border border-border overflow-hidden">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium">No tasks found</p>
          <p className="text-sm mt-1">
            {filter === 'All'
              ? 'Create your first task to get started.'
              : `No ${filter.toLowerCase()} tasks.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((task) => (
            <div key={task.id} className="animate-fade-in">
              <TaskCard
                task={task}
                onEdit={() => openEdit(task)}
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
