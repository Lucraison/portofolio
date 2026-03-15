import { useState, useEffect } from 'react'

const TABS = ['messages', 'projects', 'posts']

const S = {
  page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--mono)', padding: '80px 20px' },
  label: { fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' },
  stat: { border: '0.5px solid var(--border)', background: 'var(--bg1)', padding: '20px 24px', marginBottom: '12px' },
  statVal: { fontSize: '28px', fontWeight: 300, color: 'var(--accent)', marginBottom: '4px' },
  statKey: { fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' },
  card: { border: '0.5px solid var(--border)', background: 'var(--bg1)', padding: '20px 24px', marginBottom: '12px' },
  input: { fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', background: 'var(--bg)', border: '0.5px solid var(--border)', padding: '10px 14px', width: '100%', outline: 'none', boxSizing: 'border-box', marginBottom: '8px' },
  textarea: { fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text)', background: 'var(--bg)', border: '0.5px solid var(--border)', padding: '10px 14px', width: '100%', outline: 'none', boxSizing: 'border-box', marginBottom: '8px', resize: 'vertical' },
  btn: { fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--accent)', color: 'var(--bg)', border: 'none', padding: '8px 20px', cursor: 'pointer' },
  btnGhost: { fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', color: 'var(--muted)', border: '0.5px solid var(--border)', padding: '8px 20px', cursor: 'pointer' },
  btnDanger: { fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', color: '#e05c5c', border: '0.5px solid #e05c5c44', padding: '8px 20px', cursor: 'pointer' },
}

function useAuth() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token'))
  const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {}
  return { token, setToken, headers }
}

// ── Login ──────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    if (res.ok) { const { token } = await res.json(); sessionStorage.setItem('admin_token', token); onLogin(token) }
    else setError('Invalid password.')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', padding: '40px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '20px', color: 'var(--accent)', letterSpacing: '0.05em' }}>NH_</span>
          <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '8px' }}>admin access</div>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...S.input, marginBottom: 0 }} required autoFocus />
          <button type="submit" style={{ ...S.btn, padding: '12px 24px' }}>Enter →</button>
          {error && <span style={{ fontSize: '11px', color: '#e05c5c', textAlign: 'center' }}>{error}</span>}
        </form>
      </div>
    </div>
  )
}

// ── Messages tab ───────────────────────────────────────────────────────
function MessagesTab({ data, headers, onRefresh }) {
  const logs = data?.visitLogs ?? []

  const byCountry = logs.reduce((acc, v) => {
    const k = v.country || 'Unknown'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})
  const countrySorted = Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 8)

  const byReferrer = logs.reduce((acc, v) => {
    let k = 'direct'
    if (v.referrer) {
      try {
        const host = new URL(v.referrer).hostname.replace(/^www\./, '')
        if (host === 'nherrera.dev' || host.endsWith('.vercel.app') || host === 'localhost') return acc
        k = host
      } catch { k = v.referrer }
    }
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})
  const referrerSorted = Object.entries(byReferrer).sort((a, b) => b[1] - a[1]).slice(0, 8)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {[{ key: 'Total Views', val: data?.views ?? 0 }, { key: 'Messages', val: data?.messages?.length ?? 0 }, { key: 'CV Downloads', val: data?.downloads ?? 0 }].map(s => (
          <div key={s.key} style={S.stat}><div style={S.statVal}>{s.val}</div><div style={S.statKey}>{s.key}</div></div>
        ))}
      </div>
      <div style={{ marginBottom: '40px' }}>
        <button style={S.btnDanger} onClick={async () => {
          if (!confirm('Reset view count and all visit logs to zero?')) return
          await fetch('/api/views', { method: 'DELETE', headers })
          onRefresh()
        }}>reset views</button>
      </div>

      {logs.length > 0 && (
        <>
          <div style={S.label}>// visit sources</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px', marginBottom: '48px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>by country</div>
              {countrySorted.map(([country, count]) => (
                <div key={country} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{country}</span>
                  <span style={{ fontSize: '12px', color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>by referrer</div>
              {referrerSorted.map(([ref, count]) => (
                <div key={ref} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{ref}</span>
                  <span style={{ fontSize: '12px', color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div style={S.label}>// messages</div>
      <div style={{ marginTop: '16px' }}>
        {!data?.messages?.length && <p style={{ fontSize: '13px', color: 'var(--muted)' }}>No messages yet.</p>}
        {data?.messages?.map((msg, i) => (
          <div key={i} style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>{msg.name} <span style={{ color: 'var(--muted)' }}>— {msg.email}</span></span>
              <span style={{ fontSize: '10px', color: 'var(--muted2)' }}>{new Date(msg.createdAt).toLocaleString()}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.8, margin: 0 }}>{msg.message}</p>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Image upload ───────────────────────────────────────────────────────
const CLOUDINARY_CLOUD = 'dogjozb8d'
const CLOUDINARY_PRESET = 'portofolio-images'

function ImageUpload({ onUploaded, label = 'upload image' }) {
  const [uploading, setUploading] = useState(false)

  const handle = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', CLOUDINARY_PRESET)
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) onUploaded(data.secure_url)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <label style={{ ...S.btnGhost, display: 'inline-block', cursor: 'pointer', marginBottom: '8px', textAlign: 'center' }}>
      {uploading ? 'uploading...' : label}
      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handle} />
    </label>
  )
}

// ── Project form ───────────────────────────────────────────────────────
const EMPTY_PROJECT = { id: '', name: '', year: '', desc: '', tags: '', status: 'unfinished', url: '', guideUrl: '' }

function ProjectForm({ initial, onSave, onCancel }) {
  const initBlocks = () => {
    if (initial?.blocks?.length) return initial.blocks
    if (initial?.content) return [{ type: 'text', value: initial.content }]
    return [{ type: 'text', value: '' }]
  }
  const [form, setForm] = useState(initial ? { ...initial, tags: initial.tags?.join(', ') || '' } : EMPTY_PROJECT)
  const [blocks, setBlocks] = useState(initBlocks)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const toSlug = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const setName = (e) => setForm(f => ({ ...f, name: e.target.value, ...(!initial && !f._slugEdited ? { id: toSlug(e.target.value) } : {}) }))

  const setBlock = (i, val) => setBlocks(bs => bs.map((b, j) => j === i ? { ...b, value: val } : b))
  const addBlock = (type) => setBlocks(bs => [...bs, { type, value: '' }])
  const removeBlock = (i) => setBlocks(bs => bs.filter((_, j) => j !== i))

  return (
    <div style={{ ...S.card, borderColor: 'var(--border-hi)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
        <div>
          <input style={S.input} placeholder="id (slug)" value={form.id} onChange={e => { setForm(f => ({ ...f, id: e.target.value, _slugEdited: true })) }} disabled={!!initial} />
          {!initial && <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '-4px', marginBottom: '8px', paddingLeft: '2px' }}>url: /projects/{form.id || 'your-slug'}</div>}
        </div>
        <input style={S.input} placeholder="name" value={form.name} onChange={setName} />
        <input style={S.input} placeholder="year" value={form.year} onChange={set('year')} />
        <select style={{ ...S.input, marginBottom: '8px' }} value={form.status} onChange={set('status')}>
          {['live', 'unfinished', 'on hold', 'shipped'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input style={S.input} placeholder="url (optional)" value={form.url} onChange={set('url')} />
        <input style={S.input} placeholder="guideUrl (optional)" value={form.guideUrl} onChange={set('guideUrl')} />
      </div>
      <textarea style={{ ...S.textarea, marginBottom: '8px' }} rows={2} placeholder="short description" value={form.desc} onChange={set('desc')} />
      <input style={S.input} placeholder="tags (comma separated)" value={form.tags} onChange={set('tags')} />

      <div style={{ marginTop: '8px' }}>
        {blocks.map((block, i) => (
          <div key={i} style={{ marginBottom: '8px', border: '0.5px solid var(--border)', padding: '12px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{block.type}</span>
              {blocks.length > 1 && <button style={{ ...S.btnDanger, padding: '2px 10px' }} onClick={() => removeBlock(i)}>×</button>}
            </div>
            {block.type === 'text'
              ? <textarea style={{ ...S.textarea, marginBottom: 0, minHeight: '120px' }} placeholder="content (markdown)" value={block.value} onChange={e => setBlock(i, e.target.value)} />
              : (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input style={{ ...S.input, marginBottom: 0, flex: 1 }} placeholder="image URL" value={block.value} onChange={e => setBlock(i, e.target.value)} />
                  <ImageUpload label="+ upload" onUploaded={url => setBlock(i, url)} />
                </div>
              )
            }
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button style={S.btnGhost} onClick={() => addBlock('text')}>+ text</button>
          <button style={S.btnGhost} onClick={() => addBlock('image')}>+ image</button>
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--muted)', marginTop: '12px', cursor: 'pointer' }}>
        <input type="checkbox" checked={form.featured ?? false} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
        featured (show on homepage)
      </label>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button style={S.btn} onClick={() => onSave({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), blocks, _id: initial?._id })}>
          {initial ? 'save changes' : 'create project'}
        </button>
        <button style={S.btnGhost} onClick={onCancel}>cancel</button>
      </div>
    </div>
  )
}

function ProjectsTab({ headers }) {
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const load = () => fetch('/api/projects').then(r => r.json()).then(setProjects).catch(() => {})
  useEffect(() => { load() }, [])

  const save = async (data) => {
    const isNew = !data._id
    const res = await fetch('/api/admin/projects', { method: isNew ? 'POST' : 'PUT', headers, body: JSON.stringify(data) })
    if (res.ok) { setEditing(null); setCreating(false); load() }
  }

  const remove = async (_id) => {
    if (!confirm('Delete this project?')) return
    await fetch('/api/admin/projects', { method: 'DELETE', headers, body: JSON.stringify({ _id }) })
    load()
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button style={S.btn} onClick={() => { setCreating(true); setEditing(null) }}>+ new project</button>
      </div>
      {creating && <ProjectForm onSave={save} onCancel={() => setCreating(false)} />}
      {projects.map(p => (
        <div key={p._id}>
          {editing === p._id
            ? <ProjectForm initial={p} onSave={save} onCancel={() => setEditing(null)} />
            : (
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '14px', color: 'var(--text)' }}>{p.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--muted)', marginLeft: '12px' }}>{p.year} · {p.status}</span>
                    {p.featured && <span style={{ fontSize: '10px', color: 'var(--accent)', marginLeft: '8px' }}>· featured</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={S.btnGhost} onClick={() => { setEditing(p._id); setCreating(false) }}>edit</button>
                    <button style={S.btnDanger} onClick={() => remove(p._id)}>delete</button>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      ))}
    </>
  )
}

// ── Post form ──────────────────────────────────────────────────────────
const EMPTY_POST = { slug: '', title: '', description: '', coverImage: '', content: '', published: false }

function PostForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_POST)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ ...S.card, borderColor: 'var(--border-hi)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
        <input style={S.input} placeholder="slug (url-friendly)" value={form.slug} onChange={set('slug')} disabled={!!initial} />
        <input style={S.input} placeholder="title" value={form.title} onChange={set('title')} />
      </div>
      <input style={S.input} placeholder="short description" value={form.description} onChange={set('description')} />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
        <input style={{ ...S.input, marginBottom: 0, flex: 1 }} placeholder="cover image URL (optional)" value={form.coverImage || ''} onChange={set('coverImage')} />
        <ImageUpload label="+ upload" onUploaded={url => setForm(f => ({ ...f, coverImage: url }))} />
      </div>
      <textarea style={{ ...S.textarea, minHeight: '300px' }} rows={16} placeholder="content (markdown)" value={form.content} onChange={set('content')} />
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--muted)', marginBottom: '12px', cursor: 'pointer' }}>
        <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
        published
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={S.btn} onClick={() => onSave({ ...form, _id: initial?._id })}>
          {initial ? 'save changes' : 'create post'}
        </button>
        <button style={S.btnGhost} onClick={onCancel}>cancel</button>
      </div>
    </div>
  )
}

function PostsTab({ headers }) {
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/data', { headers })
    const data = await res.json()
    setPosts(data.posts || [])
  }
  useEffect(() => { load() }, [])

  const save = async (data) => {
    const isNew = !data._id
    const res = await fetch('/api/admin/posts', { method: isNew ? 'POST' : 'PUT', headers, body: JSON.stringify(data) })
    if (res.ok) { setEditing(null); setCreating(false); load() }
  }

  const remove = async (_id) => {
    if (!confirm('Delete this post?')) return
    await fetch('/api/admin/posts', { method: 'DELETE', headers, body: JSON.stringify({ _id }) })
    load()
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button style={S.btn} onClick={() => { setCreating(true); setEditing(null) }}>+ new post</button>
      </div>
      {creating && <PostForm onSave={save} onCancel={() => setCreating(false)} />}
      {posts.map(p => (
        <div key={p._id}>
          {editing === p._id
            ? <PostForm initial={p} onSave={save} onCancel={() => setEditing(null)} />
            : (
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '14px', color: 'var(--text)' }}>{p.title}</span>
                    <span style={{ fontSize: '10px', color: p.published ? 'var(--accent2)' : 'var(--muted)', marginLeft: '12px' }}>{p.published ? 'published' : 'draft'}</span>
                    {p.views > 0 && <span style={{ fontSize: '10px', color: 'var(--muted)', marginLeft: '8px' }}>· {p.views} reads</span>}
                    {p.date && <span style={{ fontSize: '10px', color: 'var(--muted2)', marginLeft: '8px' }}>· {new Date(p.date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={S.btnGhost} onClick={() => { setEditing(p._id); setCreating(false) }}>edit</button>
                    <button style={S.btnDanger} onClick={() => remove(p._id)}>delete</button>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      ))}
    </>
  )
}

// ── Main Admin ─────────────────────────────────────────────────────────
export default function Admin() {
  const { token, setToken, headers } = useAuth()
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('messages')

  useEffect(() => {
    if (!token) return
    fetch('/api/admin/data', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); else { sessionStorage.removeItem('admin_token'); setToken(null) } })
      .catch(() => {})
  }, [token])

  if (!token) return <Login onLogin={setToken} />

  return (
    <div style={S.page}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <div style={S.label}>// admin</div>
            <h1 style={{ fontSize: '24px', fontWeight: 300 }}>Dashboard</h1>
          </div>
          <button onClick={() => { sessionStorage.removeItem('admin_token'); setToken(null) }} style={S.btnGhost}>Logout</button>
        </div>

        <div style={{ display: 'flex', gap: '0', marginBottom: '40px', borderBottom: '0.5px solid var(--border)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'none', border: 'none', borderBottom: tab === t ? '1.5px solid var(--accent)' : '1.5px solid transparent',
              color: tab === t ? 'var(--accent)' : 'var(--muted)', padding: '8px 20px', cursor: 'pointer', marginBottom: '-0.5px',
            }}>{t}</button>
          ))}
        </div>

        {tab === 'messages' && <MessagesTab data={data} headers={headers} onRefresh={() =>
          fetch('/api/admin/data', { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null).then(d => { if (d) setData(d) }).catch(() => {})
        } />}
        {tab === 'projects' && <ProjectsTab headers={headers} />}
        {tab === 'posts' && <PostsTab headers={headers} />}
      </div>
    </div>
  )
}
