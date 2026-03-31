import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Brain,
  CheckCircle2,
  Play,
  CalendarClock,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import TaskCard from '@/components/TaskCard'
import { useTasks } from '@/context/TaskContext'
import { useHabits } from '@/context/HabitContext'
import { getBestTask, getTodayTasks, formatDeadline, ENERGY_LEVELS } from '@/utils/taskUtils'
import { getTodayHabits, isHabitDoneToday } from '@/utils/habitUtils'
import { cn } from '@/utils/cn'

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

  const completedToday = taskState.tasks.filter((t) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return t.completed && t.createdAt >= today.getTime()
  }).length

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Total Tasks',
            value: taskState.tasks.length,
            sub: `${taskState.tasks.filter((t) => !t.completed).length} pending`,
            color: 'text-primary',
          },
          {
            label: 'Due Today',
            value: todayTasks.length,
            sub: `${todayTasks.filter((t) => t.completed).length} done`,
            color: 'text-warning',
          },
          {
            label: "Today's Habits",
            value: todayHabits.length,
            sub: `${todayHabits.filter(isHabitDoneToday).length} completed`,
            color: 'text-success',
          },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {stat.label}
              </p>
              <p className={cn('text-3xl font-bold mt-1', stat.color)}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Energy Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="w-4 h-4 text-primary" />
            How's your energy right now?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {ENERGY_LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                onClick={() => setEnergy(lvl.value)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200',
                  energy === lvl.value
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border text-muted-foreground hover:border-border/80 hover:bg-accent'
                )}
              >
                <span className="text-base">{lvl.icon}</span>
                {lvl.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Task */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Recommended Task
        </h2>

        {suggested ? (
          <Card className="border-primary/30 bg-primary/5 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base leading-tight">
                    {suggested.title}
                  </h3>
                  {suggested.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {suggested.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="default">Priority: {suggested.priority}/5</Badge>
                    <Badge variant="warning">
                      <CalendarClock className="w-3 h-3 mr-1" />
                      {formatDeadline(suggested.deadline)}
                    </Badge>
                    <Badge variant="outline">~{suggested.estimatedTime}m</Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={() =>
                      navigate('/focus', { state: { taskId: suggested.id } })
                    }
                  >
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Start Focus
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTask(suggested.id)}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
              <p className="font-medium">All clear!</p>
              <p className="text-sm text-muted-foreground mt-1">
                No pending tasks. Add some tasks to get started.
              </p>
              <Button
                variant="brand"
                size="sm"
                className="mt-4"
                onClick={() => navigate('/tasks')}
              >
                Add Tasks
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Two columns: today tasks + habits */}
      <div className="grid grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <CalendarClock className="w-3.5 h-3.5 text-warning" />
            Due Today
          </h2>
          {todayTasks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                No tasks due today 🎉
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
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            🌱 Today's Habits
          </h2>
          {todayHabits.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                No habits scheduled for today.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {todayHabits.map((habit) => {
                const done = isHabitDoneToday(habit)
                return (
                  <Card
                    key={habit.id}
                    className={cn(
                      'transition-all duration-200',
                      done && 'opacity-70'
                    )}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <button
                        onClick={() => markHabitDone(habit.id)}
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200',
                          done
                            ? 'bg-success/80 border-success text-white'
                            : 'border-border hover:border-primary'
                        )}
                      >
                        {done && (
                          <svg
                            className="w-2.5 h-2.5"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                            />
                          </svg>
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
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
