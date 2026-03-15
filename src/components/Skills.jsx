import SKILLS from '../data/skills.json'

const CATEGORIES = ['Languages', 'Frontend', 'Backend', 'Database', 'Tools']

export default function Skills() {
  return (
    <section id="skills" style={{ padding: '100px 40px', borderBottom: '0.5px solid var(--border)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // skills
        </div>
        <h2 className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 300, color: 'var(--text)', marginBottom: '48px' }}>
          What I work with
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {CATEGORIES.map(cat => (
            <div key={cat} className="reveal">
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>
                {cat}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SKILLS.filter(s => s.category === cat).sort((a, b) => b.level - a.level).map(skill => (
                  <div key={skill.name} style={{
                    border: `0.5px solid ${skill.level === 2 ? 'var(--border-hi)' : 'var(--border)'}`,
                    background: 'var(--bg1)',
                    padding: '8px 14px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: skill.level === 2 ? 'var(--text)' : 'var(--muted)' }}>
                      {skill.name}
                    </span>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: skill.level === 2 ? 'var(--accent)' : 'var(--muted2)' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted2)', marginTop: '32px', letterSpacing: '0.06em' }}>
          <span style={{ color: 'var(--accent)' }}>●</span> comfortable &nbsp;&nbsp;
          <span style={{ color: 'var(--muted2)' }}>●</span> familiar
        </p>
      </div>
    </section>
  )
}
