import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'

const markdownFiles = import.meta.glob('../content/education/*.md', { query: '?raw', import: 'default' })

const introComponents = {
  h1: ({ children }) => null,
  h2: ({ children }) => null,
  h3: ({ children }) => null,
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

const sectionComponents = {
  h1: ({ children }) => null,
  h2: ({ children }) => (
    <h3 style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 400, color: 'var(--text)', letterSpacing: '0.04em', marginTop: 0, marginBottom: '12px' }}>
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 500, color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '20px', marginBottom: '8px' }}>
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '12px' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: '20px', marginBottom: '8px' }}>{children}</ul>
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

  const { intro, sections } = useMemo(() => {
    if (!content) return { intro: '', sections: [] }

    const lines = content.split('\n')
    const parsedSections = []
    const introLines = []
    let current = null

    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        if (current) parsedSections.push(current)
        current = { title: line.replace(/^##\s+/, '').trim(), body: [] }
      } else if (current) {
        current.body.push(line)
      } else {
        introLines.push(line)
      }
    })

    if (current) parsedSections.push(current)

    return {
      intro: introLines.join('\n').trim(),
      sections: parsedSections.map((s) => ({ ...s, body: s.body.join('\n').trim() })),
    }
  }, [content])

  const splitProgramTitle = (title) => {
    const yearMatch = title.match(/\(([^)]+)\)\s*$/)
    const years = yearMatch ? yearMatch[1] : ''
    const titleWithoutYears = yearMatch ? title.replace(/\s*\([^)]+\)\s*$/, '') : title
    const parts = titleWithoutYears.split('—').map((part) => part.trim()).filter(Boolean)

    return {
      program: parts[0] || titleWithoutYears.trim(),
      school: parts[1] || '',
      years,
    }
  }

  return (
    <section id="education" style={{ padding: '100px 40px', borderBottom: '0.5px solid var(--border)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // education
        </div>
        <h2 className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 300, color: 'var(--text)', marginBottom: '48px' }}>
          Background
        </h2>
        <div className="reveal" style={{ borderTop: '0.5px solid var(--border)', paddingTop: '36px' }}>
          {intro && (
            <div style={{ marginBottom: '36px', padding: '24px 24px 22px', border: '0.5px solid var(--border)', background: 'var(--bg1)' }}>
              <ReactMarkdown components={introComponents}>{intro}</ReactMarkdown>
            </div>
          )}

          <div style={{ position: 'relative', paddingLeft: '24px' }}>
            <div style={{ position: 'absolute', left: '8px', top: 0, bottom: 0, width: '1px', background: 'var(--border)' }} />
            {sections.map((section) => {
              const { program, school, years } = splitProgramTitle(section.title)
              return (
              <article key={section.title} style={{ position: 'relative', marginBottom: '20px', border: '0.5px solid var(--border)', background: 'var(--bg1)', padding: '18px 20px' }}>
                <span style={{ position: 'absolute', left: '-22px', top: '20px', width: '9px', height: '9px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 3px rgba(220,20,60,0.12)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <h3 style={{ fontFamily: 'var(--mono)', fontSize: '15px', fontWeight: 500, color: 'var(--text)', letterSpacing: '0.03em', marginBottom: 0 }}>
                    {program}
                  </h3>
                  {years && (
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', border: '0.5px solid var(--accent-border)', padding: '3px 8px' }}>
                      {years}
                    </span>
                  )}
                </div>
                {school && (
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    {school}
                  </div>
                )}
                <ReactMarkdown components={sectionComponents}>{section.body}</ReactMarkdown>
              </article>
            )})}
          </div>
        </div>
      </div>
    </section>
  )
}
