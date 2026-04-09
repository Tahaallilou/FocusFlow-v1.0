import { createContext, useContext, useEffect } from 'react'
import { generateId } from '../utils/taskUtils'
import { useEnhancedReducer } from '../hooks/useEnhancedReducer'

const STORAGE_KEY = 'productivity_sessions'

const initialState = {
  sessions: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
}

function sessionReducer(state, action) {
  switch (action.type) {
    case 'ADD_SESSION': {
      const newSession = {
        id: generateId(),
        taskId: '',
        startTime: Date.now(),
        duration: 0,
        completed: false,
        ...action.payload,
      }
      return { ...state, sessions: [...state.sessions, newSession] }
    }
    case 'UPDATE_SESSION': {
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload } : s
        ),
      }
    }
    case 'DELETE_SESSION': {
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== action.payload),
      }
    }
    default:
      return state
  }
}

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [state, dispatch] = useEnhancedReducer(sessionReducer, initialState, 'sessions')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.sessions))
  }, [state.sessions])

  const actions = {
    addSession: (session) => dispatch({ type: 'ADD_SESSION', payload: session }),
    updateSession: (session) => dispatch({ type: 'UPDATE_SESSION', payload: session }),
    deleteSession: (id) => dispatch({ type: 'DELETE_SESSION', payload: id }),
  }

  return (
    <SessionContext.Provider value={{ state, ...actions }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSessions() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSessions must be used within SessionProvider')
  return ctx
}
