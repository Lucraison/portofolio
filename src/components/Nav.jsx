import { useState, useEffect } from 'react'

const NAV_LINKS = ['about', 'projects', 'skills', 'contact']

export default function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '56px',
        background: scrolled || menuOpen ? 'var(--nav-bg)' : 'transparent',
        borderBottom: scrolled || menuOpen ? '0.5px solid var(--border)' : '0.5px solid transparent',
        transition: 'background 0.3s, border-color 0.3s',
        transform: 'translateZ(0)',
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          NH_
        </span>

        {/* desktop links */}
        <div style={{ display: 'flex', gap: '32px', '@media(max-width:600px)': { display: 'none' } }}>
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link}`} style={{
              fontFamily: 'var(--mono)', fontSize: '11px',
              color: active === link ? 'var(--accent)' : 'var(--muted)',
              textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase',
              transition: 'color 0.2s',
              display: window.innerWidth < 600 ? 'none' : 'block'
            }}>{link}</a>
          ))}
        </div>

        {/* hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: window.innerWidth < 600 ? 'flex' : 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <span style={{ display: 'block', width: '20px', height: '1.5px', background: menuOpen ? 'var(--accent)' : 'var(--muted)', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ display: menuOpen ? 'none' : 'block', width: '20px', height: '1.5px', background: 'var(--muted)' }} />
          <span style={{ display: 'block', width: '20px', height: '1.5px', background: menuOpen ? 'var(--accent)' : 'var(--muted)', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </nav>

      {/* mobile menu */}
      {menuOpen && (
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