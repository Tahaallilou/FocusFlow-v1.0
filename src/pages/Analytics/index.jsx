import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      date: d,
      dateStr: d.toISOString().split('T')[0],
    }
  })
}

const CHART_COLORS = {
  primary: 'hsl(210, 100%, 66%)',
  success: 'hsl(142, 76%, 50%)',
  warning: 'hsl(38, 92%, 55%)',
  muted: 'hsl(215, 20%, 40%)',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-medium mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics() {
  const { state: taskState } = useTasks()
  const { state: sessionState } = useSessions()
  const { state: habitState } = useHabits()

  const days = getLast7Days()

  // Tasks completed per day
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

  // Focus time per day (in minutes)
  const focusData = useMemo(() => {
    return days.map(({ label, date }) => {
      const next = new Date(date)
      next.setDate(next.getDate() + 1)
      const totalSec = sessionState.sessions
        .filter(
          (s) => s.completed && s.startTime >= date.getTime() && s.startTime < next.getTime()
        )
        .reduce((sum, s) => sum + s.duration, 0)
      return { label, minutes: Math.round(totalSec / 60) }
    })
  }, [sessionState.sessions, days])

  // Habit completion rate
  const habitData = useMemo(() => {
    return habitState.habits.map((h) => ({
      name: h.name.length > 14 ? h.name.slice(0, 14) + '…' : h.name,
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
    <div className="space-y-6 max-w-5xl">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Tasks Done', value: totalCompleted, color: 'text-success' },
          {
            label: 'Completion Rate',
            value: `${completionRate}%`,
            color: 'text-primary',
          },
          {
            label: 'Focus Hours',
            value: `${Math.round(totalFocusMin / 60 * 10) / 10}h`,
            color: 'text-warning',
          },
          {
            label: 'Sessions',
            value: sessionState.sessions.filter((s) => s.completed).length,
            color: 'text-foreground',
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {s.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tasks completed per day */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tasks Completed — Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={taskData} barSize={24}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="completed"
                name="Completed"
                fill={CHART_COLORS.primary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Focus time per day */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Focus Time (min) — Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={focusData}>
              <defs>
                <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.warning}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.warning}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="minutes"
                name="Minutes"
                stroke={CHART_COLORS.warning}
                fill="url(#focusGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Habit completion rates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Habit Completion Rates (7d)</CardTitle>
        </CardHeader>
        <CardContent>
          {habitData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No habits tracked yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={habitData}
                layout="vertical"
                barSize={18}
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  formatter={(v) => [`${v}%`, 'Completion']}
                />
                <Bar
                  dataKey="rate"
                  name="Rate"
                  fill={CHART_COLORS.success}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
