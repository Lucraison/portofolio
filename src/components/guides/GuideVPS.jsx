import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import vpsContent from '../../content/guides/vps.md?raw'

function extractSections(markdown) {
    const lines = markdown.split('\n')
    const sections = []
    let current = null

    for (const line of lines) {
        if (line.startsWith('## ')) {
            if (current) sections.push(current)
            const title = line.replace('## ', '')
            const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            current = { id, title, content: '' }
        } else if (line.startsWith('# ')) {
            continue
        } else if (current) {
            current.content += line + '\n'
        }
    }
    if (current) sections.push(current)
    return sections
}

function CodeBlock({ code, language }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
            <pre style={{ background: 'var(--bg)', border: '0.5px solid var(--border)', padding: '20px 24px', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', overflowX: 'auto', lineHeight: 1.7, margin: 0 }}>
                <code>{code}</code>
            </pre>
            <button onClick={handleCopy} style={{ position: 'absolute', top: '10px', right: '10px', fontFamily: 'var(--mono)', fontSize: '10px', color: copied ? 'var(--accent2)' : 'var(--muted)', background: 'var(--bg1)', border: '0.5px solid var(--border)', padding: '4px 10px', cursor: 'pointer', letterSpacing: '0.08em' }}>
                {copied ? 'copied!' : 'copy'}
            </button>
        </div>
    )
}

const components = {
    h1: () => null,
    h2: ({ children }) => (
        <h2 style={{ fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 400, color: 'var(--text)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid var(--border)', marginTop: '0' }}>
            {children}
        </h2>
    ),
    p: ({ children }) => (
        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '16px' }}>
            {children}
        </p>
    ),
    ul: ({ children }) => (
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            {children}
        </ul>
    ),
    li: ({ children }) => (
        <li style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '6px' }}>
            {children}
        </li>
    ),
    strong: ({ children }) => (
        <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{children}</strong>
    ),
    code: ({ children, className }) => {
        const isBlock = className?.startsWith('language-')
        if (isBlock) {
            return <CodeBlock code={String(children).trim()} language={className?.replace('language-', '')} />
        }
        return <code style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent2)', background: 'var(--bg1)', padding: '2px 6px', border: '0.5px solid var(--border)' }}>{children}</code>
    },
    pre: ({ children }) => <>{children}</>,
}

export default function GuideVPS() {
    const navigate = useNavigate()
    const [active, setActive] = useState('')
    const sections = extractSections(vpsContent)

    useEffect(() => {
        if (sections.length > 0) setActive(sections[0].id)
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
            { rootMargin: '-40% 0px -55% 0px' }
        )
        sections.forEach(s => {
            const el = document.getElementById(s.id)
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [sections])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--sans)' }}>
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 40px', height: '56px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg)', transform: 'translateZ(0)' }}>
                <button onClick={() => navigate('/')} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
                    ← back
                </button>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.05em', marginLeft: 'auto' }}>NH_</span>
            </nav>

            <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '80px 60px 80px' }}>

                {/* sidebar */}
                <div style={{ width: '220px', flexShrink: 0, paddingTop: '40px', paddingRight: '60px', position: 'sticky', top: '80px', alignSelf: 'flex-start' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>// steps</div>
                    {sections.map((s, i) => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            onClick={() => setActive(s.id)}
                            onMouseEnter={e => e.currentTarget.style.borderLeftColor = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.borderLeftColor = active === s.id ? 'var(--accent)' : 'transparent'}
                            style={{
                                display: 'block',
                                fontFamily: 'var(--mono)',
                                fontSize: '12px',
                                color: active === s.id ? 'var(--accent)' : 'var(--muted)',
                                textDecoration: 'none',
                                padding: '10px 0',
                                paddingLeft: '12px',
                                letterSpacing: '0.06em',
                                borderLeft: active === s.id ? '2px solid var(--accent)' : '2px solid transparent',
                                transition: 'all 0.2s',
                                marginBottom: '4px',
                            }}
                        >
                            {i === 0 ? s.title : s.title}
                        </a>
                    ))}
                </div>

                {/* content */}
                <div style={{ flex: 1, paddingTop: '40px', maxWidth: '720px' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>// guide</div>
                    <h1 style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.2, marginBottom: '8px' }}>
                        Hosting a Modded Minecraft Server on a VPS
                    </h1>
                    <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted2)', marginBottom: '64px', letterSpacing: '0.06em' }}>
                        Hetzner + Ubuntu + screen + crontab
                    </p>

                    {sections.map((section) => (
                        <div key={section.id} id={section.id} style={{ marginBottom: '80px', scrollMarginTop: '80px' }}>
                            <ReactMarkdown components={components}>
                                {`## ${section.title}\n${section.content}`}
                            </ReactMarkdown>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}