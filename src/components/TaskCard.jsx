import { useNavigate } from 'react-router-dom'
import { Trash2, Pencil, Play, Check, Clock, Zap, Flag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDeadline, PRIORITY_LABELS } from '@/utils/taskUtils'
import { cn } from '@/utils/cn'

const ENERGY_ICONS = { low: '🌙', medium: '⚡', high: '🔥' }
const PRIORITY_COLORS = {
  1: 'secondary',
  2: 'secondary',
  3: 'warning',
  4: 'default',
  5: 'destructive',
}

/**
 * @param {{
 *   task: import('../types').Task,
 *   onEdit?: () => void,
 *   onDelete?: () => void,
 *   onToggle?: () => void,
 *   showActions?: boolean,
 *   compact?: boolean
 * }} props
 */
export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggle,
  showActions = true,
  compact = false,
}) {
  const navigate = useNavigate()
  const deadlineText = formatDeadline(task.deadline)
  const isOverdue = task.deadline && task.deadline < Date.now() && !task.completed
  const isDueToday =
    task.deadline &&
    deadlineText === 'Due today' &&
    !task.completed

  return (
    <Card
      className={cn(
        'group transition-all duration-200 hover:shadow-md hover:border-border/80',
        task.completed && 'opacity-60',
        isOverdue && !task.completed && 'border-danger/40',
        isDueToday && 'border-warning/40'
      )}
    >
      <CardContent className={cn('p-4', compact && 'p-3')}>
        <div className="flex items-start gap-3">
          {/* Complete toggle */}
          <button
            onClick={onToggle}
            className={cn(
              'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200',
              task.completed
                ? 'bg-success/80 border-success text-white'
                : 'border-border hover:border-primary'
            )}
            title={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed && <Check className="w-3 h-3" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-medium text-sm leading-snug truncate',
                task.completed && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </h3>

            {task.description && !compact && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {/* Priority */}
              <Badge variant={PRIORITY_COLORS[task.priority] || 'secondary'}>
                <Flag className="w-2.5 h-2.5 mr-1" />
                P{task.priority}
              </Badge>

              {/* Energy */}
              <Badge variant="outline">
                {ENERGY_ICONS[task.energyRequired]} {task.energyRequired}
              </Badge>

              {/* Deadline */}
              <Badge
                variant={
                  isOverdue ? 'destructive' : isDueToday ? 'warning' : 'secondary'
                }
              >
                <Clock className="w-2.5 h-2.5 mr-1" />
                {deadlineText}
              </Badge>

              {/* Estimated time */}
              {task.estimatedTime && (
                <Badge variant="outline">
                  ~{task.estimatedTime}m
                </Badge>
              )}

              {/* Focus required */}
              {task.focusRequired && (
                <Badge variant="default">
                  <Zap className="w-2.5 h-2.5 mr-1" />
                  Focus
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => navigate('/focus', { state: { taskId: task.id } })}
                title="Start focus session"
              >
                <Play className="w-3.5 h-3.5" />
              </Button>
              {onEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={onEdit}
                  title="Edit task"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 hover:text-destructive"
                  onClick={onDelete}
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
