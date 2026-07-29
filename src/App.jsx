import { useState, useEffect, useRef, useCallback } from 'react'
import Landing from './components/Landing.jsx'
import PullCord from './components/PullCord.jsx'
import LoveCounter from './components/LoveCounter.jsx'
import ComplimentGenerator from './components/ComplimentGenerator.jsx'
import Blob from './components/Blob.jsx'
import PhotoGallery from './components/PhotoGallery.jsx'
import LoveNotes from './components/LoveNotes.jsx'
import MiniGames from './components/MiniGames.jsx'
import BookReader from './components/BookReader.jsx'
import MemoriesTimeline from './components/MemoriesTimeline.jsx'
import './App.css'

export default function App() {
  const [theme, setTheme] = useState('light')
  const [entered, setEntered] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const headerRef = useRef(null)

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!entered) return
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      let current = ''
      sections.forEach(section => {
        const top = section.offsetTop - 200
        if (window.scrollY >= top) {
          current = section.id
        }
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [entered])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const navItems = [
    { id: 'love-counter', label: '⏳ Time', emoji: '⏳' },
    { id: 'memories', label: '📖 Story', emoji: '📖' },
    { id: 'book', label: '📕 Book', emoji: '📕' },
    { id: 'compliments', label: '💝 Love', emoji: '💝' },
    { id: 'blob', label: '🫧 Blob', emoji: '🫧' },
    { id: 'gallery', label: '📸 Photos', emoji: '📸' },
    { id: 'love-notes', label: '💌 Notes', emoji: '💌' },
    { id: 'games', label: '🎮 Games', emoji: '🎮' },
  ]

  if (!entered) {
    return <Landing onStart={() => setEntered(true)} />
  }

  return (
    <div className="app">
      {/* Theme Toggle Pull Cord - side fixed */}
      <div className="pullcord-fixed">
        <PullCord theme={theme} onToggle={toggleTheme} />
      </div>

      {/* Navigation */}
      <nav className="nav" ref={headerRef}>
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            🌻 Nagham's Garden
          </div>
          <div className="nav-links">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-link ${activeSection === item.id ? 'nav-link-active' : ''}`}
                onClick={() => scrollTo(item.id)}
              >
                <span className="nav-link-icon">{item.emoji}</span>
                <span className="nav-link-label">{item.label}</span>
              </button>
            ))}
          </div>
          <button className="nav-theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        {/* Mini hero */}
        <div className="main-hero">
          <div className="main-hero-sunflowers">
            <span className="hero-sunflower" style={{ left: '5%', animationDelay: '0s' }}>🌻</span>
            <span className="hero-sunflower" style={{ left: '25%', animationDelay: '0.8s' }}>🌻</span>
            <span className="hero-sunflower" style={{ left: '50%', animationDelay: '1.6s' }}>🌻</span>
            <span className="hero-sunflower" style={{ left: '72%', animationDelay: '0.4s' }}>🌻</span>
            <span className="hero-sunflower" style={{ left: '92%', animationDelay: '1.2s' }}>🌻</span>
          </div>
          <h1 className="main-hero-title">
            Hey Nagham 💕
          </h1>
          <p className="main-hero-sub">
            Every flower in this garden blooms for you.
            <br />Explore, play, and smile — this is your corner of the internet. 🌻
          </p>
        </div>

        <LoveCounter />
        <MemoriesTimeline />
        <BookReader />
        <ComplimentGenerator />
        <Blob theme={theme} />
        <PhotoGallery />
        <LoveNotes />
        <MiniGames />

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-sunflowers">
              <span>🌻</span>
              <span>🌻</span>
              <span>🌻</span>
            </div>
            <p className="footer-text">
              Made with infinite love, cappuccino, and sunflower seeds ☕🌻💕
            </p>
            <p className="footer-sub">
              For Nagham — always and forever
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
