import PROJECTS from '../data/projects.json'
import ProjectCard from './ProjectCard'

export default function Projects() {
  return (
    <section id="projects" style={{ padding: '100px 40px', borderBottom: '0.5px solid var(--border)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          // projects
        </div>
        <h2 className="reveal" style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 300, color: 'var(--text)', marginBottom: '48px' }}>
          Things I've built
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}