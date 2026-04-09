import { useState, useMemo, useEffect } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { useTasks } from '@/context/TaskContext'
import { getTaskStatus, getEventStyle } from '@/utils/calendarUtils'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = { 'en-US': enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function CalendarPage() {
  const { state } = useTasks()
  const [date, setDate] = useState(new Date())
  const isMobile = useIsMobile()
  const [view, setView] = useState(() => (window.innerWidth < 640 ? 'day' : 'month'))

  // Update view when screen size changes
  useEffect(() => {
    if (isMobile && view === 'month') setView('day')
    if (!isMobile && view === 'day') setView('month')
  }, [isMobile]) // eslint-disable-line react-hooks/exhaustive-deps

  const events = useMemo(() => {
    return state.tasks
      .filter((t) => t.deadline)
      .map((t) => ({
        id: t.id,
        title: t.title,
        start: new Date(t.deadline),
        end: new Date(t.deadline),
        allDay: true,
        resource: t,
      }))
  }, [state.tasks])

  const eventPropGetter = (event) => {
    const status = getTaskStatus(event.resource)
    return { style: getEventStyle(status) }
  }

  const availableViews = isMobile
    ? ['day', 'agenda']
    : ['month', 'week', 'day', 'agenda']

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Task deadlines at a glance
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-medium">
        {[
          { color: '#7C6CF2', label: 'Pending' },
          { color: '#10B981', label: 'Completed' },
          { color: '#EF4444', label: 'Overdue' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* Calendar Card — NO overflow-x, fully responsive */}
      <div className="bg-card rounded-xl border border-border shadow-soft p-3 md:p-4">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          view={view}
          onNavigate={(newDate) => setDate(newDate)}
          onView={(newView) => setView(newView)}
          views={availableViews}
          style={{ height: isMobile ? 480 : 560 }}
          eventPropGetter={eventPropGetter}
          popup
          tooltipAccessor={(e) => `${e.title} (${getTaskStatus(e.resource)})`}
        />
      </div>

      {events.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No tasks with deadlines yet. Add tasks to see them on the calendar.
        </p>
      )}
    </div>
  )
}
