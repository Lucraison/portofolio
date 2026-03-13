import { useState, useEffect } from 'react'

const NAV_LINKS = ['about', 'projects', 'skills', 'contact']

export default function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: '56px',
      background: scrolled ? 'var(--nav-bg)' : 'transparent',
      borderBottom: scrolled ? '0.5px solid var(--border)' : '0.5px solid transparent',
      transition: 'background 0.3s, border-color 0.3s',
      transform: 'translateZ(0)',
    }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.05em' }}>
        NHS_
      </span>
      <div style={{ display: 'flex', gap: '32px' }}>
        {NAV_LINKS.map(link => (
          <a key={link} href={`#${link}`} style={{
            fontFamily: 'var(--mono)', fontSize: '11px',
            color: active === link ? 'var(--accent)' : 'var(--muted)',
            textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}>{link}</a>
        ))}
      </div>
    </nav>
  )
}