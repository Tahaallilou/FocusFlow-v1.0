import { useNavigate } from 'react-router-dom'
import { Trash2, Pencil, Play, Check, Clock, Zap, Flag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDeadline } from '@/utils/taskUtils'
import { cn } from '@/utils/cn'

const PRIORITY_DOT = {
  1: 'bg-success',
  2: 'bg-success',
  3: 'bg-warning',
  4: 'bg-danger',
  5: 'bg-danger',
}

const PRIORITY_BADGE = {
  1: 'success',
  2: 'success',
  3: 'warning',
  4: 'destructive',
  5: 'destructive',
}

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

  return (
    <div
      className={cn(
        'group flex items-start gap-3 px-4 py-3 rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-soft hover:border-border/80',
        task.completed && 'opacity-50',
        isOverdue && 'border-l-2 border-l-danger'
      )}
    >
      {/* Complete toggle */}
      <button
        onClick={onToggle}
        className={cn(
          'mt-0.5 w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 border transition-all duration-200',
          task.completed
            ? 'bg-primary border-primary text-white'
            : 'border-border hover:border-primary/60'
        )}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && <Check className="w-3 h-3" strokeWidth={2.5} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {/* Priority dot */}
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', PRIORITY_DOT[task.priority] || 'bg-muted')} />
          <h3
            className={cn(
              'text-[13px] font-medium leading-snug truncate',
              task.completed && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </h3>
        </div>

        {task.description && !compact && (
          <p className="text-xs text-muted-foreground mt-0.5 ml-[14px] line-clamp-1">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 mt-1.5 ml-[14px]">
          <Badge variant={PRIORITY_BADGE[task.priority] || 'secondary'}>
            P{task.priority}
          </Badge>

          <Badge variant="outline">
            {task.energyRequired}
          </Badge>

          <Badge variant={isOverdue ? 'destructive' : 'outline'}>
            <Clock className="w-2.5 h-2.5 mr-0.5" strokeWidth={1.75} />
            {deadlineText}
          </Badge>

          {task.estimatedTime && (
            <Badge variant="outline">
              {task.estimatedTime}m
            </Badge>
          )}

          {task.focusRequired && (
            <Badge variant="default">
              <Zap className="w-2.5 h-2.5 mr-0.5" strokeWidth={1.75} />
              Focus
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => navigate('/focus', { state: { taskId: task.id } })}
            title="Start focus session"
          >
            <Play className="w-3.5 h-3.5" strokeWidth={1.75} />
          </Button>
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onEdit}
              title="Edit task"
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
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
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
