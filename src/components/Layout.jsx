import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DatabaseZap, Check } from 'lucide-react'
import Sidebar from './Sidebar'
import { seedLocalStorage } from '@/utils/seedData'

const pageTitles = {
  '/': 'Dashboard',
  '/tasks': 'Task Manager',
  '/eisenhower': 'Eisenhower Matrix',
  '/focus': 'Focus Mode',
  '/calendar': 'Calendar',
  '/notes': 'Quick Notes',
  '/habits': 'Habit Tracker',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

export default function Layout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'FlowMind'
  const [seeded, setSeeded] = useState(false)

  const handleSeed = () => {
    seedLocalStorage()
    setSeeded(true)
    setTimeout(() => {
      window.location.reload()
    }, 600)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-border bg-card/50 shrink-0">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* DEV: Seed data button */}
          <button
            onClick={handleSeed}
            title="Load demo data to test the app"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
              seeded
                ? 'border-success/50 bg-success/10 text-success'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5'
            }`}
            id="seed-data-btn"
          >
            {seeded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Seeded! Reloading…
              </>
            ) : (
              <>
                <DatabaseZap className="w-3.5 h-3.5" />
                Load Demo Data
              </>
            )}
          </button>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
