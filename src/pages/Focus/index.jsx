import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Timer as TimerIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
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

  const handleComplete = () => {
    const now = Date.now()
    const elapsed = sessionStart ? Math.round((now - sessionStart) / 1000) : durationSec
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

  // Ring progress
  const cx = 80
  const cy = 80
  const r = 70
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <div className="max-w-2xl space-y-6">
      {/* Timer card */}
      <Card className={cn('overflow-hidden', isRunning && 'border-primary/40')}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <TimerIcon className="w-5 h-5 text-primary" />
            Focus Session
            {isRunning && (
              <Badge variant="default" className="ml-auto animate-pulse">
                ● Live
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Task selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Working on
            </label>
            <Select
              value={selectedTaskId}
              onValueChange={setSelectedTaskId}
              disabled={isRunning}
            >
              <SelectTrigger id="focus-task-select">
                <SelectValue placeholder="Select a task…" />
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

          {/* Timer display */}
          <div className="flex flex-col items-center gap-4">
            {/* SVG ring */}
            <div className="relative">
              <svg width="160" height="160" className="-rotate-90">
                {/* Background ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="8"
                />
                {/* Progress ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-500"
                  style={{
                    filter: isRunning
                      ? 'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))'
                      : 'none',
                  }}
                />
              </svg>

              {/* Time text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-mono tabular-nums">
                  {formattedTime}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {settings.focusDuration} min session
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <Progress value={progress} className="w-full" />

            {/* Controls */}
            {!completed ? (
              <div className="flex items-center gap-3">
                {!isRunning ? (
                  <Button
                    variant="brand"
                    size="lg"
                    onClick={handleStart}
                    className="px-8"
                    id="timer-start-btn"
                  >
                    <Play className="w-4 h-4 mr-2" />
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
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  title="Reset timer"
                  id="timer-reset-btn"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="flex items-center gap-2 text-success font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  Session complete! 🎉
                </div>
                {selectedTask && (
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="brand"
                      size="sm"
                      onClick={() => {
                        toggleTask(selectedTaskId)
                        handleReset()
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Mark Task Done
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                    >
                      New Session
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current task info */}
      {selectedTask && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <h3 className="font-medium text-sm mb-1">{selectedTask.title}</h3>
            {selectedTask.description && (
              <p className="text-sm text-muted-foreground">
                {selectedTask.description}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              <Badge variant="default">P{selectedTask.priority}</Badge>
              <Badge variant="outline">~{selectedTask.estimatedTime}m est.</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
            Focus Tips
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Close unnecessary tabs and notifications</li>
            <li>• Keep water nearby</li>
            <li>• Take a 5 min break after each session</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
