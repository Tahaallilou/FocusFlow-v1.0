import { createContext, useContext, useReducer, useEffect } from 'react'

const STORAGE_KEY = 'productivity_settings'

const defaultSettings = {
  focusDuration: 25,
  theme: 'light',
  shortBreak: 5,
  longBreak: 15,
}

const initialState = {
  ...defaultSettings,
  ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
}

function settingsReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return { ...state, ...action.payload }
    case 'RESET_SETTINGS':
      return { ...defaultSettings }
    default:
      return state
  }
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Apply theme to html element
  useEffect(() => {
    const html = document.documentElement
    if (state.theme === 'light') {
      html.classList.add('light')
      html.classList.remove('dark')
    } else {
      html.classList.remove('light')
      html.classList.add('dark')
    }
  }, [state.theme])

  const actions = {
    updateSettings: (settings) =>
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    resetSettings: () => dispatch({ type: 'RESET_SETTINGS' }),
  }

  return (
    <SettingsContext.Provider value={{ state, ...actions }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
