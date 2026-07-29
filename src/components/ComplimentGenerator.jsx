import { useState, useEffect, useRef } from 'react'
import { compliments } from '../data/compliments.js'

export default function ComplimentGenerator() {
  const [current, setCurrent] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [history, setHistory] = useState([])
  const [usedCompliments, setUsedCompliments] = useState([])
  const intervalRef = useRef(null)

  const getNewCompliment = () => {
    setIsAnimating(true)
    setTimeout(() => {
      let available = compliments.filter(c => !usedCompliments.includes(c))
      if (available.length === 0) {
        setUsedCompliments([])
        available = compliments
      }
      const random = available[Math.floor(Math.random() * available.length)]
      setCurrent(random)
      setUsedCompliments(prev => [...prev, random])
      setHistory(prev => [random, ...prev].slice(0, 10))
      setIsAnimating(false)
    }, 300)
  }

  const startAutoPlay = () => {
    if (intervalRef.current) return
    getNewCompliment()
    intervalRef.current = setInterval(getNewCompliment, 4000)
  }

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    getNewCompliment()
    return () => stopAutoPlay()
  }, [])

  return (
    <section id="compliments" className="section">
      <h2 className="section-title">Compliments for You 💝</h2>
      <p className="section-subtitle">A never-ending supply of reasons you're amazing</p>

      <div className="compliment-card card" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <div className={`compliment-emoji ${isAnimating ? 'compliment-bounce' : ''}`}>
          💌
        </div>
        <p className={`compliment-text ${isAnimating ? 'compliment-fade' : ''}`}>
          {current || 'Loading...'}
        </p>
        <div className="compliment-actions">
          <button className="btn" onClick={getNewCompliment} disabled={isAnimating}>
            ✨ Another one!
          </button>
          <button
            className={`btn btn-outline ${intervalRef.current ? 'active' : ''}`}
            onClick={intervalRef.current ? stopAutoPlay : startAutoPlay}
          >
            {intervalRef.current ? '⏹ Stop' : '▶ Auto-play'}
          </button>
        </div>

        {history.length > 1 && (
          <div className="compliment-history">
            <p className="history-title">Recent favorites:</p>
            <div className="history-list">
              {history.slice(1, 5).map((c, i) => (
                <div key={i} className="history-item">
                  <span className="history-bullet">💕</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
