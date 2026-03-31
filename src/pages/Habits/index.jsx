import { useState } from 'react'
import { Plus, Trash2, Flame, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { generateId } from '@/utils/taskUtils'
import { cn } from '@/utils/cn'

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
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
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
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Habit Tracker</h1>
          <p className="text-sm text-muted-foreground">
            {todayHabits.filter(isHabitDoneToday).length} / {todayHabits.length} done
            today
          </p>
        </div>
        <Button variant="brand" onClick={() => setModalOpen(true)} id="add-habit-btn">
          <Plus className="w-4 h-4 mr-1" />
          New Habit
        </Button>
      </div>

      {/* Today's section */}
      {todayHabits.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Today's Habits
          </h2>
          <div className="space-y-2">
            {todayHabits.map((habit) => {
              const done = isHabitDoneToday(habit)
              const streak = getHabitStreak(habit)
              return (
                <Card
                  key={habit.id}
                  className={cn(
                    'transition-all duration-200',
                    done && 'opacity-80 border-success/30 bg-success/5'
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <button
                      onClick={() => markHabitDone(habit.id)}
                      className={cn(
                        'w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200',
                        done
                          ? 'bg-success/80 border-success text-white'
                          : 'border-border hover:border-primary hover:bg-accent'
                      )}
                    >
                      {done && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'font-medium text-sm',
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
                      <div className="flex items-center gap-1 text-warning">
                        <Flame className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{streak}</span>
                      </div>
                    )}

                    <Badge variant="outline" className="text-xs">
                      {getCompletionRate(habit)}%
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* All habits */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          All Habits ({state.habits.length})
        </h2>

        {state.habits.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-4xl mb-3">🌱</div>
            <p className="font-medium">No habits yet</p>
            <p className="text-sm mt-1">Start building your first habit.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {state.habits.map((habit) => {
              const streak = getHabitStreak(habit)
              const rate = getCompletionRate(habit, 30)
              return (
                <Card key={habit.id} className="group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{habit.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {habit.frequency === 'daily'
                            ? 'Daily'
                            : habit.days.map((d) => DAY_LABELS[d]).join(', ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {habit.completedDates.length} total completions
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {streak > 0 && (
                        <div className="flex items-center gap-1 text-warning">
                          <Flame className="w-4 h-4" />
                          <span className="text-sm font-bold">{streak}d</span>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-sm font-semibold">{rate}%</p>
                        <p className="text-xs text-muted-foreground">30d rate</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
              <Label htmlFor="habit-name">Habit Name *</Label>
              <Input
                id="habit-name"
                placeholder="e.g. Read 20 minutes"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <div className="flex rounded-lg border border-border overflow-hidden">
                {['daily', 'custom'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, frequency: f }))}
                    className={cn(
                      'flex-1 py-2 text-sm font-medium capitalize transition-colors',
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
                        'flex-1 py-1.5 text-xs font-medium rounded-md border transition-all duration-150',
                        form.days.includes(i)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-muted-foreground hover:border-border/80'
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand">
                Add Habit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
