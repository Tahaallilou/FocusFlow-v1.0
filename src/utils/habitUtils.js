/**
 * Get today's date string in YYYY-MM-DD format.
 * @returns {string}
 */
export function getTodayString() {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

/**
 * Get today's day of week (0=Sun ... 6=Sat).
 * @returns {number}
 */
export function getTodayDayOfWeek() {
  return new Date().getDay()
}

/**
 * Filter habits that are scheduled for today.
 * @param {import('../types').Habit[]} habits
 * @returns {import('../types').Habit[]}
 */
export function getTodayHabits(habits) {
  const todayDow = getTodayDayOfWeek()
  return habits.filter((h) => {
    if (h.frequency === 'daily') return true
    return h.days.includes(todayDow)
  })
}

/**
 * Check if a habit is completed today.
 * @param {import('../types').Habit} habit
 * @returns {boolean}
 */
export function isHabitDoneToday(habit) {
  const today = getTodayString()
  return habit.completedDates.includes(today)
}

/**
 * Calculate current streak for a habit (consecutive days done).
 * @param {import('../types').Habit} habit
 * @returns {number}
 */
export function getHabitStreak(habit) {
  if (habit.completedDates.length === 0) return 0

  const sorted = [...habit.completedDates].sort().reverse()
  let streak = 0
  let current = new Date()
  current.setHours(0, 0, 0, 0)

  for (const dateStr of sorted) {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    const diff = Math.round((current - d) / (1000 * 60 * 60 * 24))

    if (diff === 0 || diff === 1) {
      streak++
      current = d
    } else {
      break
    }
  }

  return streak
}

/**
 * Calculate habit completion rate for last N days.
 * @param {import('../types').Habit} habit
 * @param {number} days
 * @returns {number} 0–100
 */
export function getCompletionRate(habit, days = 7) {
  const dates = []
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }

  const scheduled = dates.filter((date) => {
    if (habit.frequency === 'daily') return true
    const dow = new Date(date).getDay()
    return habit.days.includes(dow)
  })

  if (scheduled.length === 0) return 0
  const done = scheduled.filter((d) => habit.completedDates.includes(d))
  return Math.round((done.length / scheduled.length) * 100)
}

/**
 * Day labels.
 */
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
