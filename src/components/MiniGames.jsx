import { useState } from 'react'
import { loadData } from '../data/appStore.js'

// Fun quiz with unlimited questions — users can add their own!
function QAGame() {
  const initialData = loadData()
  const [customQuestions, setCustomQuestions] = useState(initialData.customQA || [])
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const allQuestions = [...initialData.qaQuestions, ...customQuestions]
  const [currentQ, setCurrentQ] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [shown, setShown] = useState([])
  const [gameOver, setGameOver] = useState(false)

  const getNewQuestion = () => {
    const available = allQuestions.filter((_, i) => !shown.includes(i))
    if (available.length === 0) {
      setGameOver(true)
      return
    }
    const randomIdx = Math.floor(Math.random() * available.length)
    let count = -1
    for (let i = 0; i < allQuestions.length; i++) {
      if (!shown.includes(i)) count++
      if (count === randomIdx) {
        setCurrentQ({ ...allQuestions[i], index: i })
        setShown(prev => [...prev, i])
        break
      }
    }
    setRevealed(false)
  }

  const addCustomQuestion = () => {
    if (!newQ.trim() || !newA.trim()) return
    const question = { q: newQ.trim(), a: newA.trim() }
    setCustomQuestions(prev => {
      const updated = [...prev, question]
      const data = loadData()
      data.customQA = updated
      saveData(data)
      return updated
    })
    setNewQ('')
    setNewA('')
    setShowAddForm(false)
  }

  const startGame = () => {
    setScore(0)
    setShown([])
    setGameOver(false)
    setRevealed(false)
    setCurrentQ(null)
    setTimeout(() => getNewQuestion(), 100)
  }

  const handleReveal = () => {
    setRevealed(true)
    setScore(s => s + 1)
  }

  return (
    <div className="game-card card">
      <h3 style={{ textAlign: 'center', marginBottom: 12, fontFamily: 'Dancing Script', fontSize: '1.5rem' }}>
        🤔 Infinite Q&A Challenge
      </h3>

      {!currentQ && !gameOver ? (
        <div className="game-start">
          <p className="game-desc">Test your knowledge of our beautiful love story! Answer as many questions as you can! 🏆</p>
          <button className="btn" onClick={startGame}>🎮 Start Playing!</button>
        </div>
      ) : gameOver ? (
        <div className="game-over">
          <p className="game-score-final">🎉 You answered all {score} questions!</p>
          <p className="game-congrats">
            {score === allQuestions.length ? "Perfect score! You know everything about us! 🏆💕" :
             score > allQuestions.length / 2 ? "Great job! Our love story is forever! 🌟" :
             "Good start! Want to play again? 💪"}
          </p>
          <div className="game-emoji-burst">
            {['🎉', '💕', '✨', '🥳', '💖'].map((e, i) => (
              <span key={i} className="burst-emoji" style={{ animationDelay: `${i * 0.15}s` }}>{e}</span>
            ))}
          </div>
          <button className="btn" onClick={startGame}>🔄 Play Again</button>
        </div>
      ) : (
        <div className="quiz-question">
          <p className="quiz-q">{currentQ.q}</p>
          {!revealed ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="btn" onClick={handleReveal}>
                👀 Reveal Answer
              </button>
            </div>
          ) : (
            <div className="quiz-result">
              <p className="quiz-answer">{currentQ.a}</p>
              <button className="btn" onClick={getNewQuestion}>
                {shown.length < allQuestions.length ? 'Next ➡️' : '🏁 See Results'}
              </button>
            </div>
          )}
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Question {shown.length} of {allQuestions.length} • Score: {score}
          </p>
        </div>
      )}

      {/* Add your own Q&A */}
      <div style={{ marginTop: 20, borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
        <button className="btn btn-outline" onClick={() => setShowAddForm(!showAddForm)} style={{ fontSize: '0.8rem' }}>
          {showAddForm ? '✕ Cancel' : '✍️ Add your own Q&A'}
        </button>
        {showAddForm && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="text"
              placeholder="Your question..."
              value={newQ}
              onChange={e => setNewQ(e.target.value)}
              className="note-textarea"
              style={{ minHeight: 'auto', padding: '10px 14px' }}
            />
            <input
              type="text"
              placeholder="The answer..."
              value={newA}
              onChange={e => setNewA(e.target.value)}
              className="note-textarea"
              style={{ minHeight: 'auto', padding: '10px 14px' }}
              onKeyDown={e => e.key === 'Enter' && addCustomQuestion()}
            />
            <button className="btn" onClick={addCustomQuestion} disabled={!newQ.trim() || !newA.trim()}>
              ➕ Add to Game
            </button>
          </div>
        )}
        {customQuestions.length > 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
            ✨ {customQuestions.length} custom question{customQuestions.length > 1 ? 's' : ''} added!
          </p>
        )}
      </div>
    </div>
  )
}

// Claw machine from FeralUI
function ClawMachine({ onToggle }) {
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [verified, setVerified] = useState(false)

  // Dynamic import to avoid issues if assets aren't ready
  const [ClawCaptcha, setClawCaptcha] = useState(null)
  const [loadError, setLoadError] = useState(false)

  const loadCaptcha = async () => {
    try {
      const mod = await import('playcaptcha')
      setClawCaptcha(() => mod.ClawCaptcha)
      setShowCaptcha(true)
    } catch (e) {
      setLoadError(true)
    }
  }

  if (loadError) return null

  return (
    <div className="game-card card">
      <h3 style={{ textAlign: 'center', marginBottom: 12, fontFamily: 'Dancing Script', fontSize: '1.5rem' }}>
        🎮 Claw Machine Challenge!
      </h3>

      {!showCaptcha ? (
        <div className="game-start">
          <p className="game-desc">
            {verified
              ? "You already proved your love! 🏆💕"
              : "Catch the right toy to prove your love! Use arrow keys or joystick to move the claw 🦀"}
          </p>
          {!verified && (
            <button className="btn" onClick={loadCaptcha}>
              🦀 Play Claw Machine!
            </button>
          )}
        </div>
      ) : ClawCaptcha ? (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <ClawCaptcha
            onVerify={() => {
              setVerified(true)
              setShowCaptcha(false)
            }}
            title="🎯 Grab the right toy for Nagham!"
          />
        </div>
      ) : null}
    </div>
  )
}

export default function MiniGames() {
  const [activeGame, setActiveGame] = useState('qa')

  return (
    <section id="games" className="section">
      <h2 className="section-title">Fun & Games 🎮</h2>
      <p className="section-subtitle">Play and have fun together!</p>

      <div className="game-tabs">
        <button
          className={`btn ${activeGame === 'qa' ? '' : 'btn-outline'}`}
          onClick={() => setActiveGame('qa')}
          style={{ fontSize: '0.85rem', padding: '8px 18px' }}
        >
          ❓ Q&A Challenge
        </button>
        <button
          className={`btn ${activeGame === 'claw' ? '' : 'btn-outline'}`}
          onClick={() => setActiveGame('claw')}
          style={{ fontSize: '0.85rem', padding: '8px 18px' }}
        >
          🦀 Claw Machine
        </button>
      </div>

      <div className="game-content" style={{ maxWidth: 500, margin: '0 auto' }}>
        {activeGame === 'qa' ? <QAGame /> : <ClawMachine />}
      </div>
    </section>
  )
}
