import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectCard from './ProjectCard'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()


  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(setProjects)
      .catch(() => {})
  }, [])

  const featured = projects.filter(p => p.featured)
  const visible = featured.length > 0 ? featured : projects.slice(0, 3)

  return (
    <section id="projects" style={{ padding: '100px 40px', borderBottom: '0.5px solid var(--border)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ position: 'relative', marginBottom: '48px' }}>
          <div style={{
            position: 'absolute', top: '-16px', left: '-8px',
            fontFamily: 'var(--mono)', fontSize: 'clamp(64px, 10vw, 112px)',
            fontWeight: 300, color: 'var(--text)', opacity: 0.025,
            letterSpacing: '-0.04em', lineHeight: 1,
            userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            PROJECTS
          </div>
          <div className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
            // projects
          </div>
          <h2 className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Things I've built
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {visible.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
        {projects.length > 3 && (
          <button onClick={() => navigate('/projects')} style={{
            marginTop: '24px', fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.1em',
            textTransform: 'uppercase', background: 'none', border: '0.5px solid var(--border)',
            color: 'var(--muted)', padding: '10px 24px', cursor: 'pointer', width: '100%',
          }}>
            all projects →
          </button>
        )}
      </div>
    </section>
  )
}
