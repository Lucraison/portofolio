import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSeo from '../hooks/useSeo'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  useSeo({
    title: 'Notes - Nicolas Herrera',
    description: 'Blog posts and notes about development, systems, and projects.',
    image: '/og.png',
  })

  const loadPosts = () => {
    setError(false)
    setLoading(true)
    fetch('/api/posts')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('fetch failed')))
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => { setLoading(false); setError(true) })
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--sans)' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 40px', height: '56px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg)', transform: 'translateZ(0)' }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
          ← back
        </button>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.05em', marginLeft: 'auto' }}>NH_</span>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 40px 80px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // notes
        </div>
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, color: 'var(--text)', marginBottom: '64px' }}>
          All posts
        </h1>

        {loading && <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>loading...</p>}
        {!loading && error && (
          <div style={{ border: '0.5px solid #e05c5c44', background: 'var(--bg1)', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#e05c5c' }}>Could not load posts.</span>
            <button onClick={loadPosts} style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', background: 'none', border: '0.5px solid var(--border)', padding: '6px 10px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>retry</button>
          </div>
        )}
        {!loading && posts.length === 0 && <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>no posts yet.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.map(post => (
            <div
              key={post.slug}
              onClick={() => navigate(`/blog/${post.slug}`)}
              style={{ border: '0.5px solid var(--border)', background: 'var(--bg1)', padding: '24px 28px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.background = 'var(--bg2)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <h2 style={{ fontFamily: 'var(--mono)', fontSize: '15px', fontWeight: 400, color: 'var(--text)', marginBottom: '8px' }}>
                  {post.title}
                </h2>
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
    </div>
  )
}
