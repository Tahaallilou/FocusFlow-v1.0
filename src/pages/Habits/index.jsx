import { useState } from 'react'
import { Plus, Trash2, Flame, Check, Repeat2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useHabits } from '@/context/HabitContext'
import {
  getTodayHabits,
  isHabitDoneToday,
  getHabitStreak,
  getCompletionRate,
  DAY_LABELS,
} from '@/utils/habitUtils'
import { cn } from '@/utils/cn'
import HabitHeatmap from '@/components/HabitHeatmap'

const defaultForm = {
  name: '',
  frequency: 'daily',
  days: [0, 1, 2, 3, 4, 5, 6],
}

export default function Habits() {
  const { state, addHabit, deleteHabit, markHabitDone } = useHabits()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)

  const todayHabits = getTodayHabits(state.habits)

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day)
        ? f.days.filter((d) => d !== day)
        : [...f.days, day],
    }))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addHabit({ ...form, completedDates: [] })
    setForm(defaultForm)
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Habits</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {todayHabits.filter(isHabitDoneToday).length} /{' '}
            {todayHabits.length} completed today
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} id="add-habit-btn">
          <Plus className="w-4 h-4 mr-1" strokeWidth={2} />
          New Habit
        </Button>
      </div>

      {/* Today's section */}
      {todayHabits.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-soft p-4 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Today
          </h2>
          <div className="space-y-1.5">
            {todayHabits.map((habit) => {
              const done = isHabitDoneToday(habit)
              const streak = getHabitStreak(habit)
              return (
                <div
                  key={habit.id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-md border border-border bg-background transition-all duration-200',
                    done && 'opacity-60'
                  )}
                >
                  <button
                    onClick={() => markHabitDone(habit.id)}
                    className={cn(
                      'w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all duration-200',
                      done
                        ? 'bg-primary border-primary text-white'
                        : 'border-border hover:border-primary/60'
                    )}
                  >
                    {done && <Check className="w-3 h-3" strokeWidth={2.5} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        done && 'line-through text-muted-foreground'
                      )}
                    >
                      {habit.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {habit.frequency === 'daily'
                        ? 'Every day'
                        : habit.days.map((d) => DAY_LABELS[d]).join(', ')}
                    </p>
                  </div>
                  {streak > 0 && (
                    <div className="flex items-center gap-1 text-warning shrink-0">
                      <Flame className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span className="text-xs font-bold">{streak}</span>
                    </div>
                  )}
                  <Badge variant="outline" className="shrink-0">
                    {getCompletionRate(habit)}%
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Heatmap */}
      <HabitHeatmap />

      {/* All habits */}
      <div className="bg-card rounded-xl border border-border shadow-soft p-4 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          All Habits ({state.habits.length})
        </h2>

        {state.habits.length === 0 ? (
          <div className="text-center py-12">
            <Repeat2
              className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3"
              strokeWidth={1.25}
            />
            <p className="font-medium">No habits yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start building your first habit.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {state.habits.map((habit) => {
              const streak = getHabitStreak(habit)
              const rate = getCompletionRate(habit, 30)
              return (
                <div
                  key={habit.id}
                  className="flex items-center gap-4 px-3 py-3 rounded-md border border-border bg-background group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{habit.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {habit.frequency === 'daily'
                          ? 'Daily'
                          : habit.days.map((d) => DAY_LABELS[d]).join(', ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {habit.completedDates.length} completions
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {streak > 0 && (
                      <div className="flex items-center gap-1 text-warning">
                        <Flame className="w-4 h-4" strokeWidth={1.75} />
                        <span className="text-sm font-bold">{streak}d</span>
                      </div>
                    )}
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold">{rate}%</p>
                      <p className="text-xs text-muted-foreground">30d</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Habit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="habit-name">Name</Label>
              <Input
                id="habit-name"
                placeholder="e.g. Read for 20 minutes"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <div className="flex rounded-md border border-border overflow-hidden">
                {['daily', 'custom'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, frequency: f }))
                    }
                    className={cn(
                      'flex-1 py-2 text-sm font-medium capitalize transition-colors duration-200',
                      form.frequency === f
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {form.frequency === 'custom' && (
              <div className="space-y-1.5">
                <Label>Days</Label>
                <div className="flex gap-1.5">
                  {DAY_LABELS.map((day, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDay(i)}
                      className={cn(
                        'flex-1 py-1.5 text-xs font-medium rounded border transition-all duration-150',
                        form.days.includes(i)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40'
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Habit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
