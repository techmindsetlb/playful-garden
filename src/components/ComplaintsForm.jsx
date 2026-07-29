import { useState, useEffect } from 'react'
import { loadData, saveData } from '../data/appStore.js'

const noteColors = ['#fff8e1', '#fce4ec', '#e8f5e9', '#fff3e0', '#f3e5f5']

export default function ComplaintsForm() {
  const [complaints, setComplaints] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    const data = loadData()
    setComplaints(data.complaints || [])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const newComplaint = {
      id: Date.now(),
      name: name.trim() || 'Anonymous',
      text: text.trim(),
      date: new Date().toLocaleDateString(),
      color: noteColors[Math.floor(Math.random() * noteColors.length)],
    }
    const updated = [newComplaint, ...complaints]
    setComplaints(updated)
    const data = loadData()
    data.complaints = updated
    saveData(data)
    setText('')
  }

  const handleDelete = (id) => {
    const updated = complaints.filter(c => c.id !== id)
    setComplaints(updated)
    const data = loadData()
    data.complaints = updated
    saveData(data)
  }

  return (
    <section id="complaints" className="section">
      <h2 className="section-title">😤 Complaints Department</h2>
      <p className="section-subtitle">Got something to complain about? Let it out! (All in good fun 😂)</p>

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
            placeholder="What's your complaint? 🙈"
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
            😤 Submit Complaint
          </button>
        </div>
      </form>

      {complaints.length > 0 && (
        <div className="complaints-table-wrapper">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Complaint 😤</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
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
