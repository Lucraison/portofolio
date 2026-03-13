import SKILLS from '../data/skills.json'

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {SKILLS.map((skill) => (
            <div key={skill.name} className="reveal" style={{
              border: '0.5px solid var(--border)', background: 'var(--bg1)',
              padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: skill.level === 2 ? 'var(--text)' : 'var(--muted)' }}>
                {skill.name}
              </span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1, 2].map(d => (
                  <div key={d} style={{ width: '4px', height: '4px', borderRadius: '50%', background: skill.level >= d ? 'var(--accent)' : 'var(--muted2)' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted2)', marginTop: '24px', letterSpacing: '0.06em' }}>
          <span style={{ color: 'var(--accent)' }}>●</span> comfortable &nbsp;&nbsp;
          <span style={{ color: 'var(--muted2)' }}>●</span> familiar
        </p>
      </div>
    </section>
  )
}