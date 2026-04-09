import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, Zap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import '../Landing/landing.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Tiny artificial delay for UX
    await new Promise((r) => setTimeout(r, 400))

    const result = login(email, password)

    if (result.success) {
      navigate('/app')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  const handleDemo = async () => {
    setError('')
    setLoading(true)
    setEmail('taha@focusflow.app')
    setPassword('demo123')
    await new Promise((r) => setTimeout(r, 300))
    const result = login('taha@focusflow.app', 'demo123')
    if (result.success) navigate('/app')
    setLoading(false)
  }

  return (
    <div className="auth-root">
      {/* Nav */}
      <nav className="auth-nav">
        <Link to="/" className="auth-nav-logo">
          <span className="auth-nav-logo-name">FocusFlow</span>
        </Link>
        <Link to="/register" className="auth-nav-link">
          Don't have an account? <strong>Sign up</strong>
        </Link>
      </nav>

      {/* Main */}
      <main className="auth-main">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />

        <div className="auth-card">
          {/* Header */}
          <div className="auth-card-header">
            <div className="auth-card-icon">
              <Zap size={22} color="white" strokeWidth={2} />
            </div>
            <h1 className="auth-card-title">Welcome back</h1>
            <p className="auth-card-sub">
              Sign in to your FocusFlow workspace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error-msg" style={{ marginBottom: '16px' }}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">Email address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <Mail size={15} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  className={`auth-input ${error ? 'error' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <Lock size={15} />
                </span>
                <input
                  id="login-password"
                  type="password"
                  className={`auth-input ${error ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                'Signing in…'
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <div className="auth-divider-line" />
            </div>

            <button
              type="button"
              className="auth-demo-btn"
              onClick={handleDemo}
              disabled={loading}
              id="demo-login-btn"
            >
              <Zap size={14} />
              Continue with demo account
            </button>

            
          </form>

          <div className="auth-footer-text">
            New to FocusFlow?{' '}
            <Link to="/register" className="auth-footer-link">
              Create a free account
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
