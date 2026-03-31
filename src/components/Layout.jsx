import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DatabaseZap, Check } from 'lucide-react'
import Navbar from './Navbar'
import { seedLocalStorage } from '@/utils/seedData'

export default function Layout() {
  const [seeded, setSeeded] = useState(false)

  const handleSeed = () => {
    seedLocalStorage()
    setSeeded(true)
    setTimeout(() => window.location.reload(), 500)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main content — below fixed nav, centered */}
      <main className="pt-14">
        <div className="page-container py-8">
          {/* Dev seed button — top right floating */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleSeed}
              title="Load demo data to test the app"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all duration-200 ${
                seeded
                  ? 'border-success/40 bg-success/8 text-success'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
              }`}
              id="seed-data-btn"
            >
              {seeded ? (
                <>
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  Done — Reloading
                </>
              ) : (
                <>
                  <DatabaseZap className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Load Demo Data
                </>
              )}
            </button>
          </div>

          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
