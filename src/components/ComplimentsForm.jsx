import { useState, useEffect } from 'react'
import { loadData, saveData } from '../data/appStore.js'

export default function ComplimentsForm() {
  const [compliments, setCompliments] = useState([])
  const [text, setText] = useState('')
  const [from, setFrom] = useState('Nagham')

  useEffect(() => {
    const data = loadData()
    setCompliments(data.submittedCompliments || [])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const newCompliment = {
      id: Date.now(),
      from,
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
      <h2 className="section-title">💝 Compliments Corner</h2>
      <p className="section-subtitle">Sweet words for each other — from Nagham or Abbass! ✨</p>

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto 32px' }}>
        <div style={{ marginBottom: 12 }}>
          <select
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="note-textarea"
            style={{ marginBottom: 8, minHeight: 'auto', padding: '10px 14px', cursor: 'pointer' }}
          >
            <option value="Nagham">You (Nagham) 💕</option>
            <option value="Abbass">Abbass 💙</option>
          </select>
          <textarea
            placeholder={
              from === 'Nagham'
                ? "Write something sweet to Abbass... ✨"
                : "Write something sweet to Nagham... ✨"
            }
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
                  <td>{c.from || c.name || 'Nagham'}</td>
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
