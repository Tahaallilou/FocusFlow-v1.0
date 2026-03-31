/**
 * Compute deadline urgency score for a task.
 * @param {number|null} deadline - timestamp in ms
 * @returns {number} 0–1
 */
function deadlineScore(deadline) {
  if (!deadline) return 0
  const now = Date.now()
  const timeLeft = deadline - now
  if (timeLeft <= 0) return 1
  if (timeLeft < 24 * 60 * 60 * 1000) return 0.9
  if (timeLeft < 3 * 24 * 60 * 60 * 1000) return 0.7
  return 0.4
}

/**
 * Compute energy match score.
 * @param {'low'|'medium'|'high'} userEnergy
 * @param {'low'|'medium'|'high'} taskEnergy
 * @returns {number}
 */
function energyMatch(userEnergy, taskEnergy) {
  if (userEnergy === taskEnergy) return 1
  const levels = { low: 0, medium: 1, high: 2 }
  const diff = Math.abs(levels[userEnergy] - levels[taskEnergy])
  return diff === 1 ? 0.7 : 0.3
}

/**
 * Find the best task to work on given current energy level.
 * @param {import('../types').Task[]} tasks
 * @param {'low'|'medium'|'high'} energyLevel
 * @returns {import('../types').Task|null}
 */
export function getBestTask(tasks, energyLevel) {
  const pending = tasks.filter((t) => !t.completed)
  if (pending.length === 0) return null

  return pending.reduce((best, task) => {
    const ds = deadlineScore(task.deadline)
    const em = energyMatch(energyLevel, task.energyRequired)
    const ps = (task.priority || 1) / 5
    const score = ds * 0.4 + ps * 0.3 + em * 0.3

    const bestDs = deadlineScore(best.deadline)
    const bestEm = energyMatch(energyLevel, best.energyRequired)
    const bestPs = (best.priority || 1) / 5
    const bestScore = bestDs * 0.4 + bestPs * 0.3 + bestEm * 0.3

    return score > bestScore ? task : best
  })
}

/**
 * Classify a task for the Eisenhower matrix.
 * @param {import('../types').Task} task
 * @returns {{ urgent: boolean, important: boolean }}
 */
export function classifyTask(task) {
  const now = Date.now()
  const urgent = task.deadline
    ? task.deadline - now < 48 * 60 * 60 * 1000
    : false
  const important = task.priority >= 4
  return { urgent, important }
}

/**
 * Get tasks that are due today.
 * @param {import('../types').Task[]} tasks
 * @returns {import('../types').Task[]}
 */
export function getTodayTasks(tasks) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return tasks.filter((t) => {
    if (!t.deadline) return false
    const d = new Date(t.deadline)
    return d >= today && d < tomorrow
  })
}

/**
 * Format a timestamp nicely.
 * @param {number} ts
 * @returns {string}
 */
export function formatDeadline(ts) {
  if (!ts) return 'No deadline'
  const d = new Date(ts)
  const now = new Date()
  const diff = ts - Date.now()

  if (diff < 0) return 'Overdue'
  if (diff < 24 * 60 * 60 * 1000) {
    return 'Due today'
  }
  if (diff < 48 * 60 * 60 * 1000) {
    return 'Due tomorrow'
  }

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Generate a unique ID.
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Priority label map.
 */
export const PRIORITY_LABELS = {
  1: 'Minimal',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Critical',
}

/**
 * Energy level config.
 */
export const ENERGY_LEVELS = [
  { value: 'low', label: 'Low', iconName: 'Moon' },
  { value: 'medium', label: 'Medium', iconName: 'Zap' },
  { value: 'high', label: 'High', iconName: 'Flame' },
]
