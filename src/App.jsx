import { useState, useEffect, useRef, useCallback } from 'react'
import { PullCord } from 'pullcord'
import { JellyBlobMascot } from 'feral-blob'
import 'pullcord/pullcord.css'
import 'feral-blob/blob.css'
import PinLock from './components/PinLock.jsx'
import Landing from './components/Landing.jsx'
import LoveCounter from './components/LoveCounter.jsx'
import ComplimentGenerator from './components/ComplimentGenerator.jsx'
import PhotoGallery from './components/PhotoGallery.jsx'
import LoveNotes from './components/LoveNotes.jsx'
import MiniGames from './components/MiniGames.jsx'
import BookReader from './components/BookReader.jsx'
import MemoriesTimeline from './components/MemoriesTimeline.jsx'
import ComplaintsForm from './components/ComplaintsForm.jsx'
import ComplimentsForm from './components/ComplimentsForm.jsx'
import { loadData, exportToJSON, importFromJSON, syncFromGitHub, pushToGitHub, isSyncConfigured, getLastSyncTime } from './data/appStore.js'
import SYNC_CONFIG from './data/syncConfig.js'
import './App.css'

export default function App() {
  const [theme, setTheme] = useState('light')
  const [entered, setEntered] = useState(() => sessionStorage.getItem('ng_entered') === 'true')
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('ng_unlocked') === 'true')
  const [activeSection, setActiveSection] = useState('')
  const [blobMood, setBlobMood] = useState('happy')
  const [syncStatus, setSyncStatus] = useState('')
  const [syncing, setSyncing] = useState(false)
  const headerRef = useRef(null)
  const importRef = useRef(null)

  const handleUnlock = () => {
    sessionStorage.setItem('ng_unlocked', 'true')
    setUnlocked(true)
  }
  const handleEnter = () => {
    sessionStorage.setItem('ng_entered', 'true')
    setEntered(true)
  }

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
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [entered])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importFromJSON(file)
      window.location.reload()
    } catch (err) {
      alert('Failed to import: ' + err.message)
    }
  }

  const handleSyncFromGitHub = async () => {
    setSyncing(true)
    setSyncStatus('Syncing...')
    const result = await syncFromGitHub()
    setSyncing(false)
    if (result.ok) {
      setSyncStatus('✅ Synced!')
      setTimeout(() => setSyncStatus(''), 3000)
      window.location.reload()
    } else {
      setSyncStatus('❌ ' + (result.message || 'Sync failed'))
      setTimeout(() => setSyncStatus(''), 4000)
    }
  }

  const handlePushToGitHub = async () => {
    setSyncing(true)
    setSyncStatus('Pushing...')
    const result = await pushToGitHub()
    setSyncing(false)
    if (result.ok) {
      setSyncStatus('✅ Pushed!')
      setTimeout(() => setSyncStatus(''), 3000)
    } else {
      setSyncStatus('❌ ' + (result.message || 'Push failed'))
      setTimeout(() => setSyncStatus(''), 4000)
    }
  }

  const syncConfigured = isSyncConfigured()

  // Auto-sync from GitHub on page load — compares lastUpdated to avoid unecessary reloads
  useEffect(() => {
    if (!syncConfigured || !entered || !unlocked) return
    const before = loadData()
    const beforeTime = before.lastUpdated
    setSyncStatus('🔄 Syncing...')
    syncFromGitHub().then(result => {
      if (result.ok && result.data) {
        // Only reload if data actually changed on GitHub
        if (result.data.lastUpdated && result.data.lastUpdated !== beforeTime) {
          setSyncStatus('✅ Synced! Reloading...')
          // sessionStorage preserves unlock/enter state across reload
          setTimeout(() => window.location.reload(), 1000)
        } else {
          setSyncStatus('')
        }
      } else {
        setSyncStatus('')
      }
    }).catch(() => {
      setSyncStatus('')
    })
  }, [syncConfigured, entered, unlocked])

  if (!unlocked) {
    return <PinLock onUnlock={handleUnlock} />
  }

  if (!entered) {
    return <Landing onStart={handleEnter} />
  }

  const navItems = [
    { id: 'love-counter', label: '⏳ Time', emoji: '⏳' },
    { id: 'memories', label: '📖 Story', emoji: '📖' },
    { id: 'book', label: '📕 Book', emoji: '📕' },
    { id: 'compliments', label: '💝 Love', emoji: '💝' },
    { id: 'blob', label: '🫧 Blob', emoji: '🫧' },
    { id: 'gallery', label: '📸 Photos', emoji: '📸' },
    { id: 'love-notes', label: '💌 Notes', emoji: '💌' },
    { id: 'submitted-compliments', label: '💬 Say', emoji: '💬' },
    { id: 'complaints', label: '😤 Moan', emoji: '😤' },
    { id: 'games', label: '🎮 Games', emoji: '🎮' },
  ]

  return (
    <div className="app">
      <PullCord
        onPull={toggleTheme}
        pulled={theme === 'dark'}
        ariaLabel="Toggle theme"
      />

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
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {syncConfigured && (
              <>
                <button className="nav-theme-btn" onClick={handleSyncFromGitHub} disabled={syncing} title="Sync from GitHub">
                  📥
                </button>
                <button className="nav-theme-btn" onClick={handlePushToGitHub} disabled={syncing} title="Push to GitHub">
                  📤
                </button>
              </>
            )}
            <button className="nav-theme-btn" onClick={() => exportToJSON()} title="Download backup">
              💾
            </button>
            <button className="nav-theme-btn" onClick={() => importRef.current?.click()} title="Restore backup">
              📂
            </button>
            <input type="file" accept=".json" ref={importRef} onChange={handleImport} style={{ display: 'none' }} />
            <button className="nav-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>

      <main className="main">
        <div className="main-hero">
          <h1 className="main-hero-title">Hey Nagham 💕</h1>
          <p className="main-hero-sub">
            Every flower in this garden blooms for you.
            <br />Explore, play, and smile — this is your corner of the internet. 🌻
          </p>
        </div>

        <LoveCounter />
        <MemoriesTimeline />
        <BookReader />
        <ComplimentGenerator />

        <section id="blob" className="section">
          <h2 className="section-title">Meet Blobby 💜</h2>
          <p className="section-subtitle">Click or poke her — see what happens!</p>
          <div className="blob-wrapper">
            <JellyBlobMascot
              mood={blobMood}
              onOverpoke={() => setBlobMood('happy')}
            />
          </div>
          <div className="blob-hint">
            Mood: <strong>{blobMood}</strong>
          </div>
        </section>

        <PhotoGallery />
        <LoveNotes />
        <ComplimentsForm />
        <ComplaintsForm />
        <MiniGames />

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
            {syncStatus && (
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-pink)', marginTop: 12 }}>
                {syncStatus}
              </p>
            )}
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {syncConfigured && (
                <>
                  <button className="btn btn-outline" onClick={handleSyncFromGitHub} disabled={syncing} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                    📥 Sync from GitHub
                  </button>
                  <button className="btn btn-outline" onClick={handlePushToGitHub} disabled={syncing} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                    📤 Push to GitHub
                  </button>
                </>
              )}
              <button className="btn btn-outline" onClick={() => exportToJSON()} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                💾 Download Backup
              </button>
              <button className="btn btn-outline" onClick={() => importRef.current?.click()} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                📂 Restore Backup
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
