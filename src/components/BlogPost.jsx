import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

const components = {
  h1: ({ children }) => (
    <h1 style={{ fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: 300, color: 'var(--text)', marginTop: '48px', marginBottom: '16px' }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 400, color: 'var(--text)', marginTop: '40px', marginBottom: '12px' }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 400, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '32px', marginBottom: '8px' }}>{children}</h3>
  ),
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
  code: ({ children }) => (
    <code style={{ fontFamily: 'var(--mono)', fontSize: '13px', background: 'var(--bg1)', border: '0.5px solid var(--border)', padding: '2px 6px', color: 'var(--accent2)' }}>{children}</code>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '16px', marginBottom: '20px', opacity: 0.8 }}>{children}</blockquote>
  ),
}

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setPost(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'var(--mono)', color: 'var(--muted)' }}>loading...</p>
    </div>
  )

  if (!post) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'var(--mono)', color: 'var(--muted)' }}>post not found.</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--sans)' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 40px', height: '56px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg)', transform: 'translateZ(0)' }}>
        <button onClick={() => navigate('/blog')} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
          ← back
        </button>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.05em', marginLeft: 'auto' }}>NH_</span>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '120px 40px 80px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.2, marginBottom: '48px' }}>
          {post.title}
        </h1>
        <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: '48px' }}>
          <ReactMarkdown components={components}>{post.content}</ReactMarkdown>
        </div>
        {post.coverImage && (
          <div style={{ marginTop: '48px' }}>
            <div style={{ border: '0.5px solid var(--border)', overflow: 'hidden' }}>
              <img src={post.coverImage} alt={post.title} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted2)', marginTop: '8px', letterSpacing: '0.08em' }}>
              {new Date(post.date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
