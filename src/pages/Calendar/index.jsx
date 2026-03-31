import { useMemo } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { useTasks } from '@/context/TaskContext'
import { Card, CardContent } from '@/components/ui/card'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = { 'en-US': enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CalendarPage() {
  const { state } = useTasks()

  const events = useMemo(() => {
    return state.tasks
      .filter((t) => t.deadline)
      .map((t) => ({
        id: t.id,
        title: t.title,
        start: new Date(t.deadline),
        end: new Date(t.deadline),
        resource: t,
      }))
  }, [state.tasks])

  const eventStyle = (event) => {
    const task = event.resource
    const isCompleted = task.completed
    const isOverdue = task.deadline < Date.now() && !task.completed
    return {
      style: {
        backgroundColor: isCompleted
          ? 'hsl(160 84% 39% / 0.7)'
          : isOverdue
          ? 'hsl(0 84% 60% / 0.75)'
          : 'hsl(251 85% 68% / 0.8)',
        border: 'none',
        borderRadius: '3px',
        color: 'white',
        fontSize: '12px',
        fontWeight: '500',
      },
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Task deadlines at a glance</p>
      </div>

      <div className="flex gap-4 text-xs font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'hsl(251 85% 68%)' }} /> Pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'hsl(160 84% 39%)' }} /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'hsl(0 84% 60%)' }} /> Overdue
        </span>
      </div>

      <Card>
        <CardContent className="p-4">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 560 }}
            eventPropGetter={eventStyle}
            popup
            tooltipAccessor={(e) => e.title}
          />
        </CardContent>
      </Card>
    </div>
  )
}
