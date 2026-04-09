/**
 * HabitHeatmap — GitHub-style contribution heatmap for habits.
 * Shows daily habit completion count over the last 13 weeks.
 * Built with react-calendar-heatmap + purple color scale.
 */
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { useHabits } from '@/context/HabitContext'
import { useMemo } from 'react'

// Compute how many habits were completed for each date in the last N days
function buildHeatmapData(habits, days = 91) {
  const counts = {}
  const now = new Date()

  habits.forEach((habit) => {
    habit.completedDates.forEach((dateStr) => {
      counts[dateStr] = (counts[dateStr] || 0) + 1
    })
  })

  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (days - 1 - i))
    const key = d.toISOString().split('T')[0]
    return { date: key, count: counts[key] || 0 }
  })
}

// CSS class based on count
function classForValue(value) {
  if (!value || value.count === 0) return 'heatmap-empty'
  if (value.count === 1) return 'heatmap-scale-1'
  if (value.count === 2) return 'heatmap-scale-2'
  if (value.count === 3) return 'heatmap-scale-3'
  return 'heatmap-scale-4'
}

export default function HabitHeatmap() {
  const { state } = useHabits()

  const data = useMemo(() => buildHeatmapData(state.habits, 91), [state.habits])

  const startDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 91)
    return d
  }, [])

  const endDate = new Date()

  const totalDaysActive = data.filter((d) => d.count > 0).length

  const maxStreak = useMemo(() => {
    let streak = 0, best = 0
    data.forEach((d) => {
      if (d.count > 0) { streak++; best = Math.max(best, streak) }
      else streak = 0
    })
    return best
  }, [data])

  if (state.habits.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-soft p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Add habits to see your activity heatmap.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold">Habit Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 13 weeks</p>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">{totalDaysActive}</strong> active days
          </span>
          <span>
            <strong className="text-foreground">{maxStreak}</strong> best streak
          </span>
        </div>
      </div>

      {/* Heatmap — centered, max width, contained layout */}
      <div className="heatmap-wrap mx-auto w-full max-w-md">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={data}
          classForValue={classForValue}
          showWeekdayLabels={true}
          gutterSize={2}
          tooltipDataAttrs={(value) => ({
            'data-tip': value?.date
              ? `${value.date}: ${value.count} habit${value.count !== 1 ? 's' : ''}`
              : '',
          })}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 justify-end">
        <span className="text-xs text-muted-foreground">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-2.5 h-2.5 rounded-sm heatmap-legend-${level}`}
            title={`Level ${level}`}
          />
        ))}
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  )
}
