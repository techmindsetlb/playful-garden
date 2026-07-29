import { useState, useEffect } from 'react'

export default function Landing({ onStart }) {
  const [visible, setVisible] = useState(false)
  const [letterRevealed, setLetterRevealed] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showCTA, setShowCTA] = useState(false)

  useEffect(() => {
    setVisible(true)
    setTimeout(() => setShowTitle(true), 500)
    setTimeout(() => setShowCTA(true), 1200)
  }, [])

  const sunflowerCount = 9
  const sunflowers = Array.from({ length: sunflowerCount }, (_, i) => ({
    id: i,
    left: (i / (sunflowerCount - 1)) * 90 + 5,
    delay: i * 0.3,
    size: 28 + Math.random() * 24,
    rotation: Math.random() * 60 - 30,
    floatDelay: Math.random() * 3,
  }))

  return (
    <section className={`landing ${visible ? 'landing-visible' : ''}`}>
      {/* Background sunflowers */}
      <div className="landing-sunflowers">
        {sunflowers.map(s => (
          <span
            key={s.id}
            className="landing-sunflower"
            style={{
              left: `${s.left}%`,
              fontSize: `${s.size}px`,
              animationDelay: `${s.floatDelay}s`,
              transform: `rotate(${s.rotation}deg)`,
            }}
          >
            🌻
          </span>
        ))}
      </div>

      {/* Floating hearts */}
      <div className="landing-hearts">
        {['💕', '✨', '💖', '🌻', '☕'].map((e, i) => (
          <span
            key={i}
            className="landing-heart"
            style={{
              left: `${15 + i * 18}%`,
              animationDelay: `${i * 0.7}s`,
              fontSize: `${18 + Math.random() * 14}px`,
            }}
          >
            {e}
          </span>
        ))}
      </div>

      <div className="landing-content">
        <div className={`landing-badge ${showTitle ? 'landing-badge-visible' : ''}`}>
          <span>🌻 Made with love 🌻</span>
        </div>

        <h1 className={`landing-title ${showTitle ? 'title-visible' : ''}`}>
          <span className="title-line">Welcome to</span>
          <span className="title-name">Nagham's Garden</span>
          <span className="title-line title-sub">A little corner of the internet, just for you 💕</span>
        </h1>

        <div className={`landing-letter ${letterRevealed ? 'letter-visible' : ''}`}>
          <button className="btn btn-letter" onClick={() => setLetterRevealed(!letterRevealed)}>
            {letterRevealed ? '📬 Hide letter' : '💌 Open your letter'}
          </button>
          {letterRevealed && (
            <div className="letter-content card">
              <p className="letter-greeting">My Dearest Nagham,</p>
              <p className="letter-body">
                I made this little place for you — a garden of all the things that remind me of you.
                Sunflowers because you light up my world. Cappuccino because you're warm and sweet.
                And all these little playful things because being with you is always an adventure.
              </p>
              <p className="letter-body">
                Every time you smile, a sunflower blooms somewhere. Every time you laugh,
                my world gets a little brighter. You're my favorite person, my best friend,
                and the love of my life.
              </p>
              <p className="letter-closing">
                This is just the beginning. There's so much more love to come.
              </p>
              <p className="letter-signoff">Forever yours, 💕</p>
            </div>
          )}
        </div>

        <div className={`landing-cta ${showCTA ? 'cta-visible' : ''}`}>
          <button className="btn btn-enter" onClick={onStart}>
            Enter the Garden 🌻
          </button>
        </div>
      </div>
    </section>
  )
}
