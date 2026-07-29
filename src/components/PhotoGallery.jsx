import { useState } from 'react'

// Images from the images folder — using relative paths from public directory
const photos = [
  { id: 1, src: '/playful-garden/images/WhatsApp Image 2026-07-29 at 8.48.21 PM.jpeg', label: 'A beautiful moment together 🌻', category: 'us' },
  { id: 2, src: '/playful-garden/images/WhatsApp Image 2026-07-29 at 8.48.21 PM (1).jpeg', label: 'Our smiles say it all 💕', category: 'us' },
  { id: 3, src: '/playful-garden/images/WhatsApp Image 2026-07-29 at 8.48.21 PM (2).jpeg', label: 'Cherished memories 📸', category: 'us' },
  { id: 4, src: '/playful-garden/images/WhatsApp Image 2026-07-29 at 8.48.21 PM (3).jpeg', label: 'Love in every glance 💖', category: 'us' },
  { id: 5, src: '/playful-garden/images/WhatsApp Image 2026-07-29 at 8.48.22 PM.jpeg', label: 'Sunflowers and sunshine 🌻', category: 'sunflowers' },
  { id: 6, src: '/playful-garden/images/WhatsApp Image 2026-07-29 at 8.51.14 PM.jpeg', label: 'Cappuccino dates ☕', category: 'dates' },
  { id: 7, src: '/playful-garden/images/WhatsApp Image 2026-07-29 at 8.51.15 PM.jpeg', label: 'Adventures together 🌍', category: 'dates' },
  { id: 8, src: '/playful-garden/images/WhatsApp Image 2026-07-29 at 8.51.16 PM.jpeg', label: 'Our happy place 💕', category: 'us' },
  { id: 9, src: '/playful-garden/images/WhatsApp Image 2026-07-29 at 8.54.13 PM.jpeg', label: 'Date nights ✨', category: 'dates' },
  { id: 10, src: '/playful-garden/images/WhatsApp Image 2026-07-29 at 8.54.13 PM (1).jpeg', label: 'Making memories 🥰', category: 'us' },
]

export default function PhotoGallery() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter)

  return (
    <section id="gallery" className="section">
      <h2 className="section-title">Our Gallery 📸</h2>
      <p className="section-subtitle">A collection of our favorite moments</p>

      <div className="gallery-filter">
        <button
          className={`btn ${filter === 'all' ? '' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
          style={{ fontSize: '0.85rem', padding: '8px 18px' }}
        >
          ✨ All
        </button>
        <button
          className={`btn ${filter === 'sunflowers' ? '' : 'btn-outline'}`}
          onClick={() => setFilter('sunflowers')}
          style={{ fontSize: '0.85rem', padding: '8px 18px' }}
        >
          🌻 Sunflowers
        </button>
        <button
          className={`btn ${filter === 'dates' ? '' : 'btn-outline'}`}
          onClick={() => setFilter('dates')}
          style={{ fontSize: '0.85rem', padding: '8px 18px' }}
        >
          ☕ Dates
        </button>
        <button
          className={`btn ${filter === 'us' ? '' : 'btn-outline'}`}
          onClick={() => setFilter('us')}
          style={{ fontSize: '0.85rem', padding: '8px 18px' }}
        >
          💕 Us
        </button>
      </div>

      <div className="gallery-grid">
        {filtered.map((photo, index) => (
          <div
            key={photo.id}
            className="gallery-item"
            style={{ animationDelay: `${index * 0.08}s` }}
            onClick={() => setSelected(photo)}
          >
            <div className="gallery-image">
              <img src={photo.src} alt={photo.label} className="gallery-img" loading="lazy" />
            </div>
            <div className="gallery-label">{photo.label}</div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="lightbox-overlay" onClick={() => setSelected(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelected(null)}>✕</button>
            <div className="lightbox-image">
              <img src={selected.src} alt={selected.label} className="lightbox-img" />
            </div>
            <h3 className="lightbox-label">{selected.label}</h3>
          </div>
        </div>
      )}
    </section>
  )
}
