import { createContext, useContext, useEffect } from 'react'
import { generateId } from '../utils/taskUtils'
import { getTodayString } from '../utils/habitUtils'
import { useEnhancedReducer } from '../hooks/useEnhancedReducer'

const STORAGE_KEY = 'productivity_habits'

const initialState = {
  habits: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
}

function habitReducer(state, action) {
  switch (action.type) {
    case 'ADD_HABIT': {
      const newHabit = {
        id: generateId(),
        name: '',
        frequency: 'daily',
        days: [0, 1, 2, 3, 4, 5, 6],
        completedDates: [],
        createdAt: Date.now(),
        ...action.payload,
      }
      return { ...state, habits: [...state.habits, newHabit] }
    }
    case 'UPDATE_HABIT': {
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === action.payload.id ? { ...h, ...action.payload } : h
        ),
      }
    }
    case 'DELETE_HABIT': {
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.payload),
      }
    }
    case 'MARK_HABIT_DONE': {
      const today = getTodayString()
      return {
        ...state,
        habits: state.habits.map((h) => {
          if (h.id !== action.payload) return h
          const already = h.completedDates.includes(today)
          return {
            ...h,
            completedDates: already
              ? h.completedDates.filter((d) => d !== today)
              : [...h.completedDates, today],
          }
        }),
      }
    }
    default:
      return state
  }
}

const HabitContext = createContext(null)

export function HabitProvider({ children }) {
  const [state, dispatch] = useEnhancedReducer(habitReducer, initialState, 'habits')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.habits))
  }, [state.habits])

  const actions = {
    addHabit: (habit) => dispatch({ type: 'ADD_HABIT', payload: habit }),
    updateHabit: (habit) => dispatch({ type: 'UPDATE_HABIT', payload: habit }),
    deleteHabit: (id) => dispatch({ type: 'DELETE_HABIT', payload: id }),
    markHabitDone: (id) => dispatch({ type: 'MARK_HABIT_DONE', payload: id }),
  }

  return (
    <HabitContext.Provider value={{ state, ...actions }}>
      {children}
    </HabitContext.Provider>
  )
}

export function useHabits() {
  const ctx = useContext(HabitContext)
  if (!ctx) throw new Error('useHabits must be used within HabitProvider')
  return ctx
}
