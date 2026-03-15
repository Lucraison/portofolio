import { useState, useEffect } from 'react'
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
import ProjectDetail from './components/ProjectDetail'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import Admin from './components/Admin'
import useReveal from './hooks/useReveal'
import GuideVPS from './components/guides/GuideVPS'

const BASE_NAV = ['about', 'projects', 'skills', 'education', 'contact']

function Home() {
  const [active, setActive] = useState('about')
  const [hasPosts, setHasPosts] = useState(false)

  useReveal()

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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guides/vps" element={<GuideVPS />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
    </Routes>
  )
}
