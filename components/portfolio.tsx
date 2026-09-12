'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, ArrowDown, Code2, GitFork as Github, BriefcaseBusiness as Linkedin, Mail, Download, Sun, Moon, Menu, X, Box, Braces, MapPin, Terminal, Cpu, Atom, Briefcase, GraduationCap, Building2, Calendar, Sparkles } from 'lucide-react'
import { profile, projects } from '@/lib/portfolio-data'
import SiteLoader from './site-loader'
import { UplinkLoader } from '@designcodeio/threeui'
import '@designcodeio/threeui/style.css'

const Workstation = dynamic(() => import('./workstation'), { ssr: false, loading: () => <div className="scene-loading">Setting up the workspace<span /></div> })
const sections = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact']

const timelineData = [
  {
    type: 'Education',
    date: 'AUG 2025 — PRESENT',
    isCurrent: true,
    title: 'Master of Computer Applications',
    place: 'Chandigarh University',
    body: 'Specializing in advanced software design patterns, distributed cloud systems, machine learning architectures, and algorithmic optimization.',
    skills: ['Machine Learning', 'System Design', 'Algorithms', 'Cloud Computing'],
    icon: GraduationCap,
  },
  {
    type: 'Experience',
    date: 'FEB — AUG 2025',
    isCurrent: false,
    title: 'MERN Stack Developer Intern',
    place: 'Digipodium · Remote',
    body: 'Built and scaled full-stack web applications, REST APIs, and real-time administrative dashboards. Streamlined database aggregation pipelines in MongoDB and collaborated with cross-functional teams to automate continuous deployment.',
    skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'],
    icon: Briefcase,
  },
  {
    type: 'Education',
    date: 'OCT 2022 — JUN 2025',
    isCurrent: false,
    title: 'Bachelor of Computer Applications',
    place: 'Sherwood College of Professional Management',
    body: 'Developed deep foundations in core computer science, object-oriented engineering, data structures, and database management systems.',
    skills: ['Data Structures', 'OOP', 'DBMS', 'Web Architecture', 'C/C++'],
    icon: GraduationCap,
  },
]

export default function Portfolio() {
  const [light, setLight] = useState(false)
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('home')
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [is3DLoaded, setIs3DLoaded] = useState(false)
  const [loaderComplete, setLoaderComplete] = useState(false)
  const heroArt = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setIs3DLoaded(true)
    }, 4500)
    return () => clearTimeout(safetyTimer)
  }, [])

  useEffect(() => {
    if (!loaderComplete) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [loaderComplete])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id) }) }, { rootMargin: '-15% 0px -55% 0px' })
    document.querySelectorAll('section[id]').forEach(section => observer.observe(section))
    const reveal = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); reveal.unobserve(entry.target) } }) }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el))
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      setProgress(max > 0 ? scrollY / max : 0); setScrolled(scrollY > 40)
      if (heroArt.current && !reduced) heroArt.current.style.setProperty('--parallax', `${Math.min(scrollY, 900) * 0.18}px`)
    }
    onScroll(); addEventListener('scroll', onScroll, { passive: true })
    return () => { observer.disconnect(); reveal.disconnect(); removeEventListener('scroll', onScroll) }
  }, [])
  const tilt = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width - 0.5) * 2}`)
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height - 0.5) * 2}`)
  }
  const untilt = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.setProperty('--mx', '0'); e.currentTarget.style.setProperty('--my', '0') }
  return (
    <>
      <SiteLoader isLoaded={is3DLoaded} onComplete={() => setLoaderComplete(true)} />
      <div className={`portfolio ${light ? 'light-mode' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
    <span className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    <a className="skip-link" href="#home">Skip to content</a>
    <aside className="side-rail"><a className="rail-brand" href="#home" aria-label="Home"><Code2 /></a><nav aria-label="Section shortcuts">{['home', 'about', 'projects', 'contact'].map((s, i) => <a className={active === s ? 'active' : ''} key={s} href={`#${s}`} aria-label={s}>0{i + 1}</a>)}</nav><div className="rail-socials"><a href={profile.github} aria-label="GitHub" target="_blank" rel="noreferrer"><Github /></a><a href={profile.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin /></a><a href={`mailto:${profile.email}`} aria-label="Email"><Mail /></a></div><span className="rail-bottom">SCROLL TO EXPLORE</span></aside>
    <header className="header"><a className="brand" href="#home" aria-label="Ayush home"><span>{'<'}</span><i>/</i><span>{'>'}</span><small>AYUSH<span>.</span></small></a><nav className="desktop-nav" aria-label="Main navigation">{sections.map(s => <a key={s} className={active === s.toLowerCase() ? 'active' : ''} href={`#${s.toLowerCase()}`}>{s}</a>)}</nav><div className="header-actions"><button className="theme-toggle" onClick={() => setLight(!light)} aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}><Sun size={18} /><span className="toggle-track"><span /></span><Moon size={16} /></button><a className="talk-button" href="#contact">Let&apos;s Talk <ArrowUpRight size={16} /></a><button className="menu-button" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div>{menu && <nav className="mobile-nav" aria-label="Mobile navigation">{sections.map(s => <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setMenu(false)}>{s}</a>)}</nav>}</header>
    <main>
      <section className="hero" id="home"><div className="hero-copy"><p className="eyebrow rise" style={{ '--d': '0s' } as React.CSSProperties}><span /> HELLO, I&apos;M</p><h1 className="rise" style={{ '--d': '.1s' } as React.CSSProperties}>Ayush Kumar<br /><span>Yadav<span className="name-dot">.</span></span></h1><p className="hero-role rise" style={{ '--d': '.22s' } as React.CSSProperties}>Full Stack <span>&</span> Mobile Developer</p><p className="hero-description rise" style={{ '--d': '.32s' } as React.CSSProperties}>I turn complex problems into thoughtful digital experiences. Clean code, a curious mind, and a passion for building things that matter.</p><div className="hero-actions rise" style={{ '--d': '.42s' } as React.CSSProperties}><a className="primary-button" href="#projects">View My Work <ArrowRight size={19} /></a><a className="download-link" href={profile.resume} target="_blank" rel="noreferrer">Download CV <Download size={18} /></a></div><div className="availability rise" style={{ '--d': '.52s' } as React.CSSProperties}><span /><span>Open to opportunities</span><i /> <MapPin size={13} /> Lucknow, India</div></div>
      <div className="hero-art" ref={heroArt} onMouseMove={tilt} onMouseLeave={untilt}><div className="orb" /><div className="window-glow" /><div className="scene"><Workstation onLoaded={() => setIs3DLoaded(true)} /></div><div className="code-note">Code.<br />Create.<br />Innovate.<br /><span>Repeat.</span></div><div className="tech-tile tile-react"><Atom size={35} /><small>React</small></div><div className="tech-tile tile-node"><Braces /><small>Node.js</small></div><div className="tech-tile tile-js">JS</div><div className="tech-tile tile-ts">TS</div><div className="scene-caption"><span /><span>MY EVERYDAY WORKSPACE</span><span className="interact-hint">MOVE YOUR CURSOR ↗</span></div></div>
      <a className="scroll-cue" href="#about"><span>SCROLL TO DISCOVER</span><ArrowDown size={15} /></a><span className="hero-coordinate">DESIGNED WITH INTENT. BUILT WITH CODE.</span></section>
      <section className="about-panel content-shell" id="about" data-reveal><div data-reveal><p className="eyebrow">A LITTLE ABOUT ME</p><h2>Crafting Code,<br /><span>Creating Impact.</span></h2><a className="subtle-link" href={profile.resume} target="_blank" rel="noreferrer">More about me <ArrowUpRight size={16} /></a></div><div className="about-body" data-reveal style={{ '--d': '.15s' } as React.CSSProperties}><p>I&apos;m Ayush, a full-stack and mobile developer who loves turning ideas into things people can actually use. From MERN applications to Flutter experiences and applied AI, I connect the details to build a better whole.</p><div className="values"><div><Code2 /><span><strong>Clean Code</strong><small>Thoughtful, maintainable,<br />and built to grow.</small></span></div><div><Box /><span><strong>Problem Solver</strong><small>Complex challenges.<br />Simple experiences.</small></span></div></div></div><div className="about-art" aria-hidden="true" data-reveal style={{ '--d': '.3s' } as React.CSSProperties}><div className="about-orbit" /><div className="code-cube"><Code2 /></div><span>ALWAYS CURIOUS.<br />ALWAYS BUILDING.</span></div></section>
      <section className="skills-section content-shell section-space" id="skills"><div className="section-heading" data-reveal><div><p className="eyebrow">MY TOOLKIT</p><h2>The right tools.<br /><span>Endless possibilities.</span></h2></div><p>From the first pixel to the last API call,<br />a stack that brings ideas to life.</p></div><div className="skill-grid">{[{ icon: Code2, title: 'Frontend', tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] }, { icon: Terminal, title: 'Backend', tags: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'] }, { icon: Box, title: 'Mobile', tags: ['Flutter', 'Dart', 'Responsive UI'] }, { icon: Cpu, title: 'AI & Engineering', tags: ['Python', 'PyTorch', 'GitHub Actions', 'Vercel'] }].map((s, i) => <article className="skill-card" key={s.title} data-reveal style={{ '--d': `${i * 0.1}s` } as React.CSSProperties} onMouseMove={tilt} onMouseLeave={untilt}><s.icon /><h3>{s.title}</h3><div className="tags">{s.tags.map(t => <span key={t}>{t}</span>)}</div></article>)}</div></section>
      <section className="content-shell section-space" id="projects"><div className="section-heading" data-reveal><div><p className="eyebrow">SELECTED WORK</p><h2>Ideas made <span>real.</span></h2></div><a className="subtle-link" href={profile.github} target="_blank" rel="noreferrer">Explore GitHub <ArrowUpRight size={17} /></a></div><div className="projects-grid">{projects.map((p, i) => <article className="project-card" key={p.slug} data-reveal style={{ '--d': `${(i % 3) * 0.12}s` } as React.CSSProperties} onMouseMove={tilt} onMouseLeave={untilt}><a className="project-image" href={p.live || p.github} target="_blank" rel="noreferrer"><Image src={p.image} alt={p.imageAlt} width={800} height={600} /><span className="project-visit"><ArrowUpRight /></span></a><div className="project-info"><p className="project-category">0{i + 1} / {p.category}</p><h3>{p.name}</h3><p>{p.description}</p><div className="project-bottom"><div className="tags">{p.stack.slice(0, 3).map(t => <span key={t}>{t}</span>)}</div><a href={p.github} target="_blank" rel="noreferrer" aria-label={`${p.name} source code`}><Github size={19} /></a></div></div></article>)}</div></section>
      <section className="content-shell section-space experience-section" id="experience">
        <div className="experience-lead" data-reveal>
          <p className="eyebrow"><Sparkles size={13} /> THE JOURNEY SO FAR</p>
          <h2>Learning by<br /><span>shipping.</span></h2>
          <p className="muted">
            Real projects. Collaborative teams. A dedication to clean code, maintainable architectures, and measurable user impact with every release.
          </p>
          <div className="experience-stats">
            <div className="stat-pill">
              <span className="stat-num">3+</span>
              <span className="stat-lbl">Years Building</span>
            </div>
            <div className="stat-pill">
              <span className="stat-num">Full Stack</span>
              <span className="stat-lbl">& Mobile Core</span>
            </div>
          </div>
          <a className="subtle-link experience-cv-link" href={profile.resume} target="_blank" rel="noreferrer">
            View Full Curriculum Vitae <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="timeline-wrapper">
          <div className="timeline-spine" aria-hidden="true" />
          <div className="timeline-items">
            {timelineData.map((e, i) => {
              const Icon = e.icon
              return (
                <article
                  key={e.title}
                  className="timeline-entry"
                  data-reveal
                  style={{ '--d': `${i * 0.12}s` } as React.CSSProperties}
                  onMouseMove={tilt}
                  onMouseLeave={untilt}
                >
                  <div className={`timeline-node ${e.isCurrent ? 'is-current' : ''}`}>
                    <Icon size={16} />
                    {e.isCurrent && <span className="node-beacon" />}
                  </div>

                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      <span className="timeline-date-chip">
                        <Calendar size={12} />
                        {e.date}
                      </span>
                      <span className={`timeline-type-pill ${e.isCurrent ? 'is-active' : ''}`}>
                        {e.isCurrent ? 'Present' : e.type}
                      </span>
                    </div>

                    <h3 className="timeline-title">{e.title}</h3>

                    <div className="timeline-meta">
                      <Building2 size={14} />
                      <span>{e.place}</span>
                    </div>

                    <p className="timeline-body">{e.body}</p>

                    <div className="timeline-skills">
                      {e.skills.map((s) => (
                        <span key={s} className="skill-chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
      <section className="contact-section content-shell" id="contact"><p className="eyebrow" data-reveal>HAVE SOMETHING IN MIND?</p><h2 data-reveal style={{ '--d': '.1s' } as React.CSSProperties}>Let&apos;s build something<br /><span>worth putting out there.</span></h2><a className="primary-button" href={`mailto:${profile.email}`} data-reveal style={{ '--d': '.2s' } as React.CSSProperties}>Let&apos;s talk <ArrowUpRight size={20} /></a><a className="contact-email" data-reveal style={{ '--d': '.3s' } as React.CSSProperties} href={`mailto:${profile.email}`}>{profile.email}</a></section>
    </main><footer className="content-shell"><a className="brand" href="#home">ak<span>.</span></a><p>Built with curiosity. Crafted with care.</p><a href={profile.website} target="_blank" rel="noreferrer">devtacet.me</a><span>© {new Date().getFullYear()} Ayush Kumar Yadav</span><a href="#home" aria-label="Back to top"><ArrowUpRight size={20} /></a></footer>
  </div>
  </>
  )
}
