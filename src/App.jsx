import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TaskProvider } from '@/context/TaskContext'
import { HabitProvider } from '@/context/HabitContext'
import { SessionProvider } from '@/context/SessionContext'
import { NotesProvider } from '@/context/NotesContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

// Landing & Auth
import Landing from '@/pages/Landing'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'

// App layout & pages (untouched)
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
    <AuthProvider>
      <SettingsProvider>
        <TaskProvider>
          <HabitProvider>
            <SessionProvider>
              <NotesProvider>
                <BrowserRouter>
                  <Routes>
                    {/* ── Public routes ── */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* ── Protected app routes (all under /app) ── */}
                    <Route
                      path="/app"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="tasks" element={<Tasks />} />
                      <Route path="eisenhower" element={<Eisenhower />} />
                      <Route path="focus" element={<Focus />} />
                      <Route path="calendar" element={<CalendarPage />} />
                      <Route path="notes" element={<Notes />} />
                      <Route path="habits" element={<Habits />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* ── Fallback ── */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </NotesProvider>
            </SessionProvider>
          </HabitProvider>
        </TaskProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}
