import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useTasks } from '@/context/TaskContext'
import { useSessions } from '@/context/SessionContext'
import { useHabits } from '@/context/HabitContext'
import { getCompletionRate } from '@/utils/habitUtils'

/* ─── helpers ────────────────────────────────────────────────── */
function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      start: d.getTime(),
      end: d.getTime() + 86400000,
    }
  })
}

function getLast4Weeks() {
  return Array.from({ length: 4 }, (_, i) => {
    const ws = new Date()
    ws.setDate(ws.getDate() - (3 - i) * 7 - ws.getDay())
    ws.setHours(0, 0, 0, 0)
    const we = new Date(ws)
    we.setDate(we.getDate() + 7)
    return {
      label: `W${i + 1}`,
      start: ws.getTime(),
      end: we.getTime(),
      dateStrs: Array.from({ length: 7 }, (_, d) => {
        const day = new Date(ws)
        day.setDate(day.getDate() + d)
        return day.toISOString().split('T')[0]
      }),
    }
  })
}

/* ─── custom tooltip ─────────────────────────────────────────── */
function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'hsl(var(--popover))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        fontSize: 12,
        minWidth: 100,
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: 4, color: 'hsl(var(--foreground))' }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, color: p.color }}>
          {p.name}:{' '}
          <strong style={{ color: 'hsl(var(--foreground))' }}>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

/* ─── stat card ──────────────────────────────────────────────── */
function Stat({ label, value, sub }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

/* ─── chart card ─────────────────────────────────────────────── */
function Card({ title, sub, h = 240, children }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <div style={{ width: '100%', height: typeof h === 'number' ? `${h}px` : h }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ─── axis / grid shared props ───────────────────────────────── */
const tick = { fontSize: 11, fill: 'hsl(var(--muted-foreground))' }
const grid = { stroke: 'hsl(var(--border))', strokeDasharray: '3 3' }

const PURPLE = '#7C6CF2'
const PURPLE2 = '#A88BFF'

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function Analytics() {
  const { state: ts } = useTasks()
  const { state: ss } = useSessions()
  const { state: hs } = useHabits()

  const days  = useMemo(() => getLast7Days(), [])
  const weeks = useMemo(() => getLast4Weeks(), [])

  /* tasks per day */
  const taskData = useMemo(() =>
    days.map(({ label, start, end }) => ({
      label,
      completed: ts.tasks.filter(
        t => t.completed &&
          ((t.deadline && t.deadline >= start && t.deadline < end) ||
           (!t.deadline && t.createdAt >= start && t.createdAt < end))
      ).length,
    }))
  , [ts.tasks, days])

  /* focus minutes per day */
  const focusData = useMemo(() =>
    days.map(({ label, start, end }) => ({
      label,
      minutes: ss.sessions
        .filter(s => s.completed && s.startTime >= start && s.startTime < end)
        .reduce((acc, s) => acc + Math.round(s.duration / 60), 0),
    }))
  , [ss.sessions, days])

  /* habit completions per week */
  const habitWeekData = useMemo(() =>
    weeks.map(({ label, dateStrs }) => ({
      label,
      completions: hs.habits.reduce(
        (acc, h) => acc + h.completedDates.filter(d => dateStrs.includes(d)).length,
        0
      ),
    }))
  , [hs.habits, weeks])

  /* per-habit 7-day rate */
  const rateData = useMemo(() =>
    hs.habits.map(h => ({
      name: h.name.length > 14 ? h.name.slice(0, 14) + '…' : h.name,
      rate: getCompletionRate(h, 7),
    }))
  , [hs.habits])

  /* summary numbers */
  const focusMin   = ss.sessions.filter(s => s.completed).reduce((a, s) => a + Math.round(s.duration / 60), 0)
  const done       = ts.tasks.filter(t => t.completed).length
  const pct        = ts.tasks.length ? Math.round(done / ts.tasks.length * 100) : 0
  const habitLogs  = hs.habits.reduce((a, h) => a + h.completedDates.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your productivity at a glance — last 7 days
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Tasks Done"    value={done}                          sub={`${pct}% completion`} />
        <Stat label="Focus Time"    value={`${(focusMin/60).toFixed(1)}h`} sub={`${ss.sessions.filter(s=>s.completed).length} sessions`} />
        <Stat label="Habit Logs"    value={habitLogs}                      sub="all time" />
        <Stat label="Active Habits" value={hs.habits.length}               sub="tracked" />
      </div>

      {/* ── Tasks completed line chart ── */}
      <Card title="Tasks Completed" sub="Per day, last 7 days" h={240}>
        <LineChart data={taskData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lineFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={PURPLE} stopOpacity={0.15} />
              <stop offset="100%" stopColor={PURPLE} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={grid.stroke} strokeDasharray={grid.strokeDasharray} />
          <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={tick} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} />
          <Line
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke={PURPLE}
            strokeWidth={2.5}
            dot={{ r: 4, fill: PURPLE, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: PURPLE2, stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </LineChart>
      </Card>

      {/* ── Focus time area chart ── */}
      <Card title="Focus Time" sub="Minutes per day, last 7 days" h={240}>
        <AreaChart data={focusData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={PURPLE} stopOpacity={0.28} />
              <stop offset="95%" stopColor={PURPLE} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={grid.stroke} strokeDasharray={grid.strokeDasharray} />
          <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} />
          <YAxis tick={tick} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} />
          <Area
            type="monotone"
            dataKey="minutes"
            name="Minutes"
            stroke={PURPLE}
            strokeWidth={2.5}
            fill="url(#areaFill)"
            dot={{ r: 3.5, fill: PURPLE, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: PURPLE2, stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </AreaChart>
      </Card>

      {/* ── Habit completions bar chart ── */}
      <Card title="Habit Completions" sub="Total per week, last 4 weeks" h={240}>
        <BarChart data={habitWeekData} barSize={40} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={PURPLE2} stopOpacity={0.95} />
              <stop offset="100%" stopColor={PURPLE}  stopOpacity={0.75} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={grid.stroke} strokeDasharray={grid.strokeDasharray} />
          <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={tick} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="completions" name="Completions" fill="url(#barFill)" radius={[6, 6, 0, 0]} isAnimationActive={true} />
        </BarChart>
      </Card>

      {/* ── Per-habit rate horizontal bars ── */}
      {rateData.length > 0 && (
        <Card
          title="Habit Consistency (7-day)"
          sub="Completion rate per habit"
          h={Math.max(180, rateData.length * 44 + 32)}
        >
          <BarChart
            data={rateData}
            layout="vertical"
            barSize={14}
            margin={{ top: 4, right: 24, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="hBarFill" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor={PURPLE}  stopOpacity={0.8} />
                <stop offset="100%" stopColor={PURPLE2} stopOpacity={0.95} />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal={false} stroke={grid.stroke} strokeDasharray={grid.strokeDasharray} />
            <XAxis type="number" domain={[0, 100]} tick={tick} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={tick} width={108} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} formatter={v => [`${v}%`, 'Rate']} />
            <Bar dataKey="rate" name="Rate %" fill="url(#hBarFill)" radius={[0, 6, 6, 0]} isAnimationActive={true} />
          </BarChart>
        </Card>
      )}

      {/* Empty state if truly nothing */}
      {rateData.length === 0 && focusMin === 0 && done === 0 && (
        <div className="bg-card rounded-xl border border-border p-10 text-center">
          <p className="text-sm font-medium text-foreground mb-1">No data yet</p>
          <p className="text-xs text-muted-foreground">
            Complete tasks, run focus sessions, and log habits to populate your analytics.
          </p>
        </div>
      )}
    </div>
  )
}
