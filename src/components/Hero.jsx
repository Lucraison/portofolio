import { useEffect, useState } from 'react'
import useTypewriter from '../hooks/useTypewriter'

export default function Hero() {
  const [views, setViews] = useState(null)
  const [lastCommit, setLastCommit] = useState(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/Lucraison/portofolio/commits?per_page=1')
      .then(r => r.json())
      .then(d => setLastCommit(d[0]?.commit?.message?.split('\n')[0] ?? null))
      .catch(() => {})
  }, [])

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
    'developer & ai enthusiast',
    'self-taught, still learning',
    'backend systems builder',
    'based in antwerp, belgium',
    '67',
  ])

  return (
    <section id="about" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '100px 40px 60px',
      position: 'relative', borderBottom: '0.5px solid var(--border)',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        contain: 'strict',
      }} />

      <div className="reveal" style={{ maxWidth: '720px', position: 'relative'}}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '20px', opacity: 0.8 }}>
          // hello, world
        </div>

        <h1 style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.05, marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Nicolas<br />
          <span style={{ color: 'var(--accent)' }}>Herrera Santibañez</span>
        </h1>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(13px, 2vw, 16px)', color: 'var(--muted)', marginBottom: '36px', minHeight: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--accent2)' }}>&gt;</span>
          <span ref={typedRef} />
          <span style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--accent)', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: 2, maxWidth: '560px', marginBottom: '40px' }}>
          "Developer based in Antwerp. Building things as I go."
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href="#projects" style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--bg)', background: 'var(--accent)', padding: '10px 20px', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            View projects
          </a>
          <a href="#contact" style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', border: '0.5px solid var(--border)', padding: '10px 20px', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Get in touch
          </a>
          <a
            href="/ITCVNicolasHerrera.pdf"
            download
            onClick={() => fetch('/api/cv', { method: 'POST' }).catch(() => {})}
            style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', border: '0.5px solid var(--border)', padding: '10px 20px', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Download CV
          </a>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted2)', letterSpacing: '0.08em', marginTop: '20px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {views !== null && <span><span style={{ color: 'var(--accent)' }}>●</span> {views} visits</span>}
          {lastCommit && <span>last commit: "{lastCommit}"</span>}
        </div>
      </div>
    </section>
  )
}