import { useState, useEffect } from 'react'

const NAV_LINKS = ['about', 'projects', 'skills', 'education', 'contact']

function getInitialTheme() {
  const stored = localStorage.getItem('theme')
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600)
  const [theme, setTheme] = useState(getInitialTheme)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const el = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    const onResize = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <>
      {/* scroll progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 101,
        height: '2px', background: 'var(--accent)',
        width: `${progress}%`, transition: 'width 0.1s linear',
        pointerEvents: 'none',
      }} />

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '64px',
        background: scrolled || menuOpen ? 'var(--nav-bg)' : 'transparent',
        borderBottom: scrolled || menuOpen ? '0.5px solid var(--border)' : '0.5px solid transparent',
        transition: 'background 0.3s, border-color 0.3s',
        transform: 'translateZ(0)',
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          NH_
        </span>

        {/* desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link}`} style={{
                fontFamily: 'var(--mono)', fontSize: '13px',
                color: active === link ? 'var(--accent)' : 'var(--muted)',
                textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}>{link}</a>
            ))}
            <button onClick={toggleTheme} title="Toggle theme" style={{
              background: 'none', border: '0.5px solid var(--border)', cursor: 'pointer',
              color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '11px',
              padding: '4px 8px', letterSpacing: '0.08em', transition: 'color 0.2s',
            }}>
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </div>
        )}

        {/* mobile controls */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={toggleTheme} style={{
              background: 'none', border: '0.5px solid var(--border)', cursor: 'pointer',
              color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '11px',
              padding: '4px 8px',
            }}>
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ display: 'flex', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <span style={{ display: 'block', width: '20px', height: '1.5px', background: menuOpen ? 'var(--accent)' : 'var(--muted)', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span style={{ display: menuOpen ? 'none' : 'block', width: '20px', height: '1.5px', background: 'var(--muted)' }} />
              <span style={{ display: 'block', width: '20px', height: '1.5px', background: menuOpen ? 'var(--accent)' : 'var(--muted)', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>
          </div>
        )}
      </nav>

      {/* mobile menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 99,
          background: 'var(--bg)', borderBottom: '0.5px solid var(--border)',
          padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '4px'
        }}>
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href={`#${link}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--mono)', fontSize: '14px',
                color: active === link ? 'var(--accent)' : 'var(--muted)',
                textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '12px 0', borderBottom: '0.5px solid var(--border)',
                transition: 'color 0.2s',
              }}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
