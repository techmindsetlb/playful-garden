import { useState, useEffect } from 'react'
import { loadData, saveData } from '../data/appStore.js'

export default function ComplaintsForm() {
  const [complaints, setComplaints] = useState([])
  const [text, setText] = useState('')
  const [about, setAbout] = useState('Abbass')

  useEffect(() => {
    const data = loadData()
    setComplaints(data.complaints || [])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const newComplaint = {
      id: Date.now(),
      about,
      text: text.trim(),
      date: new Date().toLocaleDateString(),
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
      <p className="section-subtitle">Nagham, got a complaint about Abbass? Let it out! (All in good fun 😂)</p>

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto 32px' }}>
        <div style={{ marginBottom: 12 }}>
          <select
            value={about}
            onChange={e => setAbout(e.target.value)}
            className="note-textarea"
            style={{ marginBottom: 8, minHeight: 'auto', padding: '10px 14px', cursor: 'pointer' }}
          >
            <option value="Abbass">About Abbass 💁</option>
          </select>
          <textarea
            placeholder="What did Abbass do this time? 🙈"
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
                <th>About</th>
                <th>Complaint 😤</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>{c.about || c.name || 'Abbass'}</td>
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
