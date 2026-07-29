import { useState, useEffect } from 'react'
import { loadData, saveData } from '../data/appStore.js'

const noteColors = ['#fff8e1', '#fce4ec', '#e8f5e9', '#fff3e0', '#f3e5f5', '#e0f7fa', '#fbe9e7']
const randomRot = () => Math.floor(Math.random() * 8) - 4

export default function LoveNotes() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [flyingNotes, setFlyingNotes] = useState([])
  const [syncStatus, setSyncStatus] = useState('')

  useEffect(() => {
    const data = loadData()
    if (data.loveNotes?.length) {
      setNotes(data.loveNotes.map(n => ({
        ...n,
        x: n.x || Math.floor(Math.random() * 60) + 5,
        y: n.y || Math.floor(Math.random() * 50) + 10,
        rot: n.rot ?? randomRot(),
        color: n.color || noteColors[Math.floor(Math.random() * noteColors.length)],
      })))
    }
  }, [])

  const persistNotes = async (updatedNotes) => {
    const data = loadData()
    data.loveNotes = updatedNotes
    saveData(data)
    // Also push to GitHub immediately
    const { pushToGitHub } = await import('../data/appStore.js')
    const result = await pushToGitHub()
    if (result.ok) {
      setSyncStatus('✅ Synced')
      setTimeout(() => setSyncStatus(''), 2000)
    } else {
      setSyncStatus('❌ Sync failed')
      setTimeout(() => setSyncStatus(''), 3000)
    }
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    const note = {
      id: Date.now(),
      text: newNote.trim(),
      color: noteColors[Math.floor(Math.random() * noteColors.length)],
      x: Math.floor(Math.random() * 60) + 5,
      y: Math.floor(Math.random() * 50) + 10,
      rot: randomRot(),
    }
    const updated = [note, ...notes]
    setNotes(updated)
    setNewNote('')
    setShowForm(false)
    persistNotes(updated)
  }

  const handleDeleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    persistNotes(updated)
  }

  // Floating decorative notes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const flyNote = {
          id: Date.now(),
          text: ['💕', '🌻', '☕', '✨', '🥰'][Math.floor(Math.random() * 5)],
          x: Math.random() * 80 + 10,
          startY: 100,
        }
        setFlyingNotes(prev => [...prev, flyNote])
        setTimeout(() => {
          setFlyingNotes(prev => prev.filter(n => n.id !== flyNote.id))
        }, 3000)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="love-notes" className="section">
      <h2 className="section-title">Love Notes 💌</h2>
      <p className="section-subtitle">Little messages from the heart</p>

      {syncStatus && (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent-pink)', marginBottom: 12 }}>
          {syncStatus}
        </p>
      )}

      <div className="notes-actions">
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '✍️ Write a note'}
        </button>
      </div>

      {showForm && (
        <div className="note-form card">
          <textarea
            className="note-textarea"
            placeholder="Write something sweet for Nagham..."
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            maxLength={200}
            rows={3}
            autoFocus
          />
          <div className="note-form-actions">
            <span className="note-char-count">{newNote.length}/200</span>
            <button className="btn" onClick={handleAddNote} disabled={!newNote.trim()}>
              💕 Pin it!
            </button>
          </div>
        </div>
      )}

      <div className="notes-board">
        {notes.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
            No love notes yet... write one! 💌
          </p>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-sticky"
            style={{
              background: note.color || '#fff8e1',
              left: `${note.x}%`,
              top: `${note.y}%`,
              transform: `rotate(${note.rot}deg)`,
              color: '#3e2723',
            }}
          >
            <button className="note-delete" onClick={() => handleDeleteNote(note.id)}>✕</button>
            <p className="note-text">{note.text}</p>
            <div className="note-pin">📌</div>
          </div>
        ))}
      </div>
    </section>
  )
}
