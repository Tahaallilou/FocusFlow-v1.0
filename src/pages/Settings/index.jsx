import { useState } from 'react'
import { Moon, Sun, RotateCcw, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettings } from '@/context/SettingsContext'
import { cn } from '@/utils/cn'

export default function Settings() {
  const { state, updateSettings, resetSettings } = useSettings()
  const [focusDuration, setFocusDuration] = useState(state.focusDuration)
  const [shortBreak, setShortBreak] = useState(state.shortBreak || 5)
  const [longBreak, setLongBreak] = useState(state.longBreak || 15)

  const handleSave = (e) => {
    e.preventDefault()
    updateSettings({
      focusDuration: Number(focusDuration),
      shortBreak: Number(shortBreak),
      longBreak: Number(longBreak),
    })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Customize your experience</p>
      </div>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground flex-1">Color scheme</p>
            <div className="flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => updateSettings({ theme: 'light' })}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-200',
                  state.theme === 'light'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent'
                )}
                id="theme-light-btn"
              >
                <Sun className="w-4 h-4" strokeWidth={1.75} />
                Light
              </button>
              <button
                onClick={() => updateSettings({ theme: 'dark' })}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-200',
                  state.theme === 'dark'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent'
                )}
                id="theme-dark-btn"
              >
                <Moon className="w-4 h-4" strokeWidth={1.75} />
                Dark
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus durations */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="focus-duration">Focus (min)</Label>
                <Input id="focus-duration" type="number" min={1} max={120} value={focusDuration} onChange={(e) => setFocusDuration(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="short-break">Short break (min)</Label>
                <Input id="short-break" type="number" min={1} max={30} value={shortBreak} onChange={(e) => setShortBreak(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="long-break">Long break (min)</Label>
                <Input id="long-break" type="number" min={1} max={60} value={longBreak} onChange={(e) => setLongBreak(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" id="settings-save-btn">
                <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.75} />
                Save
              </Button>
              <Button type="button" variant="outline" onClick={resetSettings} id="settings-reset-btn">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.75} />
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            All data is stored locally in your browser. Nothing is sent to any server.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const data = {
                  tasks: JSON.parse(localStorage.getItem('productivity_tasks') || '[]'),
                  habits: JSON.parse(localStorage.getItem('productivity_habits') || '[]'),
                  notes: JSON.parse(localStorage.getItem('productivity_notes') || '[]'),
                  sessions: JSON.parse(localStorage.getItem('productivity_sessions') || '[]'),
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'mindflow-backup.json'
                a.click()
                URL.revokeObjectURL(url)
              }}
              id="export-data-btn"
            >
              Export Data
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('This will delete ALL your data permanently. Are you sure?')) {
                  ['productivity_tasks', 'productivity_habits', 'productivity_notes', 'productivity_sessions', 'productivity_settings']
                    .forEach((k) => localStorage.removeItem(k))
                  window.location.reload()
                }
              }}
              id="clear-data-btn"
            >
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-primary/15">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold">MindFlow v1.0</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            A smart productivity system. Built with React, Tailwind CSS, and shadcn/ui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
