import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProjectCard from './ProjectCard'
import useReveal from '../hooks/useReveal'
import useSeo from '../hooks/useSeo'

const LANGUAGE_TAGS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'C++',
  'PHP',
  'Go',
  'Rust',
  'Ruby',
  'Kotlin',
  'Swift',
  'Dart',
  'Bash',
]

export default function AllProjects() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeLanguage, setActiveLanguage] = useState(searchParams.get('lang') || 'All')
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const navigate = useNavigate()
  useReveal()
  useSeo({
    title: "Projects - Nicolas Herrera",
    description: "Browse all projects by Nicolas Herrera, filter by language, and explore technical case studies.",
    image: '/og.png',
  })

  const loadProjects = () => {
    setError(false)
    fetch('/api/projects')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('fetch failed')))
      .then(setProjects)
      .catch(() => setError(true))
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const languageOptions = useMemo(() => {
    const seen = new Set()

    projects.forEach((project) => {
      const tags = Array.isArray(project.tags) ? project.tags : []
      tags.forEach((tag) => {
        const match = LANGUAGE_TAGS.find((lang) => lang.toLowerCase() === String(tag).toLowerCase())
        if (match) seen.add(match)
      })
    })

    return ['All', ...LANGUAGE_TAGS.filter((lang) => seen.has(lang))]
  }, [projects])

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return projects.filter((project) => {
      const tags = Array.isArray(project.tags) ? project.tags : []
      const languageMatch = activeLanguage === 'All'
        || tags.some((tag) => String(tag).toLowerCase() === activeLanguage.toLowerCase())
      if (!languageMatch) return false
      if (!normalizedQuery) return true
      const haystack = [project.name, project.desc, ...tags].join(' ').toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [projects, activeLanguage, query])

  useEffect(() => {
    const next = new URLSearchParams()
    if (activeLanguage !== 'All') next.set('lang', activeLanguage)
    if (query.trim()) next.set('q', query.trim())
    setSearchParams(next, { replace: true })
  }, [activeLanguage, query, setSearchParams])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--sans)' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 40px', height: '56px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg)' }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
          ← back
        </button>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.05em', marginLeft: 'auto' }}>NH_</span>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 40px 80px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // projects
        </div>
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 300, color: 'var(--text)', marginBottom: '48px' }}>
          Everything I've built
        </h1>

        <div style={{ marginBottom: '20px' }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search projects by name, stack, keyword..."
            style={{
              width: '100%',
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: 'var(--text)',
              background: 'var(--bg1)',
              border: '0.5px solid var(--border)',
              padding: '10px 12px',
              letterSpacing: '0.04em',
            }}
          />
        </div>

        {languageOptions.length > 1 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
              filter by language
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {languageOptions.map((language) => {
                const active = language === activeLanguage
                return (
                  <button
                    key={language}
                    onClick={() => setActiveLanguage(language)}
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      border: active ? '0.5px solid var(--border-hi)' : '0.5px solid var(--border)',
                      color: active ? 'var(--accent)' : 'var(--muted)',
                      background: active ? 'var(--bg2)' : 'var(--bg1)',
                      padding: '7px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    {language}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {error && (
          <div style={{ border: '0.5px solid #e05c5c44', background: 'var(--bg1)', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#e05c5c' }}>Could not load projects.</span>
            <button onClick={loadProjects} style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', background: 'none', border: '0.5px solid var(--border)', padding: '6px 10px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>retry</button>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div style={{ border: '0.5px solid var(--border)', background: 'var(--bg1)', padding: '18px 20px', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>
              No projects found for current filters.
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '16px' }}>
          {filteredProjects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </div>
  )
}
