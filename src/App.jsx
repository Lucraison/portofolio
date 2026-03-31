import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import './App.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Notes from './components/Notes'
import Contact from './components/Contact'
import useReveal from './hooks/useReveal'
import useSeo from './hooks/useSeo'

const ProjectDetail = lazy(() => import('./components/ProjectDetail'))
const AllProjects = lazy(() => import('./components/AllProjects'))
const Blog = lazy(() => import('./components/Blog'))
const BlogPost = lazy(() => import('./components/BlogPost'))
const Admin = lazy(() => import('./components/Admin'))
const GuideVPS = lazy(() => import('./components/guides/GuideVPS'))

const BASE_NAV = ['about', 'projects', 'skills', 'education', 'contact']

function Home() {
  const [active, setActive] = useState('about')
  const [hasPosts, setHasPosts] = useState(true)

  useReveal()
  useSeo({
    title: 'Nicolas Herrera - Full Stack Portfolio',
    description: 'Developer portfolio with projects, guides, and notes by Nicolas Herrera.',
    image: '/og.png',
  })

  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(d => setHasPosts(d.length > 0)).catch(() => {})
  }, [])

  const navLinks = hasPosts
    ? ['about', 'projects', 'skills', 'education', 'notes', 'contact']
    : BASE_NAV

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    navLinks.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [hasPosts])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--sans)' }}>
      <Nav active={active} links={navLinks} />
      <Hero />
      <Projects />
      <Skills />
      <Education />
      <Notes />
      <Contact />
    </div>
  )
}

function RouteLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--muted)', fontFamily: 'var(--mono)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      loading...
    </div>
  )
}

function HireBanner() {
  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.location.href = '/#contact'
  }
  return (
    <div onClick={scrollToContact} style={{
      position: 'fixed', bottom: '32px', right: '16px', zIndex: 90,
      background: 'var(--accent)', color: 'var(--bg)',
      fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '10px 18px', borderRadius: '999px',
      display: 'flex', alignItems: 'center',
      gap: '8px', cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}>
      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--bg)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      available for work
    </div>
  )
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf) }
    const id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])

  return (
    <>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides/vps" element={<GuideVPS />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </Suspense>
      <HireBanner />
    </>
  )
}
