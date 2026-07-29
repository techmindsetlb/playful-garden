import { useState, useEffect, useRef } from 'react'
import { memories } from '../data/memories.js'

export default function MemoriesTimeline() {
  const [activeMemory, setActiveMemory] = useState(null)
  const [visibleMemories, setVisibleMemories] = useState([])
  const itemRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.index)
            setVisibleMemories(prev => [...new Set([...prev, idx])])
          }
        })
      },
      { threshold: 0.2 }
    )

    itemRefs.current.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="memories" className="section">
      <h2 className="section-title">Our Journey 📖</h2>
      <p className="section-subtitle">Every memory, every moment — our love story from the beginning</p>

      <div className="memories-intro card" style={{ maxWidth: 600, margin: '0 auto 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Dancing Script', fontSize: '1.3rem', color: 'var(--accent-pink-dark)', marginBottom: 8 }}>
          From the book "The Journey of Us"
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Every chapter of our story holds a special place in my heart.
          Here are the moments that have shaped us — from that first "Hi" on Muzz
          to building a love that grows stronger every day.
        </p>
      </div>

      <div className="timeline">
        <div className="timeline-line" />
        {memories.map((memory, index) => (
          <div
            key={index}
            className={`timeline-item ${visibleMemories.includes(index) ? 'timeline-visible' : ''}`}
            ref={el => itemRefs.current[index] = el}
            data-index={index}
            onClick={() => setActiveMemory(activeMemory === index ? null : index)}
          >
            <div className="timeline-dot" style={{ background: memory.color }}>
              <span className="timeline-dot-emoji">{memory.emoji}</span>
            </div>
            <div className="timeline-content card" style={{ borderColor: memory.color }}>
              <div className="timeline-header">
                <span className="timeline-date">📅 {memory.date}</span>
                <span className="timeline-emoji">{memory.emoji}</span>
              </div>
              <h3 className="timeline-title">{memory.title}</h3>
              <p className={`timeline-desc ${activeMemory === index ? 'timeline-expanded' : ''}`}>
                {memory.description}
              </p>
              <button className="timeline-read-more">
                {activeMemory === index ? 'Read less ▲' : 'Read more ▼'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating hearts from the book */}
      <div className="memories-footer" style={{ textAlign: 'center', marginTop: 60 }}>
        <p style={{ fontFamily: 'Dancing Script', fontSize: '1.3rem', color: 'var(--text-secondary)' }}>
          "Our love proved to be stronger than everything — always and forever."
        </p>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '0.9rem' }}>
          — From "The Journey of Us"
        </p>
      </div>
    </section>
  )
}
