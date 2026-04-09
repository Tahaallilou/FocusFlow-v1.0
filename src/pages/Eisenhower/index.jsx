import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, BookOpen, Archive, Zap, Play } from 'lucide-react'
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
    accent: 'border-t-2 border-t-[#EF4444]',
    badge: 'destructive',
    filter: (c) => c.urgent && c.important,
  },
  {
    key: 'not-urgent-important',
    title: 'Schedule',
    subtitle: 'Not Urgent + Important',
    icon: BookOpen,
    accent: 'border-t-2 border-t-[#7C6CF2]',
    badge: 'default',
    filter: (c) => !c.urgent && c.important,
  },
  {
    key: 'urgent-not-important',
    title: 'Quick Tasks',
    subtitle: 'Urgent + Not Important',
    icon: Zap,
    accent: 'border-t-2 border-t-[#F59E0B]',
    badge: 'warning',
    filter: (c) => c.urgent && !c.important,
  },
  {
    key: 'not-urgent-not-important',
    title: 'Backlog',
    subtitle: 'Not Urgent + Not Important',
    icon: Archive,
    accent: 'border-t-2 border-t-border',
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
            <div
              key={q.key}
              className={cn(
                'bg-card rounded-xl border border-border shadow-soft p-4 min-h-[220px]',
                q.accent
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
                <span className="text-sm font-semibold">{q.title}</span>
                <Badge variant={q.badge} className="ml-auto">
                  {tasks.length}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{q.subtitle}</p>

              {tasks.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-6 text-center">
                  No tasks in this quadrant
                </p>
              ) : (
                <div className="space-y-1.5">
                  {tasks.map(({ task }) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2 p-2.5 rounded-md bg-background border border-transparent group hover:border-border transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate">
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
                          navigate('/app/focus', { state: { taskId: task.id } })
                        }
                        title="Start focus session"
                      >
                        <Play className="w-3 h-3" strokeWidth={2} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
