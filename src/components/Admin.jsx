import { useState, useEffect } from 'react'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token'))
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) fetchData(token)
  }, [token])

  const fetchData = async (t) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/data', {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.status === 401) {
        sessionStorage.removeItem('admin_token')
        setToken(null)
        return
      }
      const json = await res.json()
      setData(json)
    } catch {
      setError('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        const { token: t } = await res.json()
        sessionStorage.setItem('admin_token', t)
        setToken(t)
      } else {
        setError('Invalid password.')
      }
    } catch {
      setError('Something went wrong.')
    }
  }

  const STYLE = {
    page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--mono)', padding: '80px 40px' },
    label: { fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' },
    h1: { fontSize: '24px', fontWeight: 300, marginBottom: '48px' },
    stat: { border: '0.5px solid var(--border)', background: 'var(--bg1)', padding: '20px 24px', marginBottom: '12px' },
    statVal: { fontSize: '28px', fontWeight: 300, color: 'var(--accent)', marginBottom: '4px' },
    statKey: { fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' },
    message: { border: '0.5px solid var(--border)', background: 'var(--bg1)', padding: '20px 24px', marginBottom: '12px' },
    input: { fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', background: 'var(--bg1)', border: '0.5px solid var(--border)', padding: '12px 16px', width: '100%', maxWidth: '320px', outline: 'none', boxSizing: 'border-box' },
    btn: { fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--accent)', color: 'var(--bg)', border: 'none', padding: '10px 24px', cursor: 'pointer', marginTop: '12px' },
  }

  if (!token) {
    return (
      <div style={STYLE.page}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={STYLE.label}>// admin</div>
          <h1 style={STYLE.h1}>Login</h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={STYLE.input}
              required
            />
            <button type="submit" style={STYLE.btn}>Enter →</button>
            {error && <span style={{ fontSize: '11px', color: '#e05c5c', marginTop: '12px' }}>{error}</span>}
          </form>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div style={{ ...STYLE.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>loading...</span>
    </div>
  )

  return (
    <div style={STYLE.page}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <div style={STYLE.label}>// admin</div>
            <h1 style={{ ...STYLE.h1, marginBottom: 0 }}>Dashboard</h1>
          </div>
          <button onClick={() => { sessionStorage.removeItem('admin_token'); setToken(null); setData(null) }} style={{ ...STYLE.btn, background: 'none', color: 'var(--muted)', border: '0.5px solid var(--border)' }}>
            Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '48px' }}>
          {[
            { key: 'Total Views', val: data?.views ?? 0 },
            { key: 'Messages', val: data?.messages?.length ?? 0 },
            { key: 'CV Downloads', val: data?.downloads ?? 0 },
          ].map(s => (
            <div key={s.key} style={STYLE.stat}>
              <div style={STYLE.statVal}>{s.val}</div>
              <div style={STYLE.statKey}>{s.key}</div>
            </div>
          ))}
        </div>

        <div style={STYLE.label}>// messages</div>
        <div style={{ marginTop: '16px' }}>
          {data?.messages?.length === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--muted)' }}>No messages yet.</p>
          )}
          {data?.messages?.map((msg, i) => (
            <div key={i} style={STYLE.message}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text)' }}>{msg.name} <span style={{ color: 'var(--muted)' }}>— {msg.email}</span></span>
                <span style={{ fontSize: '10px', color: 'var(--muted2)' }}>{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.8, margin: 0 }}>{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
