import { useState, useEffect } from 'react'
import { loadData, saveData } from '../data/appStore.js'

export default function ComplimentsForm() {
  const [compliments, setCompliments] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    const data = loadData()
    setCompliments(data.submittedCompliments || [])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const newCompliment = {
      id: Date.now(),
      name: name.trim() || 'Anonymous 💕',
      text: text.trim(),
      date: new Date().toLocaleDateString(),
    }
    const updated = [newCompliment, ...compliments]
    setCompliments(updated)
    const data = loadData()
    data.submittedCompliments = updated
    saveData(data)
    setText('')
  }

  const handleDelete = (id) => {
    const updated = compliments.filter(c => c.id !== id)
    setCompliments(updated)
    const data = loadData()
    data.submittedCompliments = updated
    saveData(data)
  }

  return (
    <section id="submitted-compliments" className="section">
      <h2 className="section-title">💝 Write a Compliment</h2>
      <p className="section-subtitle">Tell Nagham something lovely! These will be saved forever 💕</p>

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto 32px' }}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="note-textarea"
            style={{ marginBottom: 8, minHeight: 'auto', padding: '10px 14px' }}
          />
          <textarea
            placeholder="Write something sweet for Nagham... ✨"
            value={text}
            onChange={e => setText(e.target.value)}
            className="note-textarea"
            maxLength={300}
            rows={3}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{text.length}/300</span>
          <button className="btn" type="submit" disabled={!text.trim()}>
            💕 Send Love
          </button>
        </div>
      </form>

      {compliments.length > 0 && (
        <div className="complaints-table-wrapper">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>#</th>
                <th>From</th>
                <th>Compliment 💝</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {compliments.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.text}</td>
                  <td className="complaints-date">{c.date}</td>
                  <td>
                    <button className="complaints-delete" onClick={() => handleDelete(c.id)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
