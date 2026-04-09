import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Calendar,
  Repeat2,
  BarChart3,
  Settings,
  Menu,
  X,
  Grid2x2,
  StickyNote,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'

const navLinks = [
  { to: '/app',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/tasks',    label: 'Tasks',     icon: CheckSquare },
  { to: '/app/calendar', label: 'Calendar',  icon: Calendar },
  { to: '/app/habits',   label: 'Habits',    icon: Repeat2 },
  { to: '/app/analytics',label: 'Analytics', icon: BarChart3 },
  { to: '/app/eisenhower',label: 'Matrix',   icon: Grid2x2 },
  { to: '/app/notes',    label: 'Notes',     icon: StickyNote },
]

const secondaryLinks = [
  { to: '/app/focus', label: 'Focus', icon: Timer },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { state: settings, updateSettings } = useSettings()
  const navigate = useNavigate()

  const handleNavClick = () => setMobileOpen(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60">
      <div className="w-full max-w-6xl mx-auto px-4 flex h-14 items-center justify-between">
        {/* Left: Logo */}
        <NavLink
          to="/app"
          className="flex items-center gap-2 shrink-0"
          onClick={handleNavClick}
        >
          <span className="text-[17px] font-bold tracking-tight gradient-text">
            FocusFlow
          </span>
        </NavLink>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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

        {/* Right: Desktop Utility */}
        <div className="flex items-center gap-1 shrink-0">
          <NavLink
            to="/app/focus"
            className={({ isActive }) =>
              cn(
                'hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
          >
            <Timer className="w-4 h-4" strokeWidth={1.75} />
            <span>Focus</span>
          </NavLink>

          <button
            onClick={toggleTheme}
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
            title="Toggle theme"
          >
            {settings.theme === 'light' ? (
              <Moon className="w-[18px] h-[18px]" strokeWidth={1.75} />
            ) : (
              <Sun className="w-[18px] h-[18px]" strokeWidth={1.75} />
            )}
          </button>

          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              cn(
                'hidden md:flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
            title="Settings"
          >
            <Settings className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </NavLink>

          {/* User avatar + logout */}
          {user && (
            <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                {user.name ? user.name[0].toUpperCase() : 'F'}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
                title="Sign out"
                id="logout-btn"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          )}

          {/* Mobile: Hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
            aria-label="Toggle menu"
            id="mobile-menu-btn"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" strokeWidth={1.75} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile: Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-card animate-fade-in">
          <nav className="w-full max-w-6xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
                {label}
              </NavLink>
            ))}

            <NavLink
                to="/app/focus"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                <Timer className="w-4 h-4" strokeWidth={1.75} />
                Focus
              </NavLink>

            <div className="h-px bg-border/60 my-2" />

            <NavLink
              to="/app/settings"
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )
              }
            >
              <Settings className="w-4 h-4" strokeWidth={1.75} />
              Settings
            </NavLink>

            <button
              onClick={() => {
                toggleTheme()
                handleNavClick()
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
            >
              {settings.theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4" strokeWidth={1.75} />
                  Dark mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" strokeWidth={1.75} />
                  Light mode
                </>
              )}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.75} />
                Sign out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
