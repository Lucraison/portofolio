import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import PROJECTS from '../data/projects.json'

const markdownFiles = import.meta.glob('../content/projects/*.md', { query: '?raw', import: 'default' })

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = PROJECTS.find(p => p.id === id)
  const [lightbox, setLightbox] = useState(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    const key = `../content/projects/${id}.md`
    if (markdownFiles[key]) {
      markdownFiles[key]().then(setContent)
    }
  }, [id])

  if (!project) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'var(--mono)', color: 'var(--muted)' }}>project not found.</p>
    </div>
  )

  const components = {
    p: ({ children }) => (
      <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '20px' }}>{children}</p>
    ),
    strong: ({ children }) => (
      <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{children}</strong>
    ),
    ul: ({ children }) => (
      <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>{children}</ul>
    ),
    li: ({ children }) => (
      <li style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '6px' }}>{children}</li>
    ),
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--sans)' }}>

      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: '40px' }}>
          <img src={project.images[lightbox]} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: '0.5px solid var(--border-hi)' }} />
        </div>
      )}

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 40px', height: '56px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg)', transform: 'translateZ(0)' }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ← back
        </button>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.05em', marginLeft: 'auto' }}>NH_</span>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 40px 80px' }}>

        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // {project.year}
        </div>
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, marginBottom: '24px' }}>
          {project.name}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '56px' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 8px', border: '0.5px solid var(--accent-border)', color: 'var(--accent)' }}>
            {project.status}
          </span>
          {project.tags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', border: '0.5px solid var(--border)', padding: '3px 8px', letterSpacing: '0.06em' }}>
              {tag}
            </span>
          ))}
        </div>

        {project.guideUrl && (
          <div style={{ marginBottom: '56px' }}>
            <div
              onClick={() => navigate(project.guideUrl)}
              style={{ display: 'inline-block', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--bg)', background: 'var(--accent)', padding: '10px 20px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              read the guide →
            </div>
          </div>
        )}

        <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: '48px', marginBottom: '64px' }}>
          <ReactMarkdown components={components}>{content}</ReactMarkdown>
        </div>

        {project.images && project.images.length > 0 && (
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>
              // screenshots
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {project.images.map((src, i) => (
                <div key={i} onClick={() => setLightbox(i)} style={{ border: '0.5px solid var(--border)', overflow: 'hidden', cursor: 'zoom-in', background: 'var(--bg1)' }}>
                  <img src={src} alt={`${project.name} screenshot ${i + 1}`} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {project.url && (
          <a href={project.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '48px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--bg)', background: 'var(--accent)', padding: '10px 20px', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            view live →
          </a>
        )}
      </div>
    </div>
  )
}