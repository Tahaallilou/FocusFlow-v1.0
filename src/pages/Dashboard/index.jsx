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
  ArrowRight,
} from 'lucide-react'
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

  const pendingCount = taskState.tasks.filter((t) => !t.completed).length
  const completedTodayCount = todayTasks.filter((t) => t.completed).length
  const habitsDoneCount = todayHabits.filter(isHabitDoneToday).length

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Pending',
            value: pendingCount,
            sub: `of ${taskState.tasks.length} total`,
          },
          {
            label: 'Due Today',
            value: todayTasks.length,
            sub: `${completedTodayCount} completed`,
          },
          {
            label: 'Habits Today',
            value: `${habitsDoneCount}/${todayHabits.length}`,
            sub: 'completed',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border shadow-soft p-4"
          >
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Energy selector */}
      <div className="bg-card rounded-xl border border-border shadow-soft p-4 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
          Current Energy Level
        </h2>
        <div className="flex flex-wrap gap-2">
          {ENERGY_LEVELS.map((lvl) => {
            const Icon = ENERGY_ICONS[lvl.iconName]
            return (
              <button
                key={lvl.value}
                onClick={() => setEnergy(lvl.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-md border text-sm font-medium transition-all duration-200',
                  energy === lvl.value
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
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

      {/* Suggested task */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Recommended Task
        </h2>

        {suggested ? (
          <div className="bg-card rounded-xl border border-primary/20 shadow-glow p-5">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
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
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() =>
                    navigate('/app/focus', { state: { taskId: suggested.id } })
                  }
                >
                  <Play className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                  Start Focus
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTask(suggested.id)}
                >
                  <CheckCircle2
                    className="w-3.5 h-3.5 mr-1"
                    strokeWidth={1.75}
                  />
                  Complete
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-dashed border-border p-8 text-center">
            <CheckCircle2
              className="w-8 h-8 text-success mx-auto mb-2"
              strokeWidth={1.5}
            />
            <p className="font-medium">All clear</p>
            <p className="text-sm text-muted-foreground mt-1">
              No pending tasks.
            </p>
            <Button
              size="sm"
              className="mt-4"
              onClick={() => navigate('/app/tasks')}
            >
              Add Tasks
            </Button>
          </div>
        )}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's tasks */}
        <div className="bg-card rounded-xl border border-border shadow-soft p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
              Due Today
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => navigate('/app/tasks')}
            >
              View all
              <ArrowRight className="w-3 h-3 ml-1" strokeWidth={1.75} />
            </Button>
          </div>

          {todayTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No tasks due today
            </p>
          ) : (
            <div className="space-y-2">
              {todayTasks.slice(0, 5).map((task) => (
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

        {/* Today's habits */}
        <div className="bg-card rounded-xl border border-border shadow-soft p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
              Today's Habits
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => navigate('/app/habits')}
            >
              View all
              <ArrowRight className="w-3 h-3 ml-1" strokeWidth={1.75} />
            </Button>
          </div>

          {todayHabits.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No habits scheduled
            </p>
          ) : (
            <div className="space-y-1.5">
              {todayHabits.map((habit) => {
                const done = isHabitDoneToday(habit)
                return (
                  <div
                    key={habit.id}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md border border-border bg-background transition-all duration-200',
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
                      {done && (
                        <Check className="w-3 h-3" strokeWidth={2.5} />
                      )}
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
