import { useState, useEffect, useRef } from 'react'
import { book } from '../data/bookContent.js'

export default function BookReader() {
  const [currentChapter, setCurrentChapter] = useState(0)
  const [showReader, setShowReader] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fontSize, setFontSize] = useState(18)
  const readerRef = useRef(null)
  const contentRef = useRef(null)

  const chapters = book.chapters

  const handleScroll = () => {
    if (!contentRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current
    const p = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100))
    setProgress(p)
  }

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(prev => prev + 1)
      if (contentRef.current) contentRef.current.scrollTop = 0
    }
  }

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1)
      if (contentRef.current) contentRef.current.scrollTop = 0
    }
  }

  return (
    <section id="book" className="section">
      <h2 className="section-title">📖 Our Book</h2>
      <p className="section-subtitle">"The Journey of Us" — written by Abbass for Nagham</p>

      {!showReader ? (
        <div className="book-cover-card card" onClick={() => setShowReader(true)}>
          <div className="book-cover-inner">
            <div className="book-cover-icon">📖</div>
            <h3 className="book-cover-title">{book.title}</h3>
            <p className="book-cover-subtitle">{book.subtitle}</p>
            <p className="book-cover-author">by {book.author}</p>
            <div className="book-cover-decoration">
              <span>🌻</span>
              <span>💕</span>
              <span>🌻</span>
            </div>
            <p className="book-cover-hint">Click to open the book ✨</p>
            <p className="book-cover-dedication">"{book.dedication}"</p>
          </div>
        </div>
      ) : (
        <div className="book-reader-container" ref={readerRef}>
          {/* Progress bar */}
          <div className="book-progress-bar">
            <div className="book-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Reader controls */}
          <div className="book-controls">
            <button className="btn btn-outline" onClick={() => setShowReader(false)}>
              ✕ Close
            </button>
            <div className="book-font-controls">
              <button className="btn btn-outline" onClick={() => setFontSize(s => Math.max(14, s - 1))}>A-</button>
              <span className="book-font-size">{fontSize}px</span>
              <button className="btn btn-outline" onClick={() => setFontSize(s => Math.min(26, s + 1))}>A+</button>
            </div>
            <div className="book-nav">
              <button className="btn btn-outline" onClick={prevChapter} disabled={currentChapter === 0}>
                ← Previous
              </button>
              <span className="book-chapter-indicator">
                {chapters[currentChapter].number === "Acknowledgments" ? "Acknowledgments" :
                 chapters[currentChapter].number === "Epilogue" ? "Epilogue" :
                 chapters[currentChapter].number === "Arabic" ? "Arabic" :
                 `Ch. ${chapters[currentChapter].number}`}
              </span>
              <button className="btn btn-outline" onClick={nextChapter} disabled={currentChapter === chapters.length - 1}>
                Next →
              </button>
            </div>
          </div>

          {/* Chapter content */}
          <div
            className="book-content"
            ref={contentRef}
            onScroll={handleScroll}
            style={{ fontSize: `${fontSize}px` }}
          >
            <div className={`book-chapter ${chapters[currentChapter].isArabic ? 'book-arabic' : ''}`}>
              <h3 className="book-chapter-title">
                {chapters[currentChapter].isArabic ? '📜' : ''} {chapters[currentChapter].title}
              </h3>
              {chapters[currentChapter].date && (
                <p className="book-chapter-date">📅 {chapters[currentChapter].date}</p>
              )}
              <div className="book-chapter-body">
                {chapters[currentChapter].content.map((paragraph, i) => (
                  paragraph === '' ? <br key={i} /> :
                  <p key={i} className="book-paragraph">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter selection */}
          <div className="book-chapters-list">
            <p className="book-chapters-title">📑 Chapters</p>
            <div className="book-chapters-scroll">
              {chapters.map((ch, i) => (
                <button
                  key={i}
                  className={`book-chapter-btn ${currentChapter === i ? 'book-chapter-active' : ''}`}
                  onClick={() => { setCurrentChapter(i); if (contentRef.current) contentRef.current.scrollTop = 0 }}
                >
                  {ch.number === "Acknowledgments" ? "🙏" :
                   ch.number === "Epilogue" ? "💌" :
                   ch.number === "Arabic" ? "📜" :
                   `📖`}
                  <span>{ch.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
