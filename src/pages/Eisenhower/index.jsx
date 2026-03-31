import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, BookOpen, Trash2, Zap, Play } from 'lucide-react'
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
    accentClass: 'border-t-2 border-t-danger',
    badge: 'destructive',
    filter: (c) => c.urgent && c.important,
  },
  {
    key: 'not-urgent-important',
    title: 'Schedule',
    subtitle: 'Not Urgent + Important',
    icon: BookOpen,
    accentClass: 'border-t-2 border-t-primary',
    badge: 'default',
    filter: (c) => !c.urgent && c.important,
  },
  {
    key: 'urgent-not-important',
    title: 'Delegate',
    subtitle: 'Urgent + Not Important',
    icon: Zap,
    accentClass: 'border-t-2 border-t-warning',
    badge: 'warning',
    filter: (c) => c.urgent && !c.important,
  },
  {
    key: 'not-urgent-not-important',
    title: 'Eliminate',
    subtitle: 'Not Urgent + Not Important',
    icon: Trash2,
    accentClass: 'border-t-2 border-t-border',
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Eisenhower Matrix</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Urgent = deadline within 48h · Important = priority 4+
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUADRANTS.map((q) => {
          const Icon = q.icon
          const tasks = classified.filter((c) => q.filter(c))

          return (
            <Card key={q.key} className={cn('min-h-[240px]', q.accentClass)}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                  <span>{q.title}</span>
                  <Badge variant={q.badge} className="ml-auto">{tasks.length}</Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">{q.subtitle}</p>
              </CardHeader>

              <CardContent className="pt-0 space-y-1.5">
                {tasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-6 text-center">
                    No tasks in this quadrant
                  </p>
                ) : (
                  tasks.map(({ task }) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2 p-2.5 rounded-md bg-background border border-transparent group hover:border-border transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          P{task.priority} · {formatDeadline(task.deadline)}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                        onClick={() => navigate('/focus', { state: { taskId: task.id } })}
                        title="Start focus session"
                      >
                        <Play className="w-3 h-3" strokeWidth={2} />
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
