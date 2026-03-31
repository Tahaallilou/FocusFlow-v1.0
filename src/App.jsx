import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TaskProvider } from '@/context/TaskContext'
import { HabitProvider } from '@/context/HabitContext'
import { SessionProvider } from '@/context/SessionContext'
import { NotesProvider } from '@/context/NotesContext'
import { SettingsProvider } from '@/context/SettingsContext'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Tasks from '@/pages/Tasks'
import Eisenhower from '@/pages/Eisenhower'
import Focus from '@/pages/Focus'
import CalendarPage from '@/pages/Calendar'
import Notes from '@/pages/Notes'
import Habits from '@/pages/Habits'
import Analytics from '@/pages/Analytics'
import Settings from '@/pages/Settings'

export default function App() {
  return (
    <SettingsProvider>
      <TaskProvider>
        <HabitProvider>
          <SessionProvider>
            <NotesProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/eisenhower" element={<Eisenhower />} />
                    <Route path="/focus" element={<Focus />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/habits" element={<Habits />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </NotesProvider>
          </SessionProvider>
        </HabitProvider>
      </TaskProvider>
    </SettingsProvider>
  )
}
