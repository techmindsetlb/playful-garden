import { useState, useEffect } from 'react'

const initialNotes = [
  {
    id: 1,
    text: "Nagham, you make every day feel like a sunflower bloom 🌻",
    color: '#fff8e1',
    x: 10, y: 10,
    rot: -3,
  },
  {
    id: 2,
    text: "I love our cappuccino dates more than words can say ☕💕",
    color: '#fce4ec',
    x: 30, y: 40,
    rot: 2,
  },
  {
    id: 3,
    text: "You're the most beautiful person inside and out ✨",
    color: '#e8f5e9',
    x: 50, y: 20,
    rot: -1,
  },
  {
    id: 4,
    text: "Every moment with you is a treasure I'll keep forever 💎",
    color: '#fff3e0',
    x: 65, y: 50,
    rot: 4,
  },
  {
    id: 5,
    text: "Your smile lights up my whole world 😊🌟",
    color: '#f3e5f5',
    x: 15, y: 65,
    rot: -2,
  },
]

const noteColors = ['#fff8e1', '#fce4ec', '#e8f5e9', '#fff3e0', '#f3e5f5', '#e0f7fa', '#fbe9e7']
const randomRot = () => Math.floor(Math.random() * 8) - 4

export default function LoveNotes() {
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [flyingNotes, setFlyingNotes] = useState([])

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
    setNotes(prev => [note, ...prev])
    setNewNote('')
    setShowForm(false)
  }

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
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
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-sticky"
            style={{
              background: note.color,
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
