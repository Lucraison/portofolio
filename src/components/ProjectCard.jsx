import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      className="reveal"
      onClick={() => navigate(`/projects/${project.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? '0.5px solid var(--border-hi)' : '0.5px solid var(--border)',
        background: hovered ? 'var(--bg2)' : 'var(--bg1)',
        padding: '28px 32px',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
        {project.tags.map(tag => (
          <span key={tag} style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', border: '0.5px solid var(--border)', padding: '3px 8px', letterSpacing: '0.06em' }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '20px', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: hovered ? 'var(--accent)' : 'var(--muted)', letterSpacing: '0.08em', transition: 'color 0.2s' }}>
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