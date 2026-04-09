import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Timer, Repeat2, ChevronRight, Zap, BarChart3, Sun, Moon } from 'lucide-react'
import Footer from './Footer'
import './landing.css'

/* ── Theme Hook ─────────────────────────────────────────── */
function useLandingTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('focusflow_landing_theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-landing-theme', theme)
    localStorage.setItem('focusflow_landing_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}

/* ── Nav ────────────────────────────────────────────────────────── */
function LandingNav({ theme, toggleTheme }) {
  return (
    <nav className="landing-nav">
      <div className="landing-container landing-nav-inner">
        <Link to="/" className="landing-logo">
          <span className="landing-logo-name">FocusFlow</span>
        </Link>

        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#workflow" className="landing-nav-link">How it works</a>
          <Link to="/login" className="landing-nav-link">Login</Link>
          <button
            onClick={toggleTheme}
            className="landing-theme-btn"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/register" className="landing-cta-btn-sm">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="landing-container hero-content">
        <div className="hero-badge">
          <Zap size={11} />
          <span>Smart Productivity System</span>
        </div>

        <h1 className="hero-headline">
          Stop guessing<br />
          <span className="hero-headline-accent">what to do next.</span>
        </h1>

        <p className="hero-subtext">
          FocusFlow reads your energy level and surfaces the{' '}
          <strong>exact task</strong> you should work on right now.
          Smart scheduling, deep focus sessions, and habit tracking —
          all in one intentional system.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="hero-btn-primary">
            Get Started — It's free
            <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="hero-btn-secondary">
            Sign in
          </Link>
        </div>

        {/* App preview card */}
        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-dots">
                <span /><span /><span />
              </div>
              <span className="preview-title">FocusFlow · Dashboard</span>
            </div>
            <div className="preview-body">
              <div className="preview-energy-row">
                <span className="preview-label">Energy</span>
                <div className="preview-energy-btns">
                  <button className="preview-energy-btn">Low</button>
                  <button className="preview-energy-btn active">Medium</button>
                  <button className="preview-energy-btn">High</button>
                </div>
              </div>
              <div className="preview-suggested">
                <div className="preview-suggested-label">
                  <Zap size={11} />
                  <span>Recommended Task</span>
                </div>
                <div className="preview-task-card">
                  <div className="preview-task-title">Build the project structure</div>
                  <div className="preview-task-meta">
                    <span className="preview-tag preview-tag-red">Critical</span>
                    <span className="preview-tag preview-tag-purple">High focus</span>
                    <span className="preview-tag preview-tag-gray">~90 min</span>
                  </div>
                </div>
              </div>
              <div className="preview-stats">
                <div className="preview-stat">
                  <span className="preview-stat-num">12</span>
                  <span className="preview-stat-label">Tasks</span>
                </div>
                <div className="preview-stat">
                  <span className="preview-stat-num">4</span>
                  <span className="preview-stat-label">Due today</span>
                </div>
                <div className="preview-stat">
                  <span className="preview-stat-num">7</span>
                  <span className="preview-stat-label">Day streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Features ───────────────────────────────────────────────────── */
const features = [
  {
    icon: Brain,
    title: 'Smart Task Suggestion',
    desc: 'Tell FocusFlow your current energy level. It picks the most impactful pending task based on priority, deadline, and effort — not just the next item on a list.',
    tag: 'Priority Engine',
    color: 'feature-purple',
  },
  {
    icon: Timer,
    title: 'Deep Focus Sessions',
    desc: 'Start a Pomodoro-style timer linked to a specific task. Sessions are tracked, so your analytics reflect actual focused work — not just time passing.',
    tag: 'Flow State Mode',
    color: 'feature-blue',
  },
  {
    icon: Repeat2,
    title: 'Habit Tracking',
    desc: 'Build consistent routines with streak tracking, completion rates, and a visual activity heatmap. Small daily habits compound into meaningful progress.',
    tag: 'Compound Progress',
    color: 'feature-teal',
  },
  {
    icon: BarChart3,
    title: 'Focus Analytics',
    desc: 'See your productivity pattern over time — tasks completed per day, total focus minutes, habit consistency. Real data that actually helps you improve.',
    tag: 'Real Insights',
    color: 'feature-orange',
  },
]

function Features() {
  return (
    <section className="features-section" id="features">
      <div className="landing-container">
        <div className="section-header">
          <div className="section-badge">Features</div>
          <h2 className="section-title">Everything you need.<br />Nothing you don't.</h2>
          <p className="section-sub">
            A focused set of tools built for people who want to do better work —
            not manage more software.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className={`feature-card ${f.color}`}>
                <div className="feature-icon-wrap">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="feature-tag">{f.tag}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Workflow ───────────────────────────────────────────────────── */
const steps = [
  {
    num: '01',
    title: 'Plan',
    desc: 'Add tasks with deadlines, priority levels, and energy requirements. Connect them to focus sessions and habit goals.',
  },
  {
    num: '02',
    title: 'Decide',
    desc: 'Check in with your energy. FocusFlow surfaces the right task for your current mental state — no decision fatigue.',
  },
  {
    num: '03',
    title: 'Focus',
    desc: 'Start a tracked focus session. No distractions, no guessing. Just you and one task at a time.',
  },
  {
    num: '04',
    title: 'Improve',
    desc: 'Review your analytics weekly. See where your time goes. Refine habits and priorities based on real data.',
  },
]

function Workflow() {
  return (
    <section className="workflow-section" id="workflow">
      <div className="landing-container">
        <div className="section-header">
          <div className="section-badge">How it works</div>
          <h2 className="section-title">Four steps.<br />One system.</h2>
        </div>

        <div className="workflow-grid">
          {steps.map((step, i) => (
            <div key={step.num} className="workflow-step">
              <div className="workflow-step-num">{step.num}</div>
              {i < steps.length - 1 && <div className="workflow-connector" />}
              <h3 className="workflow-step-title">{step.title}</h3>
              <p className="workflow-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Final CTA ──────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="cta-section">
      <div className="cta-orb cta-orb-1" />

      <div className="landing-container cta-content">
        <h2 className="cta-title">
          Start building your<br />
          <span className="cta-title-accent">focus today.</span>
        </h2>
        <p className="cta-sub">
          Free to use. No credit card required.
          Takes 30 seconds to get started.
        </p>
        <div className="cta-actions">
          <Link to="/register" className="hero-btn-primary">
            Create free account
            <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="hero-btn-ghost">
            Already have an account
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function Landing() {
  const { theme, toggleTheme } = useLandingTheme()

  return (
    <div className="landing-root" data-theme={theme}>
      <LandingNav theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <Features />
      <Workflow />
      <FinalCTA />
      <Footer />
    </div>
  )
}
