import { useEffect, useState } from 'react'
import useTypewriter from '../hooks/useTypewriter'

const anim = (delay) => ({
  opacity: 0,
  animation: 'heroReveal 0.9s ease forwards',
  animationDelay: delay,
})

export default function Hero() {
  const [views, setViews] = useState(null)

  useEffect(() => {
    const visited = sessionStorage.getItem('viewed')
    const method = visited ? 'GET' : 'POST'
    if (!visited) sessionStorage.setItem('viewed', '1')
    fetch('/api/views', { method })
      .then(r => r.json())
      .then(d => setViews(typeof d.count === 'number' ? d.count : null))
      .catch(() => setViews(null))
  }, [])

  const typedRef = useTypewriter([
    'open to work',
    'ai-driven engineer',
    'full stack in progress',
    'based in antwerp, belgium',
    'always learning',
  ])

  return (
    <section id="about" style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: '120px 40px 80px',
      position: 'relative',
      borderBottom: '1px solid var(--accent)',
      overflow: 'hidden',
      textAlign: 'center',
    }}>

      {/* Grain overlay */}
      <div style={{
        position: 'absolute', inset: '-50%',
        width: '200%', height: '200%',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
        opacity: 0.04,
        pointerEvents: 'none',
      }} />

      {/* Crimson glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(220, 20, 60, 0.09) 0%, transparent 65%)',
      }} />

      {/* Ghost name behind everything */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(-8deg)',
        fontFamily: 'var(--mono)',
        fontSize: 'clamp(120px, 22vw, 300px)',
        fontWeight: 500,
        color: 'transparent',
        WebkitTextStroke: '1px rgba(220, 20, 60, 0.06)',
        letterSpacing: '-0.04em',
        lineHeight: 0.9,
        userSelect: 'none', pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        NH
      </div>

      {/* Foreground */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Location tag */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '10px',
          color: 'var(--muted)', letterSpacing: '0.25em',
          textTransform: 'uppercase', marginBottom: '32px',
          ...anim('0.1s'),
        }}>
          Antwerp, Belgium — Developer
        </div>

        {/* Name — three-line typographic treatment */}
        <h1 style={{
          fontFamily: 'var(--mono)', lineHeight: 0.95,
          letterSpacing: '-0.03em', marginBottom: '36px',
          ...anim('0.25s'),
        }}>
          {/* Line 1: thin */}
          <span style={{
            display: 'block',
            fontSize: 'clamp(52px, 9vw, 110px)',
            fontWeight: 300,
            color: 'var(--text)',
          }}>
            Nicolas
          </span>
          {/* Line 2: bold crimson fill */}
          <span style={{
            display: 'block',
            fontSize: 'clamp(52px, 9vw, 110px)',
            fontWeight: 500,
            color: 'var(--accent)',
          }}>
            Herrera
          </span>
          {/* Line 3: outlined, ghost */}
          <span style={{
            display: 'block',
            fontSize: 'clamp(52px, 9vw, 110px)',
            fontWeight: 500,
            color: 'transparent',
            WebkitTextStroke: '1.5px var(--accent)',
            opacity: 0.5,
          }}>
            Santibañez
          </span>
        </h1>

        {/* Typewriter */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', marginBottom: '40px', minHeight: '22px',
          ...anim('0.45s'),
        }}>
          <span style={{ color: 'var(--accent2)' }}>&gt;</span>
          <span ref={typedRef} style={{ color: 'var(--text)' }} />
          <span style={{
            display: 'inline-block', width: '2px', height: '1em',
            background: 'var(--accent)', verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          }} />
        </div>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: '12px', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '40px',
          ...anim('0.6s'),
        }}>
          <a href="#projects" style={{
            fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--bg)',
            background: 'var(--accent)', padding: '10px 28px',
            textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            view projects
          </a>
          <a href="#contact" style={{
            fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
            border: '0.5px solid var(--border)', padding: '10px 28px',
            textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            get in touch
          </a>
          <a
            href="/IT-CVNicolasHerrera.pdf"
            download
            onClick={() => fetch('/api/cv', { method: 'POST' }).catch(() => {})}
            style={{
              fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
              border: '0.5px solid var(--border)', padding: '10px 28px',
              textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >
            ↓ cv
          </a>
        </div>

        {views !== null && (
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '10px',
            color: 'var(--muted2)', letterSpacing: '0.1em',
            ...anim('0.75s'),
          }}>
            <span style={{ color: 'var(--accent)' }}>●</span> {views} people have been here
          </div>
        )}

      </div>
    </section>
  )
}
