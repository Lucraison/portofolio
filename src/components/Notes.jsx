import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Notes() {
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => setPosts(data.slice(0, 3)))
      .catch(() => {})
  }, [])

  if (posts.length === 0) return null

  return (
    <section id="notes" style={{ padding: '100px 40px', borderBottom: '0.5px solid var(--border)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // notes
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '48px' }}>
          <h2 className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 300, color: 'var(--text)' }}>
            What's on my mind
          </h2>
          <button onClick={() => navigate('/blog')} style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            all posts →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.map(post => (
            <div
              key={post.slug}
              className="reveal"
              onClick={() => navigate(`/blog/${post.slug}`)}
              style={{ border: '0.5px solid var(--border)', background: 'var(--bg1)', padding: '24px 28px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.background = 'var(--bg2)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <h3 style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 400, color: 'var(--text)', marginBottom: '8px' }}>
                  {post.title}
                </h3>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted2)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              {post.description && (
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{post.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
