/**
 * Seed data generator for FlowMind.
 * Covers: past (overdue/completed), present (today), future tasks.
 * Includes 6 habits with 30-day history, 10 focus sessions, 8 notes.
 */

const DAY = 24 * 60 * 60 * 1000
const now = Date.now()
const d = (daysOffset) => now + daysOffset * DAY
const dateStr = (daysOffset) => {
  const dt = new Date(now + daysOffset * DAY)
  return dt.toISOString().split('T')[0]
}
const todayStr = dateStr(0)

// Helper: build array of date strings for last N days
const lastNDays = (n) => Array.from({ length: n }, (_, i) => dateStr(-(n - 1 - i)))

export function seedLocalStorage() {
  // ── TASKS ────────────────────────────────────────────────────────────────
  const tasks = [
    // OVERDUE
    {
      id: 't1', title: 'Write project proposal',
      description: 'Draft the Q1 2026 product roadmap proposal for stakeholders.',
      deadline: d(-5), difficulty: 4, energyRequired: 'high',
      priority: 5, estimatedTime: 120, focusRequired: true,
      completed: false, createdAt: d(-10),
    },
    {
      id: 't2', title: 'Fix login page bug',
      description: 'Users report the login button is unresponsive on mobile Safari.',
      deadline: d(-2), difficulty: 3, energyRequired: 'medium',
      priority: 4, estimatedTime: 60, focusRequired: true,
      completed: false, createdAt: d(-7),
    },
    // DUE TODAY
    {
      id: 't3', title: 'Team standup preparation',
      description: 'Prepare bullet points for the daily standup meeting.',
      deadline: d(0), difficulty: 1, energyRequired: 'low',
      priority: 3, estimatedTime: 15, focusRequired: false,
      completed: false, createdAt: d(-1),
    },
    {
      id: 't4', title: 'Review pull request #42',
      description: 'Code review for the new payment integration feature.',
      deadline: d(0), difficulty: 3, energyRequired: 'medium',
      priority: 4, estimatedTime: 45, focusRequired: true,
      completed: false, createdAt: d(-2),
    },
    // DUE TOMORROW
    {
      id: 't5', title: 'Update API documentation',
      description: 'Document the new v2 endpoints for the developer portal.',
      deadline: d(1), difficulty: 2, energyRequired: 'medium',
      priority: 3, estimatedTime: 90, focusRequired: false,
      completed: false, createdAt: d(-3),
    },
    // THIS WEEK
    {
      id: 't6', title: 'Design database schema',
      description: 'Create the ER diagram and migrations for the new analytics module.',
      deadline: d(3), difficulty: 5, energyRequired: 'high',
      priority: 5, estimatedTime: 180, focusRequired: true,
      completed: false, createdAt: d(-4),
    },
    {
      id: 't7', title: 'Write unit tests for auth service',
      description: 'Achieve 80% coverage on authentication and authorization logic.',
      deadline: d(5), difficulty: 3, energyRequired: 'medium',
      priority: 4, estimatedTime: 120, focusRequired: true,
      completed: false, createdAt: d(-2),
    },
    {
      id: 't8', title: 'Read "Deep Work" chapter 3',
      description: 'Continue the book on focused productivity techniques.',
      deadline: d(6), difficulty: 1, energyRequired: 'low',
      priority: 2, estimatedTime: 40, focusRequired: false,
      completed: false, createdAt: d(-5),
    },
    // FUTURE
    {
      id: 't9', title: 'Quarterly performance review',
      description: 'Self-assessment form and peer feedback collection.',
      deadline: d(14), difficulty: 2, energyRequired: 'low',
      priority: 3, estimatedTime: 60, focusRequired: false,
      completed: false, createdAt: d(-1),
    },
    {
      id: 't10', title: 'Plan team offsite activities',
      description: 'Coordinate location, agenda, and logistics for the April offsite.',
      deadline: d(21), difficulty: 2, energyRequired: 'medium',
      priority: 2, estimatedTime: 90, focusRequired: false,
      completed: false, createdAt: d(0),
    },
    // COMPLETED (past)
    {
      id: 't11', title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment.',
      deadline: d(-14), difficulty: 4, energyRequired: 'high',
      priority: 5, estimatedTime: 240, focusRequired: true,
      completed: true, createdAt: d(-20),
    },
    {
      id: 't12', title: 'Migrate to TypeScript',
      description: 'Convert core modules to TypeScript for better type safety.',
      deadline: d(-10), difficulty: 5, energyRequired: 'high',
      priority: 4, estimatedTime: 300, focusRequired: true,
      completed: true, createdAt: d(-18),
    },
    {
      id: 't13', title: 'Weekly team retrospective',
      description: 'Facilitate the sprint retrospective meeting.',
      deadline: d(-7), difficulty: 1, energyRequired: 'low',
      priority: 3, estimatedTime: 60, focusRequired: false,
      completed: true, createdAt: d(-8),
    },
    {
      id: 't14', title: 'Update dependencies',
      description: 'Run npm audit and update outdated packages.',
      deadline: d(-4), difficulty: 2, energyRequired: 'low',
      priority: 2, estimatedTime: 30, focusRequired: false,
      completed: true, createdAt: d(-6),
    },
    {
      id: 't15', title: 'Refactor dashboard component',
      description: 'Split the monolithic dashboard into reusable sub-components.',
      deadline: d(-3), difficulty: 3, energyRequired: 'medium',
      priority: 3, estimatedTime: 90, focusRequired: true,
      completed: true, createdAt: d(-5),
    },
  ]

  // ── HABITS ──────────────────────────────────────────────────────────────
  const all30 = lastNDays(30)
  const skipEvery3 = (arr) => arr.filter((_, i) => i % 3 !== 2)

  const habits = [
    {
      id: 'h1', name: 'Morning meditation (10 min)',
      frequency: 'daily', days: [0,1,2,3,4,5,6],
      completedDates: [...all30.slice(-25), todayStr],
      createdAt: d(-40),
    },
    {
      id: 'h2', name: 'Exercise / Workout',
      frequency: 'custom', days: [1, 3, 5],
      completedDates: skipEvery3(all30.slice(-21)),
      createdAt: d(-30),
    },
    {
      id: 'h3', name: 'Read for 30 minutes',
      frequency: 'daily', days: [0,1,2,3,4,5,6],
      completedDates: all30.filter((_, i) => i % 4 !== 3),
      createdAt: d(-35),
    },
    {
      id: 'h4', name: 'No social media before noon',
      frequency: 'daily', days: [0,1,2,3,4,5,6],
      completedDates: [...skipEvery3(all30.slice(-14)), todayStr],
      createdAt: d(-20),
    },
    {
      id: 'h5', name: 'Weekly review (Sunday)',
      frequency: 'custom', days: [0],
      completedDates: [dateStr(-21), dateStr(-14), dateStr(-7)],
      createdAt: d(-30),
    },
    {
      id: 'h6', name: 'Drink 2L of water',
      frequency: 'daily', days: [0,1,2,3,4,5,6],
      completedDates: all30.slice(-20),
      createdAt: d(-22),
    },
  ]

  // ── FOCUS SESSIONS ───────────────────────────────────────────────────────
  const sessions = [
    { id: 's1',  taskId: 't11', startTime: d(-6) + 9*3600*1000,  duration: 1500, completed: true },
    { id: 's2',  taskId: 't11', startTime: d(-6) + 11*3600*1000, duration: 1500, completed: true },
    { id: 's3',  taskId: 't12', startTime: d(-5) + 10*3600*1000, duration: 2700, completed: true },
    { id: 's4',  taskId: 't12', startTime: d(-5) + 14*3600*1000, duration: 1500, completed: true },
    { id: 's5',  taskId: 't15', startTime: d(-4) + 9*3600*1000,  duration: 1500, completed: true },
    { id: 's6',  taskId: 't13', startTime: d(-3) + 15*3600*1000, duration: 900,  completed: true },
    { id: 's7',  taskId: 't14', startTime: d(-2) + 10*3600*1000, duration: 1500, completed: true },
    { id: 's8',  taskId: 't4',  startTime: d(-1) + 11*3600*1000, duration: 2700, completed: true },
    { id: 's9',  taskId: 't2',  startTime: d(-1) + 14*3600*1000, duration: 1500, completed: true },
    { id: 's10', taskId: 't6',  startTime: d(0)  + 8*3600*1000,  duration: 1500, completed: true },
  ]

  // ── NOTES ────────────────────────────────────────────────────────────────
  const notes = [
    {
      id: 'n1',
      content: '💡 Idea: Build a Pomodoro extension that syncs with the task list automatically.',
      createdAt: d(-15),
    },
    {
      id: 'n2',
      content: 'Remember to follow up with Sarah about the Q2 budget allocation before end of week.',
      createdAt: d(-10),
    },
    {
      id: 'n3',
      content: 'Book recs from team chat:\n- "Atomic Habits" — James Clear\n- "The Phoenix Project"\n- "Staff Engineer" — Will Larson',
      createdAt: d(-7),
    },
    {
      id: 'n4',
      content: '⚡ Quick wins for this sprint: dark mode, keyboard shortcuts, offline support.',
      createdAt: d(-4),
    },
    {
      id: 'n5',
      content: 'Architecture review notes:\n• Microservices for auth module\n• Redis for session caching\n• Postgres partitioning for analytics',
      createdAt: d(-3),
    },
    {
      id: 'n6',
      content: '🎯 Focus for this week: Ship the API docs, unblock the frontend team, close 3 open PRs.',
      createdAt: d(-1),
    },
    {
      id: 'n7',
      content: 'Standup blockers: waiting on design assets for the onboarding flow.',
      createdAt: d(0),
    },
  ]

  // ── SETTINGS ─────────────────────────────────────────────────────────────
  const settings = {
    focusDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    theme: 'light',
  }

  // ── WRITE TO LOCALSTORAGE ────────────────────────────────────────────────
  localStorage.setItem('productivity_tasks', JSON.stringify(tasks))
  localStorage.setItem('productivity_habits', JSON.stringify(habits))
  localStorage.setItem('productivity_sessions', JSON.stringify(sessions))
  localStorage.setItem('productivity_notes', JSON.stringify(notes))
  localStorage.setItem('productivity_settings', JSON.stringify(settings))

  return { tasks, habits, sessions, notes }
}
