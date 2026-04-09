import { Link } from 'react-router-dom'

const cols = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Focus System', href: '#workflow' },
      { label: 'Habit Tracker', href: '#features' },
      { label: 'Analytics', href: '#features' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Sign in', href: '/login' },
      { label: 'Create account', href: '/register' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-container footer-inner">
        <div className="footer-brand">
          <p className="footer-big-title">Build your<br />focus.</p>
          <div className="footer-logo-row">
            <span className="footer-logo-name">FocusFlow</span>
          </div>
        </div>

        <div className="footer-cols">
          {cols.map((col) => (
            <div key={col.heading} className="footer-col">
              <p className="footer-col-heading">{col.heading}</p>
              <ul className="footer-col-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className="footer-link">{link.label}</Link>
                    ) : (
                      <a href={link.href} className="footer-link">{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-divider" />

      <div className="landing-container footer-bottom">
        <span className="footer-copy">FocusFlow © 2026 — Built for focused people.</span>
        <div className="footer-legal">
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
        </div>
      </div>
    </footer>
  )
}
