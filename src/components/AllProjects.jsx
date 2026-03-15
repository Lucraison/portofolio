import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectCard from './ProjectCard'
import useReveal from '../hooks/useReveal'

export default function AllProjects() {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()
  useReveal()

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setProjects).catch(() => {})
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--sans)' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 40px', height: '56px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg)' }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
          ← back
        </button>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.05em', marginLeft: 'auto' }}>NH_</span>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 40px 80px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // projects
        </div>
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 300, color: 'var(--text)', marginBottom: '48px' }}>
          Everything I've built
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '16px' }}>
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </div>
  )
}
