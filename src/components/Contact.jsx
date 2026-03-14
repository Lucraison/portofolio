import { useState } from 'react'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('nicolas.nataniel79@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          Open to opportunities, collaborations, or just talking tech. Best reached by email.
        </p>

        {[
          { label: 'EMAIL', value: 'nicolas.nataniel79@gmail.com', action: <button onClick={handleCopy} style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: copied ? 'var(--accent2)' : 'var(--muted)', background: 'none', border: '0.5px solid var(--border)', padding: '5px 10px', cursor: 'pointer', letterSpacing: '0.1em' }}>{copied ? 'copied!' : 'copy'}</button> },
          { label: 'GITHUB', value: 'github.com/Lucraison', action: <a href="https://github.com/Lucraison/" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', border: '0.5px solid var(--border)', padding: '5px 10px', textDecoration: 'none', letterSpacing: '0.1em' }}>visit →</a> },
        ].map(row => (
          <div key={row.label} className="reveal" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', border: '0.5px solid var(--border)', background: 'var(--bg1)', padding: '16px 20px', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em', width: '60px', flexShrink: 0 }}>{row.label}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', flex: 1, wordBreak: 'break-all' }}>{row.value}</span>
            {row.action}
          </div>
        ))}

        <div className="reveal" style={{ marginTop: '80px', paddingTop: '32px', borderTop: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted2)' }}>Nicolas Herrera © {new Date().getFullYear()}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted2)' }}>Built with React + Vite</span>
        </div>
      </div>
    </section>
  )
}