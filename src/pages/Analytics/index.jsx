import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTasks } from '@/context/TaskContext'
import { useSessions } from '@/context/SessionContext'
import { useHabits } from '@/context/HabitContext'
import { getCompletionRate } from '@/utils/habitUtils'

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d,
    }
  })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-elevated text-xs">
        <p className="font-medium mb-0.5">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const PURPLE = '#7C6CF2'
const PURPLE_LIGHT = '#A88BFF'

export default function Analytics() {
  const { state: taskState } = useTasks()
  const { state: sessionState } = useSessions()
  const { state: habitState } = useHabits()

  const days = getLast7Days()

  const taskData = useMemo(() => {
    return days.map(({ label, date }) => {
      const next = new Date(date)
      next.setDate(next.getDate() + 1)
      const completed = taskState.tasks.filter(
        (t) => t.completed && t.createdAt >= date.getTime() && t.createdAt < next.getTime()
      ).length
      return { label, completed }
    })
  }, [taskState.tasks, days])

  const focusData = useMemo(() => {
    return days.map(({ label, date }) => {
      const next = new Date(date)
      next.setDate(next.getDate() + 1)
      const totalSec = sessionState.sessions
        .filter((s) => s.completed && s.startTime >= date.getTime() && s.startTime < next.getTime())
        .reduce((sum, s) => sum + s.duration, 0)
      return { label, minutes: Math.round(totalSec / 60) }
    })
  }, [sessionState.sessions, days])

  const habitData = useMemo(() => {
    return habitState.habits.map((h) => ({
      name: h.name.length > 16 ? h.name.slice(0, 16) + '...' : h.name,
      rate: getCompletionRate(h, 7),
    }))
  }, [habitState.habits])

  const totalFocusMin = sessionState.sessions
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + Math.round(s.duration / 60), 0)

  const totalCompleted = taskState.tasks.filter((t) => t.completed).length
  const completionRate =
    taskState.tasks.length > 0
      ? Math.round((totalCompleted / taskState.tasks.length) * 100)
      : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your productivity trends</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tasks Done', value: totalCompleted },
          { label: 'Completion', value: `${completionRate}%` },
          { label: 'Focus Time', value: `${Math.round(totalFocusMin / 60 * 10) / 10}h` },
          { label: 'Sessions', value: sessionState.sessions.filter((s) => s.completed).length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tasks chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tasks Completed — Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={taskData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" name="Completed" fill={PURPLE} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Focus chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Focus Time (min) — Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={focusData}>
              <defs>
                <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PURPLE_LIGHT} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={PURPLE_LIGHT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="minutes" name="Minutes" stroke={PURPLE} fill="url(#focusGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Habit rates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Habit Completion Rates (7d)</CardTitle>
        </CardHeader>
        <CardContent>
          {habitData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No habits tracked yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={habitData} layout="vertical" barSize={14} margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}%`, 'Rate']} />
                <Bar dataKey="rate" name="Rate" fill={PURPLE_LIGHT} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
