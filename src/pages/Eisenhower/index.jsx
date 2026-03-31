import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, BookOpen, Trash2, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTasks } from '@/context/TaskContext'
import { classifyTask, formatDeadline } from '@/utils/taskUtils'
import { cn } from '@/utils/cn'

const QUADRANTS = [
  {
    key: 'urgent-important',
    title: 'Do First',
    subtitle: 'Urgent + Important',
    icon: AlertTriangle,
    color: 'text-destructive',
    border: 'border-destructive/30',
    bg: 'bg-destructive/5',
    badge: 'destructive',
    filter: (c) => c.urgent && c.important,
  },
  {
    key: 'not-urgent-important',
    title: 'Schedule',
    subtitle: 'Not Urgent + Important',
    icon: BookOpen,
    color: 'text-primary',
    border: 'border-primary/30',
    bg: 'bg-primary/5',
    badge: 'default',
    filter: (c) => !c.urgent && c.important,
  },
  {
    key: 'urgent-not-important',
    title: 'Delegate',
    subtitle: 'Urgent + Not Important',
    icon: Zap,
    color: 'text-warning',
    border: 'border-warning/30',
    bg: 'bg-warning/5',
    badge: 'warning',
    filter: (c) => c.urgent && !c.important,
  },
  {
    key: 'not-urgent-not-important',
    title: 'Eliminate',
    subtitle: 'Not Urgent + Not Important',
    icon: Trash2,
    color: 'text-muted-foreground',
    border: 'border-border',
    bg: 'bg-muted/20',
    badge: 'secondary',
    filter: (c) => !c.urgent && !c.important,
  },
]

export default function Eisenhower() {
  const { state } = useTasks()
  const navigate = useNavigate()

  const classified = useMemo(() => {
    return state.tasks
      .filter((t) => !t.completed)
      .map((t) => ({ task: t, ...classifyTask(t) }))
  }, [state.tasks])

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <p className="text-sm text-muted-foreground">
          Urgent = deadline within 48h · Important = priority ≥ 4
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 h-full">
        {QUADRANTS.map((q) => {
          const Icon = q.icon
          const tasks = classified.filter((c) => q.filter(c))

          return (
            <Card
              key={q.key}
              className={cn('border-2 min-h-[280px]', q.border, q.bg)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Icon className={cn('w-4 h-4', q.color)} />
                  <span className={q.color}>{q.title}</span>
                  <Badge variant={q.badge} className="ml-auto">
                    {tasks.length}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground -mt-1">{q.subtitle}</p>
              </CardHeader>

              <CardContent className="pt-0 space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-4 text-center">
                    No tasks here
                  </p>
                ) : (
                  tasks.map(({ task }) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-background/60 border border-border/60 group hover:border-border transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          P{task.priority} · {formatDeadline(task.deadline)}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                        onClick={() =>
                          navigate('/focus', { state: { taskId: task.id } })
                        }
                        title="Start focus session"
                      >
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 12 12"
                          fill="currentColor"
                        >
                          <path d="M3 2l7 4-7 4V2z" />
                        </svg>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
