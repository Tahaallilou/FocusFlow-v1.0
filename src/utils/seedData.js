/**
 * Seed data for MindFlow — Moroccan OFPPT Full Stack Developer student
 * User persona: Taha Allilou, 2nd year OFPPT student in Développement Digital
 */

const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000
const now = Date.now()
const d = (daysOffset, hoursOffset = 0) => now + daysOffset * DAY + hoursOffset * HOUR
const dateStr = (daysOffset) => {
  const dt = new Date(now + daysOffset * DAY)
  return dt.toISOString().split('T')[0]
}
const todayStr = dateStr(0)

const lastNDays = (n) => Array.from({ length: n }, (_, i) => dateStr(-(n - 1 - i)))

export function seedLocalStorage() {
  // ── TASKS ────────────────────────────────────────────────────────────────
  const tasks = [
    // OVERDUE
    {
      id: 't1', title: 'Build REST API for blog project',
      description: 'Create Express.js CRUD endpoints for posts, comments, and users. Include JWT authentication middleware and input validation with Joi.',
      deadline: d(-3, 14), difficulty: 4, energyRequired: 'high',
      priority: 5, estimatedTime: 180, focusRequired: true,
      completed: false, createdAt: d(-8),
    },
    {
      id: 't2', title: 'Fix React Router 404 on refresh',
      description: 'Production build returns 404 on nested routes like /dashboard/tasks. Need to configure Vite proxy or add catch-all redirect.',
      deadline: d(-1, 10), difficulty: 3, energyRequired: 'medium',
      priority: 4, estimatedTime: 45, focusRequired: true,
      completed: false, createdAt: d(-5),
    },

    // DUE TODAY
    {
      id: 't3', title: 'Complete MongoDB aggregation exercises',
      description: 'TP exercises on $lookup, $unwind, $group, and $project operators. Submit to Moodle before 23:59.',
      deadline: d(0, 23), difficulty: 3, energyRequired: 'medium',
      priority: 4, estimatedTime: 90, focusRequired: true,
      completed: false, createdAt: d(-2),
    },
    {
      id: 't4', title: 'Prepare UML diagrams for PFE',
      description: 'Draw use case diagram and class diagram for the e-commerce platform project using StarUML.',
      deadline: d(0, 18), difficulty: 2, energyRequired: 'medium',
      priority: 3, estimatedTime: 60, focusRequired: false,
      completed: false, createdAt: d(-3),
    },

    // DUE TOMORROW
    {
      id: 't5', title: 'Implement useContext for cart state',
      description: 'Replace prop drilling with React Context API for the shopping cart. Create CartContext with add, remove, and update quantity actions.',
      deadline: d(1, 16), difficulty: 3, energyRequired: 'medium',
      priority: 4, estimatedTime: 75, focusRequired: true,
      completed: false, createdAt: d(-1),
    },

    // THIS WEEK
    {
      id: 't6', title: 'Design MySQL schema for e-commerce PFE',
      description: 'Normalize tables for products, categories, orders, order_items, and users. Add indexes for performance. Write SQL creation script.',
      deadline: d(3, 17), difficulty: 5, energyRequired: 'high',
      priority: 5, estimatedTime: 150, focusRequired: true,
      completed: false, createdAt: d(-4),
    },
    {
      id: 't7', title: 'Write Jest tests for auth controller',
      description: 'Unit tests for register, login, and token refresh endpoints. Mock bcrypt and jsonwebtoken. Target 80% coverage.',
      deadline: d(4, 14), difficulty: 4, energyRequired: 'high',
      priority: 4, estimatedTime: 120, focusRequired: true,
      completed: false, createdAt: d(-2),
    },
    {
      id: 't8', title: 'Review JavaScript ES6+ notes for exam',
      description: 'Study destructuring, spread/rest, promises, async/await, and modules. Create flashcards for key concepts.',
      deadline: d(5, 9), difficulty: 2, energyRequired: 'low',
      priority: 3, estimatedTime: 60, focusRequired: false,
      completed: false, createdAt: d(-3),
    },
    {
      id: 't9', title: 'Build Tailwind responsive navbar',
      description: 'Create a mobile-first responsive navigation with hamburger menu, dropdown, and smooth transitions using Tailwind CSS.',
      deadline: d(2, 15), difficulty: 2, energyRequired: 'medium',
      priority: 3, estimatedTime: 45, focusRequired: false,
      completed: false, createdAt: d(-1),
    },

    // FUTURE
    {
      id: 't10', title: 'Deploy PFE to Vercel + Railway',
      description: 'Deploy React frontend to Vercel, Node.js backend to Railway. Configure environment variables and CORS policies.',
      deadline: d(14, 12), difficulty: 3, energyRequired: 'medium',
      priority: 3, estimatedTime: 90, focusRequired: false,
      completed: false, createdAt: d(0),
    },
    {
      id: 't11', title: 'Record PFE demo video',
      description: 'Screen record the full app walkthrough: login, product browsing, cart, checkout, and admin dashboard. Keep under 10 minutes.',
      deadline: d(18, 10), difficulty: 2, energyRequired: 'low',
      priority: 2, estimatedTime: 60, focusRequired: false,
      completed: false, createdAt: d(0),
    },

    // COMPLETED
    {
      id: 't12', title: 'Set up Node.js project with Express',
      description: 'Initialize npm project, install Express, cors, dotenv, mongoose. Configure folder structure (routes, controllers, models, middleware).',
      deadline: d(-12), difficulty: 2, energyRequired: 'medium',
      priority: 4, estimatedTime: 45, focusRequired: false,
      completed: true, createdAt: d(-15),
    },
    {
      id: 't13', title: 'Complete React hooks TP',
      description: 'OFPPT TP on useState, useEffect, useRef, useMemo. Build a todo list and a counter app.',
      deadline: d(-8), difficulty: 2, energyRequired: 'medium',
      priority: 3, estimatedTime: 90, focusRequired: true,
      completed: true, createdAt: d(-10),
    },
    {
      id: 't14', title: 'CSS Flexbox & Grid layout exercises',
      description: 'Complete 15 exercises on responsive layouts using both Flexbox and CSS Grid. Submit screenshots.',
      deadline: d(-6), difficulty: 1, energyRequired: 'low',
      priority: 2, estimatedTime: 60, focusRequired: false,
      completed: true, createdAt: d(-9),
    },
    {
      id: 't15', title: 'Connect React frontend to Express API',
      description: 'Set up Axios interceptors, create API service layer, handle loading states and error boundaries.',
      deadline: d(-4), difficulty: 3, energyRequired: 'high',
      priority: 4, estimatedTime: 120, focusRequired: true,
      completed: true, createdAt: d(-7),
    },
    {
      id: 't16', title: 'Git & GitHub workshop exercises',
      description: 'Practice branching, merging, rebasing, and pull requests. Resolve merge conflicts in the sample repo.',
      deadline: d(-2), difficulty: 2, energyRequired: 'low',
      priority: 3, estimatedTime: 45, focusRequired: false,
      completed: true, createdAt: d(-4),
    },
  ]

  // ── HABITS ──────────────────────────────────────────────────────────────
  const all30 = lastNDays(30)
  const skipEvery3 = (arr) => arr.filter((_, i) => i % 3 !== 2)

  const habits = [
    {
      id: 'h1', name: 'Code for at least 2 hours',
      frequency: 'daily', days: [0,1,2,3,4,5,6],
      completedDates: [...all30.slice(-26), todayStr],
      createdAt: d(-45),
    },
    {
      id: 'h2', name: 'Study new programming concept',
      frequency: 'daily', days: [1,2,3,4,5],
      completedDates: skipEvery3(all30.slice(-22)),
      createdAt: d(-35),
    },
    {
      id: 'h3', name: 'Solve 1 algorithm problem',
      frequency: 'daily', days: [0,1,2,3,4,5,6],
      completedDates: all30.filter((_, i) => i % 4 !== 3),
      createdAt: d(-30),
    },
    {
      id: 'h4', name: 'Read tech article or docs (30 min)',
      frequency: 'daily', days: [0,1,2,3,4,5,6],
      completedDates: [...skipEvery3(all30.slice(-18)), todayStr],
      createdAt: d(-25),
    },
    {
      id: 'h5', name: 'Weekly project review',
      frequency: 'custom', days: [0],
      completedDates: [dateStr(-21), dateStr(-14), dateStr(-7)],
      createdAt: d(-30),
    },
    {
      id: 'h6', name: 'No phone while studying',
      frequency: 'daily', days: [1,2,3,4,5],
      completedDates: all30.slice(-20),
      createdAt: d(-22),
    },
    {
      id: 'h7', name: 'Push to GitHub daily',
      frequency: 'daily', days: [0,1,2,3,4,5,6],
      completedDates: [...all30.slice(-24)],
      createdAt: d(-28),
    },
  ]

  // ── FOCUS SESSIONS ───────────────────────────────────────────────────────
  const sessions = [
    { id: 's1',  taskId: 't12', startTime: d(-6, 9),  duration: 1500, completed: true },
    { id: 's2',  taskId: 't12', startTime: d(-6, 11), duration: 1500, completed: true },
    { id: 's3',  taskId: 't13', startTime: d(-5, 10), duration: 2700, completed: true },
    { id: 's4',  taskId: 't13', startTime: d(-5, 14), duration: 1500, completed: true },
    { id: 's5',  taskId: 't15', startTime: d(-4, 9),  duration: 1500, completed: true },
    { id: 's6',  taskId: 't14', startTime: d(-3, 15), duration: 900,  completed: true },
    { id: 's7',  taskId: 't16', startTime: d(-2, 10), duration: 1500, completed: true },
    { id: 's8',  taskId: 't3',  startTime: d(-1, 11), duration: 2700, completed: true },
    { id: 's9',  taskId: 't1',  startTime: d(-1, 14), duration: 1500, completed: true },
    { id: 's10', taskId: 't6',  startTime: d(0, 8),   duration: 1500, completed: true },
    { id: 's11', taskId: 't5',  startTime: d(0, 10),  duration: 1800, completed: true },
  ]

  // ── NOTES ────────────────────────────────────────────────────────────────
  const notes = [
    {
      id: 'n1',
      content: 'PFE idea: E-commerce platform with React + Node.js + MySQL. Features: product catalog, shopping cart, Stripe checkout, admin panel with analytics.',
      createdAt: d(-14),
    },
    {
      id: 'n2',
      content: 'Express middleware execution order:\n1. Body parser\n2. CORS\n3. Auth middleware (JWT verify)\n4. Route handlers\n5. Error handler (must be last)',
      createdAt: d(-10),
    },
    {
      id: 'n3',
      content: 'Resources to study:\n- Node.js docs: streams, events, cluster\n- React Router v6 docs\n- MongoDB University free courses\n- freeCodeCamp: REST API tutorial',
      createdAt: d(-7),
    },
    {
      id: 'n4',
      content: 'Useful VS Code extensions for MERN stack:\n- ES7+ React snippets\n- Thunder Client (API testing)\n- MongoDB for VS Code\n- Prettier + ESLint',
      createdAt: d(-5),
    },
    {
      id: 'n5',
      content: 'JWT flow for PFE auth:\n1. User sends credentials to /api/auth/login\n2. Server validates and returns access + refresh token\n3. Client stores tokens in httpOnly cookies\n4. Axios interceptor adds Authorization header\n5. Refresh token endpoint for silent renewal',
      createdAt: d(-3),
    },
    {
      id: 'n6',
      content: 'MySQL vs MongoDB comparison for the exam:\n- MySQL: ACID compliance, structured data, JOINs, SQL syntax\n- MongoDB: flexible schema, horizontal scaling, aggregation pipeline\n- Use case: MySQL for transactions (e-commerce), MongoDB for content/logs',
      createdAt: d(-2),
    },
    {
      id: 'n7',
      content: 'This week priorities:\n1. Finish REST API for PFE\n2. Complete MongoDB TP\n3. Study for JS exam on Friday\n4. Push all code to GitHub',
      createdAt: d(0),
    },
  ]

  // ── SETTINGS ─────────────────────────────────────────────────────────────
  const settings = {
    focusDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    theme: 'dark',
  }

  // ── WRITE TO LOCALSTORAGE ────────────────────────────────────────────────
  localStorage.setItem('productivity_tasks', JSON.stringify(tasks))
  localStorage.setItem('productivity_habits', JSON.stringify(habits))
  localStorage.setItem('productivity_sessions', JSON.stringify(sessions))
  localStorage.setItem('productivity_notes', JSON.stringify(notes))
  localStorage.setItem('productivity_settings', JSON.stringify(settings))

  return { tasks, habits, sessions, notes }
}
