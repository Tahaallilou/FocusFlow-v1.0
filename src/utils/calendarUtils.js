/**
 * Determine task status for calendar event coloring.
 * @param {object} task
 * @returns {'completed'|'overdue'|'pending'}
 */
export function getTaskStatus(task) {
  if (task.completed) return 'completed'
  if (task.deadline && new Date(task.deadline) < new Date()) return 'overdue'
  return 'pending'
}

/**
 * Get inline style object for a calendar event based on status.
 * @param {'completed'|'overdue'|'pending'} status
 * @returns {object}
 */
export function getEventStyle(status) {
  const colors = {
    completed: '#10B981',
    overdue: '#EF4444',
    pending: '#7C6CF2',
  }

  return {
    backgroundColor: colors[status] || colors.pending,
    border: 'none',
    borderRadius: '4px',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '500',
    padding: '2px 6px',
  }
}
