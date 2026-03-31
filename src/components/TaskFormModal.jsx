import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const defaultForm = {
  title: '',
  description: '',
  deadline: '',
  difficulty: 3,
  energyRequired: 'medium',
  priority: 3,
  estimatedTime: 30,
  focusRequired: false,
}

export default function TaskFormModal({ open, onClose, onSave, task }) {
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (task) {
      setForm({
        ...task,
        deadline: task.deadline
          ? new Date(task.deadline).toISOString().split('T')[0]
          : '',
      })
    } else {
      setForm(defaultForm)
    }
  }, [task, open])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const data = {
      ...form,
      deadline: form.deadline ? new Date(form.deadline).getTime() : null,
      difficulty: Number(form.difficulty),
      priority: Number(form.priority),
      estimatedTime: Number(form.estimatedTime),
    }
    onSave(data)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              placeholder="Add details..."
              rows={2}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-deadline">Deadline</Label>
              <Input
                id="task-deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => set('deadline', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-time">Est. time (min)</Label>
              <Input
                id="task-time"
                type="number"
                min={1}
                max={480}
                value={form.estimatedTime}
                onChange={(e) => set('estimatedTime', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={String(form.priority)}
                onValueChange={(v) => set('priority', Number(v))}
              >
                <SelectTrigger id="task-priority"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} — {['Min', 'Low', 'Med', 'High', 'Crit'][n - 1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <Select
                value={String(form.difficulty)}
                onValueChange={(v) => set('difficulty', Number(v))}
              >
                <SelectTrigger id="task-difficulty"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Energy</Label>
              <Select
                value={form.energyRequired}
                onValueChange={(v) => set('energyRequired', v)}
              >
                <SelectTrigger id="task-energy"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="task-focus"
              type="checkbox"
              checked={form.focusRequired}
              onChange={(e) => set('focusRequired', e.target.checked)}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <Label htmlFor="task-focus">Requires deep focus</Label>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
