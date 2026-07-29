import { useState, useRef, useEffect } from 'react'

export default function PinLock({ onUnlock }) {
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputs = useRef([])

  const CORRECT_PIN = ['2', '0', '0', '2']

  const handleChange = (index, value) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)
    setError(false)

    if (value && index < 3) {
      inputs.current[index + 1]?.focus()
    }

    // Auto-check when all 4 digits entered
    if (newPin.every(d => d !== '')) {
      if (newPin.join('') === CORRECT_PIN.join('')) {
        setTimeout(() => onUnlock(), 300)
      } else {
        setError(true)
        setShake(true)
        setTimeout(() => {
          setShake(false)
          setPin(['', '', '', ''])
          inputs.current[0]?.focus()
        }, 600)
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  return (
    <div className="pinlock-overlay">
      <div className={`pinlock-card card ${shake ? 'pinlock-shake' : ''}`}>
        <div className="pinlock-icon">🔐</div>
        <h2 className="pinlock-title">Welcome to Nagham's Garden</h2>
        <p className="pinlock-subtitle">Enter the secret code to enter 💕</p>

        <div className="pinlock-inputs">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`pinlock-input ${error ? 'pinlock-error' : ''}`}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="pinlock-error-text">💔 Wrong code... try again!</p>
        )}

        <div className="pinlock-hint">
          <span>🌻</span>
          <span>💕</span>
          <span>🌻</span>
        </div>
      </div>
    </div>
  )
}
