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
          ? 'hsl(142 76% 50% / 0.7)'
          : isOverdue
          ? 'hsl(0 72% 57% / 0.8)'
          : 'hsl(210 100% 66% / 0.8)',
        border: 'none',
        borderRadius: '4px',
        color: 'white',
        fontSize: '12px',
        fontWeight: '500',
      },
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 text-xs font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary/80 inline-block" /> Pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-success/80 inline-block" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-destructive/80 inline-block" /> Overdue
        </span>
      </div>

      <Card>
        <CardContent className="p-4">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 580 }}
            eventPropGetter={eventStyle}
            popup
            tooltipAccessor={(e) => e.title}
          />
        </CardContent>
      </Card>
    </div>
  )
}
