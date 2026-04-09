import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Zap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import '../Landing/landing.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.name.trim().length < 2) {
      setError('Please enter your full name')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))

    const result = register(form.name.trim(), form.email.trim(), form.password)

    if (result.success) {
      navigate('/app')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  const passwordStrength = () => {
    const p = form.password
    if (!p) return null
    if (p.length < 6) return { label: 'Too short', color: '#ef4444', width: '25%' }
    if (p.length < 8) return { label: 'Weak', color: '#f59e0b', width: '50%' }
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: 'Strong', color: '#22c55e', width: '100%' }
    return { label: 'Good', color: '#3b82f6', width: '75%' }
  }

  const strength = passwordStrength()

  return (
    <div className="auth-root">
      {/* Nav */}
      <nav className="auth-nav">
        <Link to="/" className="auth-nav-logo">
          <span className="auth-nav-logo-name">FocusFlow</span>
        </Link>
        <Link to="/login" className="auth-nav-link">
          Already have an account? <strong>Sign in</strong>
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
            <h1 className="auth-card-title">Create your account</h1>
            <p className="auth-card-sub">
              Join FocusFlow and start building real focus
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
            {/* Name */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-name">Full name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <User size={15} />
                </span>
                <input
                  id="reg-name"
                  type="text"
                  className="auth-input"
                  placeholder="Taha Allilou"
                  value={form.name}
                  onChange={set('name')}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-email">Email address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <Mail size={15} />
                </span>
                <input
                  id="reg-email"
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <Lock size={15} />
                </span>
                <input
                  id="reg-password"
                  type="password"
                  className="auth-input"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="new-password"
                  required
                />
              </div>
              {/* Strength indicator */}
              {strength && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: '2px', transition: 'width 0.3s, background 0.3s' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: strength.color, fontFamily: 'Inter, sans-serif', fontWeight: 600, whiteSpace: 'nowrap' }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-confirm">Confirm password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  {form.confirm && form.password === form.confirm
                    ? <CheckCircle size={15} style={{ color: '#22c55e' }} />
                    : <Lock size={15} />
                  }
                </span>
                <input
                  id="reg-confirm"
                  type="password"
                  className={`auth-input ${form.confirm && form.password !== form.confirm ? 'error' : ''}`}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
              id="register-submit-btn"
            >
              {loading ? (
                'Creating account…'
              ) : (
                <>
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer-text">
            Already a member?{' '}
            <Link to="/login" className="auth-footer-link">
              Sign in instead
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
