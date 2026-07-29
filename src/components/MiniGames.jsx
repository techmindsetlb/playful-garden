import { useState, useEffect, useRef, useCallback } from 'react'

// Heart Catcher Game
function HeartCatcher() {
  const [hearts, setHearts] = useState([])
  const [score, setScore] = useState(0)
  const [missed, setMissed] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [basketX, setBasketX] = useState(50)
  const basketXRef = useRef(50)
  const maxMissed = 5

  const spawnHeart = useCallback(() => {
    setHearts(prev => {
      if (prev.length > 30) return prev // cap hearts on screen
      const x = Math.random() * 80 + 5
      const emojis = ['💕', '❤️', '💖', '💗', '💓', '🌻', '✨']
      return [...prev, {
        id: Date.now() + Math.random(),
        x,
        y: -5,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        speed: 1 + Math.random() * 1.5,
      }]
    })
  }, [])

  // Spawn hearts
  useEffect(() => {
    if (!gameStarted || gameOver) return
    const interval = setInterval(spawnHeart, Math.max(350, 1200 - score * 30))
    return () => clearInterval(interval)
  }, [gameStarted, gameOver, spawnHeart, score])

  // Game loop: move hearts, check collisions and misses
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const gameLoop = setInterval(() => {
      let missedCount = 0

      setHearts(prev => {
        // Move hearts down
        let updated = prev.map(h => ({
          ...h,
          y: h.y + h.speed * 1.5,
        }))

        // Check misses (hit the ground)
        const missedHearts = updated.filter(h => h.y > 94)
        missedCount = missedHearts.length

        // Check catches (collision with basket)
        updated = updated.filter(h => {
          if (h.y > 80 && h.y < 95) {
            const dist = Math.abs(h.x - basketXRef.current)
            if (dist < 12) {
              return false // caught!
            }
          }
          return true
        }).filter(h => h.y <= 94) // remove missed hearts

        return updated
      })

      // Update score and misses
      if (missedCount > 0) {
        setMissed(m => {
          const newMissed = m + missedCount
          if (newMissed >= maxMissed) {
            setGameOver(true)
          }
          return newMissed
        })
      }

    }, 50)

    return () => clearInterval(gameLoop)
  }, [gameStarted, gameOver])

  // Track basket position with mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = document.querySelector('.game-playfield')?.getBoundingClientRect()
      if (!rect) return
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const clampedX = Math.max(5, Math.min(85, x))
      basketXRef.current = clampedX
      setBasketX(clampedX)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const startGame = () => {
    setScore(0)
    setMissed(0)
    setGameOver(false)
    setHearts([])
    setGameStarted(true)
  }

  return (
    <div className="game-card card">
      <h3 style={{ textAlign: 'center', marginBottom: 12, fontFamily: 'Dancing Script', fontSize: '1.5rem' }}>
        💕 Catch the Hearts! 💕
      </h3>

      {!gameStarted ? (
        <div className="game-start">
          <p className="game-desc">Move your mouse to catch falling hearts before they hit the ground! 🌟</p>
          <button className="btn" onClick={startGame}>🎮 Play!</button>
        </div>
      ) : gameOver ? (
        <div className="game-over">
          <p className="game-score-final">Score: {score} 💕</p>
          <p className="game-congrats">
            {score > 20 ? "Amazing! You're a heart-catching pro! 🏆" :
             score > 10 ? 'Great job! Love is in the air! 🌟' :
             'Good try! Want to play again? 💪'}
          </p>
          <div className="game-emoji-burst">
            {['🎉', '💕', '✨', '🥳', '💖'].map((e, i) => (
              <span key={i} className="burst-emoji" style={{ animationDelay: `${i * 0.15}s` }}>{e}</span>
            ))}
          </div>
          <button className="btn" onClick={startGame}>🔄 Play Again</button>
        </div>
      ) : (
        <div className="game-area">
          <div className="game-hud">
            <span>Score: {score} 💕</span>
            <span>Missed: {missed}/{maxMissed} ❌</span>
          </div>
          <div className="game-playfield">
            {hearts.map(heart => (
              <div
                key={heart.id}
                className="game-heart"
                style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
              >
                {heart.emoji}
              </div>
            ))}
            <div className="game-basket" style={{ left: `${basketX}%` }}>
              🧺
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Fun quiz
function FunQuiz() {
  const questions = [
    { q: "What's Nagham's favorite drink?", a: "Cappuccino ☕", options: ["Cappuccino ☕", "Tea 🍵", "Soda 🥤", "Water 💧"] },
    { q: "What flower reminds you of Nagham?", a: "Sunflower 🌻", options: ["Sunflower 🌻", "Rose 🌹", "Tulip 🌷", "Lily 🪷"] },
    { q: "Nagham's laugh is...", a: "The cutest sound ever 🥰", options: ["The cutest sound ever 🥰", "Okay I guess 😅", "Loud 😆", "Silent 🤫"] },
  ]
  const [currentQ, setCurrentQ] = useState(0)
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="game-card card">
      <h3 style={{ textAlign: 'center', marginBottom: 12, fontFamily: 'Dancing Script', fontSize: '1.5rem' }}>
        🤔 How Well Do You Know Nagham?
      </h3>
      <div className="quiz-question">
        <p className="quiz-q">{questions[currentQ].q}</p>
        <div className="quiz-options">
          {questions[currentQ].options.map((opt, i) => (
            <button
              key={i}
              className={`btn btn-outline quiz-option ${revealed && opt === questions[currentQ].a ? 'quiz-correct' : ''}`}
              onClick={() => setRevealed(true)}
              disabled={revealed}
            >
              {opt}
            </button>
          ))}
        </div>
        {revealed && (
          <div className="quiz-result">
            <p className="quiz-answer">Answer: {questions[currentQ].a}</p>
            <button
              className="btn"
              onClick={() => {
                setCurrentQ((currentQ + 1) % questions.length)
                setRevealed(false)
              }}
            >
              {currentQ < questions.length - 1 ? 'Next ➡️' : '🔄 Start Over'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MiniGames() {
  const [activeGame, setActiveGame] = useState('catcher')

  return (
    <section id="games" className="section">
      <h2 className="section-title">Fun & Games 🎮</h2>
      <p className="section-subtitle">Play and have fun together!</p>

      <div className="game-tabs">
        <button
          className={`btn ${activeGame === 'catcher' ? '' : 'btn-outline'}`}
          onClick={() => setActiveGame('catcher')}
          style={{ fontSize: '0.85rem', padding: '8px 18px' }}
        >
          💕 Heart Catcher
        </button>
        <button
          className={`btn ${activeGame === 'quiz' ? '' : 'btn-outline'}`}
          onClick={() => setActiveGame('quiz')}
          style={{ fontSize: '0.85rem', padding: '8px 18px' }}
        >
          🤔 Nagham Quiz
        </button>
      </div>

      <div className="game-content" style={{ maxWidth: 500, margin: '0 auto' }}>
        {activeGame === 'catcher' ? <HeartCatcher /> : <FunQuiz />}
      </div>
    </section>
  )
}
