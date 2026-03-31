import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import useSeo from '../hooks/useSeo'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const loadProject = () => {
    setError(false)
    setLoading(true)
    fetch(`/api/projects/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setProject(data); setLoading(false); if (!data) setError(true) })
      .catch(() => { setLoading(false); setError(true) })
  }

  useEffect(() => {
    loadProject()
  }, [id])

  useSeo({
    title: project ? `${project.name} - Project` : 'Project - Nicolas Herrera',
    description: project?.desc || 'Project details and implementation notes.',
    image: '/og.png',
  })

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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'var(--mono)', color: 'var(--muted)' }}>loading...</p>
    </div>
  )

  if (!project) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--mono)', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', marginBottom: '12px' }}>{error ? 'failed to load project.' : 'project not found.'}</p>
        {error && <button onClick={loadProject} style={{ background: 'none', border: '0.5px solid var(--border)', color: 'var(--muted)', padding: '7px 12px', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '10px' }}>retry</button>}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--sans)' }}>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: '40px' }}>
          <img src={lightbox} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: '0.5px solid var(--border-hi)' }} />
        </div>
      )}

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 40px', height: '56px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg)', transform: 'translateZ(0)' }}>
        <button onClick={() => navigate(-1)} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          {(Array.isArray(project.tags) ? project.tags : []).map(tag => (
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
          {project.blocks?.length > 0
            ? (() => {
                const rendered = []
                const blocks = project.blocks
                let i = 0
                while (i < blocks.length) {
                  const block = blocks[i]
                  if (block.type === 'image') {
                    const group = []
                    while (i < blocks.length && blocks[i].type === 'image') {
                      group.push(blocks[i])
                      i++
                    }
                    rendered.push(
                      <div key={i} style={{ margin: '32px 0', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        {group.map((img, j) => (
                          <div key={j} style={{ flex: group.length > 1 ? '1 1 0' : 'unset', cursor: 'zoom-in', textAlign: 'center' }}
                            onClick={() => setLightbox(img.value)}>
                            <img src={img.value} alt="" loading="lazy" decoding="async" style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain', display: 'inline-block', border: '0.5px solid var(--border)', transition: 'transform 0.3s ease' }}
                              onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                            />
                          </div>
                        ))}
                      </div>
                    )
                  } else {
                    rendered.push(<ReactMarkdown key={i} components={components}>{block.value}</ReactMarkdown>)
                    i++
                  }
                }
                return rendered
              })()
            : <ReactMarkdown components={components}>{project.content}</ReactMarkdown>
          }
        </div>

        {project.url && (
          <a href={project.url.startsWith('http') ? project.url : `https://${project.url}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '48px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--bg)', background: 'var(--accent)', padding: '10px 20px', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            view live →
          </a>
        )}
      </div>
    </div>
  )
}
