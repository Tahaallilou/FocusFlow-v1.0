import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AUTH_KEY = 'focusflow_auth'

const AuthContext = createContext(null)

/**
 * Simple localStorage-based auth for demo purposes.
 * Stores user info + isAuthenticated flag.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const isAuthenticated = !!user

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  }, [user])

  const login = useCallback((email, password) => {
    // Check if there's a registered user
    const registered = JSON.parse(localStorage.getItem('focusflow_users') || '[]')
    const found = registered.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (found) {
      setUser({ email: found.email, name: found.name })
      return { success: true }
    }
    // Default demo user
    if (email === 'taha@focusflow.app' && password === 'demo123') {
      setUser({ email, name: 'Taha' })
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }, [])

  const register = useCallback((name, email, password) => {
    const registered = JSON.parse(localStorage.getItem('focusflow_users') || '[]')
    const exists = registered.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )
    if (exists) {
      return { success: false, error: 'An account with this email already exists' }
    }
    registered.push({ name, email, password })
    localStorage.setItem('focusflow_users', JSON.stringify(registered))
    setUser({ email, name })
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
