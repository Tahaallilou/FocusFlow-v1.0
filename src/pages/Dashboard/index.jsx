import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Moon,
  Zap,
  Flame,
  CheckCircle2,
  Play,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import TaskCard from '@/components/TaskCard'
import { useTasks } from '@/context/TaskContext'
import { useHabits } from '@/context/HabitContext'
import { getBestTask, getTodayTasks, formatDeadline, ENERGY_LEVELS } from '@/utils/taskUtils'
import { getTodayHabits, isHabitDoneToday } from '@/utils/habitUtils'
import { cn } from '@/utils/cn'

const ENERGY_ICONS = { Moon, Zap, Flame }

export default function Dashboard() {
  const [energy, setEnergy] = useState('medium')
  const { state: taskState, toggleTask } = useTasks()
  const { state: habitState, markHabitDone } = useHabits()
  const navigate = useNavigate()

  const suggested = useMemo(
    () => getBestTask(taskState.tasks, energy),
    [taskState.tasks, energy]
  )

  const todayTasks = useMemo(
    () => getTodayTasks(taskState.tasks),
    [taskState.tasks]
  )

  const todayHabits = useMemo(
    () => getTodayHabits(habitState.habits),
    [habitState.habits]
  )

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Pending',
            value: taskState.tasks.filter((t) => !t.completed).length,
            sub: `of ${taskState.tasks.length} total`,
          },
          {
            label: 'Due today',
            value: todayTasks.length,
            sub: `${todayTasks.filter((t) => t.completed).length} completed`,
          },
          {
            label: 'Habits today',
            value: `${todayHabits.filter(isHabitDoneToday).length}/${todayHabits.length}`,
            sub: 'completed',
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Energy Selector */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
          Current Energy Level
        </h2>
        <div className="flex gap-2">
          {ENERGY_LEVELS.map((lvl) => {
            const Icon = ENERGY_ICONS[lvl.iconName]
            return (
              <button
                key={lvl.value}
                onClick={() => setEnergy(lvl.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-md border text-sm font-medium transition-all duration-200',
                  energy === lvl.value
                    ? 'border-primary bg-primary/8 text-primary shadow-sm'
                    : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
                {lvl.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Suggested Task */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Recommended Task
        </h2>

        {suggested ? (
          <Card className="border-primary/20 shadow-glow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold leading-tight">
                    {suggested.title}
                  </h3>
                  {suggested.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {suggested.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Badge>Priority {suggested.priority}/5</Badge>
                    <Badge variant="outline">
                      <Clock className="w-2.5 h-2.5 mr-0.5" strokeWidth={1.75} />
                      {formatDeadline(suggested.deadline)}
                    </Badge>
                    <Badge variant="outline">{suggested.estimatedTime}m</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => navigate('/focus', { state: { taskId: suggested.id } })}
                  >
                    <Play className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                    Start Focus
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTask(suggested.id)}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" strokeWidth={1.75} />
                    Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" strokeWidth={1.5} />
              <p className="font-medium">All clear</p>
              <p className="text-sm text-muted-foreground mt-1">No pending tasks.</p>
              <Button size="sm" className="mt-4" onClick={() => navigate('/tasks')}>
                Add Tasks
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
            Due Today
          </h2>
          {todayTasks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                No tasks due today
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  showActions={false}
                  compact
                />
              ))}
            </div>
          )}
        </div>

        {/* Today's Habits */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
            Today's Habits
          </h2>
          {todayHabits.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                No habits scheduled for today
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-1.5">
              {todayHabits.map((habit) => {
                const done = isHabitDoneToday(habit)
                return (
                  <div
                    key={habit.id}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-md border border-border bg-card transition-all duration-200',
                      done && 'opacity-60'
                    )}
                  >
                    <button
                      onClick={() => markHabitDone(habit.id)}
                      className={cn(
                        'w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 border transition-all duration-200',
                        done
                          ? 'bg-primary border-primary text-white'
                          : 'border-border hover:border-primary/60'
                      )}
                    >
                      {done && <Check className="w-3 h-3" strokeWidth={2.5} />}
                    </button>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        done && 'line-through text-muted-foreground'
                      )}
                    >
                      {habit.name}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
