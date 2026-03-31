import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Calendar,
  Repeat2,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/habits', label: 'Habits', icon: Repeat2 },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60">
      <div className="page-container flex h-14 items-center justify-between">
        {/* Left: Logo */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            MindFlow
          </span>
        </NavLink>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )
              }
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right: Utility */}
        <div className="flex items-center gap-2 shrink-0">
          <NavLink
            to="/focus"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
          >
            <Timer className="w-4 h-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Focus</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
            title="Settings"
          >
            <Settings className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </NavLink>
        </div>
      </div>
    </header>
  )
}
