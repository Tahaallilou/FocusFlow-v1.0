import { createContext, useContext, useEffect } from 'react'
import { generateId } from '../utils/taskUtils'
import { useEnhancedReducer } from '../hooks/useEnhancedReducer'

const STORAGE_KEY = 'productivity_tasks'

/** @type {import('../types').Task[]} */
const initialState = {
  tasks: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask = {
        id: generateId(),
        title: '',
        description: '',
        deadline: null,
        difficulty: 3,
        energyRequired: 'medium',
        priority: 3,
        estimatedTime: 30,
        focusRequired: false,
        completed: false,
        createdAt: Date.now(),
        ...action.payload,
      }
      return { ...state, tasks: [...state.tasks, newTask] }
    }
    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      }
    }
    case 'DELETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      }
    }
    case 'TOGGLE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        ),
      }
    }
    default:
      return state
  }
}

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const [state, dispatch] = useEnhancedReducer(taskReducer, initialState, 'tasks')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks))
  }, [state.tasks])

  const actions = {
    addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
    updateTask: (task) => dispatch({ type: 'UPDATE_TASK', payload: task }),
    deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
    toggleTask: (id) => dispatch({ type: 'TOGGLE_TASK', payload: id }),
  }

  return (
    <TaskContext.Provider value={{ state, ...actions }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}
