import { useState, useEffect, useRef } from 'react'

export default function LoveCounter() {
  const startDate = new Date('2025-07-25')
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [totalDays, setTotalDays] = useState(0)
  const [milestones, setMilestones] = useState([])
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const diff = now - startDate
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTime({ days, hours, minutes, seconds })
      setTotalDays(days)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate milestones based on total days
  useEffect(() => {
    const milestoneData = [
      { day: 1, emoji: '🥰', label: 'First day of forever' },
      { day: 7, emoji: '💫', label: 'One week of magic' },
      { day: 30, emoji: '🌙', label: 'One moon together' },
      { day: 100, emoji: '🎉', label: 'Triple digits!' },
      { day: 200, emoji: '🌟', label: 'Double century' },
      { day: 365, emoji: '🎂', label: 'One year!' },
      { day: 500, emoji: '💎', label: '500 gems' },
    ]
    const reached = milestoneData.filter(m => totalDays >= m.day).reverse()
    setMilestones(reached)
  }, [totalDays])

  return (
    <section id="love-counter" className="section" ref={ref}>
      <h2 className="section-title">Our Time Together ⏳</h2>
      <p className="section-subtitle">Every second with you is a treasure</p>

      <div className={`counter-container ${visible ? 'counter-visible' : ''}`}>
        <div className="counter-grid">
          <div className="counter-unit">
            <div className="counter-value">{time.days}</div>
            <div className="counter-label">Days</div>
          </div>
          <div className="counter-sep">:</div>
          <div className="counter-unit">
            <div className="counter-value">{String(time.hours).padStart(2, '0')}</div>
            <div className="counter-label">Hours</div>
          </div>
          <div className="counter-sep">:</div>
          <div className="counter-unit">
            <div className="counter-value">{String(time.minutes).padStart(2, '0')}</div>
            <div className="counter-label">Minutes</div>
          </div>
          <div className="counter-sep">:</div>
          <div className="counter-unit">
            <div className="counter-value">{String(time.seconds).padStart(2, '0')}</div>
            <div className="counter-label">Seconds</div>
          </div>
        </div>

        {milestones.length > 0 && (
          <div className="milestones">
            <h3 style={{ textAlign: 'center', marginBottom: 16, fontFamily: 'Dancing Script', fontSize: '1.3rem' }}>
              Milestones Reached 🏆
            </h3>
            <div className="milestone-list">
              {milestones.slice(0, 5).map((m, i) => (
                <div key={i} className="milestone-item" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="milestone-emoji">{m.emoji}</span>
                  <span className="milestone-day">{m.day} days</span>
                  <span className="milestone-label">— {m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
