import { useState, useEffect, useRef } from 'react'

export default function Blob({ theme }) {
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [target, setTarget] = useState({ x: 50, y: 50 })
  const [isHappy, setIsHappy] = useState(false)
  const [expression, setExpression] = useState('😊')
  const [bounce, setBounce] = useState(false)
  const blobRef = useRef(null)
  const animFrame = useRef(null)
  const currentPos = useRef({ x: 50, y: 50 })
  const currentScale = useRef(1)

  const expressions = {
    happy: ['😊', '🥰', '😍', '💖', '🌟', '☺️'],
    funny: ['😜', '🤪', '😏', '😂', '👀', '🤭'],
    sleepy: ['😴', '🥱', '😪', '💤'],
    excited: ['🤩', '🎉', '✨', '😆', '🥳'],
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setTarget({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const getRandomExpression = (category) => {
    const arr = expressions[category] || expressions.happy
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const animate = () => {
    const dx = target.x - currentPos.current.x
    const dy = target.y - currentPos.current.y
    currentPos.current.x += dx * 0.05
    currentPos.current.y += dy * 0.05
    setPos({ x: currentPos.current.x, y: currentPos.current.y })
    animFrame.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    animFrame.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame.current)
  }, [])

  const handleClick = () => {
    setBounce(true)
    setIsHappy(true)
    setExpression(getRandomExpression('happy'))
    setTimeout(() => {
      setExpression(getRandomExpression('happy'))
      setTimeout(() => {
        setIsHappy(false)
        setBounce(false)
        setExpression('😊')
      }, 1500)
    }, 800)
  }

  const handleMouseEnter = () => {
    setExpression(getRandomExpression('excited'))
  }

  const handleMouseLeave = () => {
    if (!isHappy) setExpression('😊')
  }

  const squishX = 40 + (50 - pos.x) * 0.2
  const squishY = 60 - (50 - pos.y) * 0.15

  return (
    <section id="blob" className="section">
      <h2 className="section-title">Meet Blobby 💜</h2>
      <p className="section-subtitle">Your squishy little buddy — click me!</p>

      <div className="blob-container">
        <div
          ref={blobRef}
          className={`blob-body ${bounce ? 'blob-bounce' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
          }}
        >
          <svg viewBox="0 0 200 200" className="blob-svg">
            <defs>
              <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: theme === 'dark' ? '#f06292' : '#f48fb1' }} />
                <stop offset="50%" style={{ stopColor: theme === 'dark' ? '#ffd54f' : '#ffd54f' }} />
                <stop offset="100%" style={{ stopColor: theme === 'dark' ? '#ff8f00' : '#ffb300' }} />
              </linearGradient>
            </defs>
            <path fill="url(#blobGrad)">
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values={`
                  M92.5,-56.2C110.7,-38.4,110.6,-8.4,100.6,15.8C90.6,40,70.6,58.4,48.2,67.2C25.8,76,1,75.2,-20.6,65.6C-42.2,56,-60.6,37.6,-70.2,14.8C-79.8,-8,-80.6,-35.2,-65.4,-52.6C-50.2,-70,-19,-77.4,8.4,-77.2C35.8,-77,74.3,-74,92.5,-56.2Z;
                  M100.1,-60.2C118.5,-42.6,118.4,-12.4,107.2,12.6C96,37.6,73.6,57.4,48.6,65.8C23.6,74.2,-4,71.2,-28.6,60.2C-53.2,49.2,-74.8,30.2,-81.6,6.6C-88.4,-17,-80.4,-45.4,-60.2,-62.2C-40,-79,-7.8,-84.2,21.4,-81.8C50.6,-79.4,81.7,-77.8,100.1,-60.2Z;
                  M85.5,-52.8C103.2,-35.2,100.4,-8.8,91.2,14C82,36.8,66.4,56,46.2,64.2C26,72.4,1.2,69.6,-20.8,59.6C-42.8,49.6,-62,32.4,-70,11.2C-78,-10,-74.8,-35.2,-59.6,-52C-44.4,-68.8,-17.2,-77.2,8.8,-78.8C34.8,-80.4,67.8,-70.4,85.5,-52.8Z;
                  M92.5,-56.2C110.7,-38.4,110.6,-8.4,100.6,15.8C90.6,40,70.6,58.4,48.2,67.2C25.8,76,1,75.2,-20.6,65.6C-42.2,56,-60.6,37.6,-70.2,14.8C-79.8,-8,-80.6,-35.2,-65.4,-52.6C-50.2,-70,-19,-77.4,8.4,-77.2C35.8,-77,74.3,-74,92.5,-56.2Z
                `}
              />
            </path>
          </svg>
          <div className="blob-face">
            <span className="blob-expression">{expression}</span>
          </div>
          {isHappy && (
            <div className="blob-hearts">
              <span className="blob-heart" style={{ animationDelay: '0s' }}>💕</span>
              <span className="blob-heart" style={{ animationDelay: '0.2s' }}>✨</span>
              <span className="blob-heart" style={{ animationDelay: '0.4s' }}>💖</span>
            </div>
          )}
        </div>
      </div>

      <div className="blob-status">
        <span className="blob-status-icon">{expression}</span>
        <span className="blob-status-text">
          {isHappy ? '*blushes* hehe 🥰' : 'Click me for love! 💕'}
        </span>
      </div>
    </section>
  )
}
