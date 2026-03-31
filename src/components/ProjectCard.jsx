import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const tags = Array.isArray(project.tags) ? project.tags : []

  const openProject = () => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'project_click', projectId: project.id }),
    }).catch(() => {})
    navigate(`/projects/${project.id}`)
  }

  return (
    <div
      className="reveal"
      onClick={openProject}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? '0.5px solid var(--border-hi)' : '0.5px solid var(--border)',
        background: hovered ? 'var(--bg2)' : 'var(--bg1)',
        padding: '28px 32px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(220, 20, 60, 0.1)' : 'none',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: '2px',
        height: hovered ? '100%' : '0%',
        background: 'var(--accent)',
        transition: 'height 0.35s ease',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '6px' }}>
            {project.year}
          </div>
          <h3 style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 400, color: hovered ? 'var(--accent)' : 'var(--text)', transition: 'color 0.2s' }}>
            {project.name}
          </h3>
        </div>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '4px 8px',
          border: project.status === 'shipped' ? '0.5px solid var(--accent2-border)' : '0.5px solid var(--accent-border)',
          color: project.status === 'shipped' ? 'var(--accent2)' : 'var(--accent)',
        }}>
          {project.status}
        </span>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '20px' }}>
        {project.desc}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {tags.map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--mono)', fontSize: '10px', padding: '3px 8px', letterSpacing: '0.06em',
            border: hovered ? '0.5px solid var(--border-hi)' : '0.5px solid var(--border)',
            color: hovered ? 'var(--text)' : 'var(--muted)',
            transition: 'all 0.25s ease',
          }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '20px', alignItems: 'center' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '11px',
          color: hovered ? 'var(--accent)' : 'var(--muted)',
          letterSpacing: hovered ? '0.14em' : '0.08em',
          transition: 'color 0.2s, letter-spacing 0.3s ease',
        }}>
          read more →
        </div>
        {project.guideUrl && (
          <div
            onClick={(e) => { e.stopPropagation(); navigate(project.guideUrl) }}
            onMouseEnter={(e) => { e.stopPropagation(); setHovered(false); e.currentTarget.style.background = 'var(--accent2)' }}
            onMouseLeave={(e) => {
              e.stopPropagation()
              e.currentTarget.style.background = 'var(--accent)'
              const card = e.currentTarget.closest('.reveal')
              if (card && card.matches(':hover')) setHovered(true)
            }}
            style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--bg)', background: 'var(--accent)', padding: '5px 12px', letterSpacing: '0.08em', cursor: 'pointer' }}
          >
            read guide →
          </div>
        )}
      </div>
    </div>
  )
}