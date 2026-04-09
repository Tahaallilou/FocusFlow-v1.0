import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useTasks } from '@/context/TaskContext'
import { useSessions } from '@/context/SessionContext'
import { useSettings } from '@/context/SettingsContext'
import { useFocusTimer } from '@/hooks/useFocusTimer'
import { generateId } from '@/utils/taskUtils'
import { cn } from '@/utils/cn'

export default function Focus() {
  const location = useLocation()
  const { state: taskState, toggleTask } = useTasks()
  const { addSession } = useSessions()
  const { state: settings } = useSettings()

  const [selectedTaskId, setSelectedTaskId] = useState(
    location.state?.taskId || ''
  )
  const [sessionId] = useState(generateId())
  const [sessionStart, setSessionStart] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [savedSession, setSavedSession] = useState(null)

  const pendingTasks = taskState.tasks.filter((t) => !t.completed)
  const selectedTask = taskState.tasks.find((t) => t.id === selectedTaskId)
  const durationSec = settings.focusDuration * 60

  const playSound = () => {
    try {
      const audio = new Audio('/sounds/bell.mp3')
      audio.volume = 0.5
      audio.play().catch(e => console.warn('Audio play failed:', e))
    } catch (err) {
      console.warn('Audio not supported')
    }
  }

  const handleComplete = () => {
    playSound()
    
    const now = Date.now()
    const elapsed = sessionStart
      ? Math.round((now - sessionStart) / 1000)
      : durationSec
    const sess = {
      id: sessionId,
      taskId: selectedTaskId,
      startTime: sessionStart || now,
      duration: elapsed,
      completed: true,
    }
    addSession(sess)
    setSavedSession(sess)
    setCompleted(true)
  }

  const { remaining, isRunning, start, pause, reset, formattedTime, progress } =
    useFocusTimer(durationSec, handleComplete)

  const handleStart = () => {
    if (!sessionStart) setSessionStart(Date.now())
    start()
  }

  const handleReset = () => {
    reset()
    setSessionStart(null)
    setCompleted(false)
    setSavedSession(null)
  }

  const cx = 100,
    cy = 100,
    r = 88
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <div className="max-w-lg mx-auto space-y-6 pt-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Focus</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Deep work, distraction-free
        </p>
      </div>

      <div
        className={cn(
          'bg-card rounded-xl border border-border shadow-soft p-6 space-y-6',
          isRunning && 'shadow-glow border-primary/20'
        )}
      >
        {/* Task selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Working on
          </label>
          <Select
            value={selectedTaskId}
            onValueChange={setSelectedTaskId}
            disabled={isRunning}
          >
            <SelectTrigger id="focus-task-select">
              <SelectValue placeholder="Select a task..." />
            </SelectTrigger>
            <SelectContent>
              {pendingTasks.length === 0 ? (
                <SelectItem value="none" disabled>
                  No pending tasks
                </SelectItem>
              ) : (
                pendingTasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Timer ring */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <svg width="200" height="200" className="-rotate-90">
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="6"
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-500"
                style={{
                  filter: isRunning
                    ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.4))'
                    : 'none',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-mono tabular-nums tracking-tight">
                {formattedTime}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {settings.focusDuration} min session
              </span>
            </div>
          </div>

          {/* Controls */}
          {!completed ? (
            <div className="flex items-center gap-3">
              {!isRunning ? (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="px-8"
                  id="timer-start-btn"
                >
                  <Play className="w-4 h-4 mr-2" strokeWidth={2} />
                  {sessionStart ? 'Resume' : 'Start'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={pause}
                  className="px-8"
                  id="timer-pause-btn"
                >
                  <Pause className="w-4 h-4 mr-2" strokeWidth={2} />
                  Pause
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                title="Reset"
                id="timer-reset-btn"
              >
                <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="flex items-center gap-2 text-success font-medium justify-center">
                <CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />
                Session complete
              </div>
              {selectedTask && (
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    onClick={() => {
                      toggleTask(selectedTaskId)
                      handleReset()
                    }}
                  >
                    <CheckCircle2
                      className="w-3.5 h-3.5 mr-1"
                      strokeWidth={1.75}
                    />
                    Mark Task Done
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    New Session
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Current task info */}
      {selectedTask && (
        <div className="bg-card rounded-xl border border-dashed border-border p-4">
          <h3 className="text-sm font-medium">{selectedTask.title}</h3>
          {selectedTask.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedTask.description}
            </p>
          )}
          <div className="flex gap-1.5 mt-2">
            <Badge>P{selectedTask.priority}</Badge>
            <Badge variant="outline">{selectedTask.estimatedTime}m est.</Badge>
          </div>
        </div>
      )}
    </div>
  )
}
