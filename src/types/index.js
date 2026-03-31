/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number|null} deadline - timestamp (ms)
 * @property {number} difficulty - 1–5
 * @property {'low'|'medium'|'high'} energyRequired
 * @property {number} priority - 1–5
 * @property {number} estimatedTime - minutes
 * @property {boolean} focusRequired
 * @property {boolean} completed
 * @property {number} createdAt - timestamp (ms)
 */

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {'daily'|'custom'} frequency
 * @property {number[]} days - 0=Sunday...6=Saturday
 * @property {string[]} completedDates - "YYYY-MM-DD"
 */

/**
 * @typedef {Object} FocusSession
 * @property {string} id
 * @property {string} taskId
 * @property {number} startTime - timestamp (ms)
 * @property {number} duration - seconds
 * @property {boolean} completed
 */

/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} content
 * @property {number} createdAt - timestamp (ms)
 */

/**
 * @typedef {Object} Settings
 * @property {number} focusDuration - minutes (default 25)
 * @property {'dark'|'light'} theme
 */
