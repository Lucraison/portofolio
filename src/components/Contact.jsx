import { useState } from 'react'

const INPUT_STYLE = {
  fontFamily: 'var(--mono)',
  fontSize: '13px',
  color: 'var(--text)',
  background: 'var(--bg1)',
  border: '0.5px solid var(--border)',
  padding: '12px 16px',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
  letterSpacing: '0.04em',
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error' | 'ratelimit'

  const handleCopy = () => {
    navigator.clipboard.writeText('nicolas.nataniel79@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else if (res.status === 429) {
        setStatus('ratelimit')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" style={{ padding: '100px 40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // contact
        </div>
        <h2 className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 300, color: 'var(--text)', marginBottom: '16px' }}>
          Get in touch
        </h2>
        <p className="reveal" style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '48px', maxWidth: '440px', lineHeight: 1.8 }}>
          Open to opportunities, collaborations, or just talking tech.
        </p>

        {[
          { label: 'EMAIL', value: 'nicolas.nataniel79@gmail.com', action: <button onClick={handleCopy} style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: copied ? 'var(--accent2)' : 'var(--muted)', background: 'none', border: '0.5px solid var(--border)', padding: '5px 10px', cursor: 'pointer', letterSpacing: '0.1em' }}>{copied ? 'copied!' : 'copy'}</button> },
          { label: 'GITHUB', value: 'github.com/Lucraison', action: <a href="https://github.com/Lucraison/" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', border: '0.5px solid var(--border)', padding: '5px 10px', textDecoration: 'none', letterSpacing: '0.1em' }}>visit →</a> },
          { label: 'LINKEDIN', value: 'linkedin.com/in/nicolas-hs', action: <a href="https://www.linkedin.com/in/nicolas-hs/" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', border: '0.5px solid var(--border)', padding: '5px 10px', textDecoration: 'none', letterSpacing: '0.1em' }}>visit →</a> },
        ].map(row => (
          <div key={row.label} className="reveal" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', border: '0.5px solid var(--border)', background: 'var(--bg1)', padding: '16px 20px', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em', width: '60px', flexShrink: 0 }}>{row.label}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', flex: 1, wordBreak: 'break-all' }}>{row.value}</span>
            {row.action}
          </div>
        ))}

        <form className="reveal" onSubmit={handleSubmit} style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input
              style={INPUT_STYLE}
              placeholder="name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              style={INPUT_STYLE}
              placeholder="email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <textarea
            style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: '120px' }}
            placeholder="message"
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            required
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--accent)', color: 'var(--bg)', border: 'none', padding: '10px 24px', cursor: status === 'sending' ? 'not-allowed' : 'pointer', opacity: status === 'sending' ? 0.6 : 1 }}
            >
              {status === 'sending' ? 'sending...' : 'send message →'}
            </button>
            {status === 'success' && <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent2)' }}>message sent.</span>}
            {status === 'ratelimit' && <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#e05c5c' }}>please wait 15 minutes before sending another message.</span>}
            {status === 'error' && <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#e05c5c' }}>something went wrong. try email instead.</span>}
          </div>
        </form>

        <div className="reveal" style={{ marginTop: '80px', paddingTop: '32px', borderTop: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted2)' }}>Nicolas Herrera © {new Date().getFullYear()}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted2)' }}>Built with React + Vite</span>
        </div>
      </div>
    </section>
  )
}
