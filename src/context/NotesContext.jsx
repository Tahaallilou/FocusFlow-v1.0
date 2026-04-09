import { createContext, useContext, useEffect } from 'react'
import { generateId } from '../utils/taskUtils'
import { useEnhancedReducer } from '../hooks/useEnhancedReducer'

const STORAGE_KEY = 'productivity_notes'

const initialState = {
  notes: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
}

function notesReducer(state, action) {
  switch (action.type) {
    case 'ADD_NOTE': {
      const newNote = {
        id: generateId(),
        content: '',
        createdAt: Date.now(),
        ...action.payload,
      }
      return { ...state, notes: [newNote, ...state.notes] }
    }
    case 'UPDATE_NOTE': {
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload.id ? { ...n, ...action.payload } : n
        ),
      }
    }
    case 'DELETE_NOTE': {
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
      }
    }
    default:
      return state
  }
}

const NotesContext = createContext(null)

export function NotesProvider({ children }) {
  const [state, dispatch] = useEnhancedReducer(notesReducer, initialState, 'notes')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.notes))
  }, [state.notes])

  const actions = {
    addNote: (note) => dispatch({ type: 'ADD_NOTE', payload: note }),
    updateNote: (note) => dispatch({ type: 'UPDATE_NOTE', payload: note }),
    deleteNote: (id) => dispatch({ type: 'DELETE_NOTE', payload: id }),
  }

  return (
    <NotesContext.Provider value={{ state, ...actions }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
