import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

const markdownFiles = import.meta.glob('../content/education/*.md', { query: '?raw', import: 'default' })

const components = {
  h1: ({ children }) => null,
  h2: ({ children }) => (
    <h3 style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 400, color: 'var(--text)', letterSpacing: '0.06em', marginTop: '40px', marginBottom: '12px' }}>
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 style={{ fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 400, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '24px', marginBottom: '8px' }}>
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '16px' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '4px' }}>{children}</li>
  ),
}

export default function Education() {
  const [content, setContent] = useState('')

  useEffect(() => {
    const key = '../content/education/background.md'
    if (markdownFiles[key]) {
      markdownFiles[key]().then(setContent)
    }
  }, [])

  return (
    <section id="education" style={{ padding: '100px 40px', borderBottom: '0.5px solid var(--border)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // education
        </div>
        <h2 className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 300, color: 'var(--text)', marginBottom: '48px' }}>
          Background
        </h2>
        <div className="reveal" style={{ borderTop: '0.5px solid var(--border)', paddingTop: '40px' }}>
          <ReactMarkdown components={components}>{content}</ReactMarkdown>
        </div>
      </div>
    </section>
  )
}
