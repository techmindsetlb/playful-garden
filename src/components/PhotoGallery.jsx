import { useState, useEffect, useRef } from 'react'
import { loadData, saveData } from '../data/appStore.js'

// Default photos from the public folder
const defaultPhotos = [
  { id: 'built-1', src: '/playful-garden/images/WhatsApp%20Image%202026-07-29%20at%208.48.21%20PM.jpg', label: 'A beautiful moment together 🌻', category: 'us' },
  { id: 'built-2', src: '/playful-garden/images/WhatsApp%20Image%202026-07-29%20at%208.48.21%20PM%20(1).jpg', label: 'Our smiles say it all 💕', category: 'us' },
  { id: 'built-3', src: '/playful-garden/images/WhatsApp%20Image%202026-07-29%20at%208.48.21%20PM%20(2).jpg', label: 'Cherished memories 📸', category: 'us' },
  { id: 'built-4', src: '/playful-garden/images/WhatsApp%20Image%202026-07-29%20at%208.48.21%20PM%20(3).jpg', label: 'Love in every glance 💖', category: 'us' },
  { id: 'built-5', src: '/playful-garden/images/WhatsApp%20Image%202026-07-29%20at%208.48.22%20PM.jpg', label: 'Sunflowers and sunshine 🌻', category: 'sunflowers' },
  { id: 'built-6', src: '/playful-garden/images/WhatsApp%20Image%202026-07-29%20at%208.51.14%20PM.jpg', label: 'Cappuccino dates ☕', category: 'dates' },
  { id: 'built-7', src: '/playful-garden/images/WhatsApp%20Image%202026-07-29%20at%208.51.15%20PM.jpg', label: 'Adventures together 🌍', category: 'dates' },
  { id: 'built-8', src: '/playful-garden/images/WhatsApp%20Image%202026-07-29%20at%208.51.16%20PM.jpg', label: 'Our happy place 💕', category: 'us' },
  { id: 'built-9', src: '/playful-garden/images/WhatsApp%20Image%202026-07-29%20at%208.54.13%20PM.jpg', label: 'Date nights ✨', category: 'dates' },
  { id: 'built-10', src: '/playful-garden/images/WhatsApp%20Image%202026-07-29%20at%208.54.13%20PM%20(1).jpg', label: 'Making memories 🥰', category: 'us' },
]

export default function PhotoGallery() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [uploadLabel, setUploadLabel] = useState('')
  const [uploadCategory, setUploadCategory] = useState('us')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const data = loadData()
    if (data.galleryImages) setUploadedPhotos(data.galleryImages)
  }, [])

  const allPhotos = [...defaultPhotos, ...uploadedPhotos]

  const filtered = filter === 'all' ? allPhotos :
    filter === 'uploaded' ? uploadedPhotos :
    allPhotos.filter(p => p.category === filter)

  const compressImage = (file, maxW = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img
          if (width > maxW) {
            height = (height * maxW) / width
            width = maxW
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const compressed = await compressImage(file)
      const newPhoto = {
        id: `upload-${Date.now()}`,
        src: compressed,
        label: uploadLabel.trim() || 'A special moment 📸',
        category: uploadCategory,
        uploaded: true,
        date: new Date().toLocaleDateString(),
      }
      const updated = [newPhoto, ...uploadedPhotos]
      setUploadedPhotos(updated)
      const data = loadData()
      data.galleryImages = updated
      saveData(data)
      setUploadLabel('')
      setShowUpload(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      alert('Failed to upload image. Please try a smaller file.')
    }
  }

  const handleDeleteUploaded = (id) => {
    const updated = uploadedPhotos.filter(p => p.id !== id)
    setUploadedPhotos(updated)
    const data = loadData()
    data.galleryImages = updated
    saveData(data)
  }

  return (
    <section id="gallery" className="section">
      <h2 className="section-title">Our Gallery 📸</h2>
      <p className="section-subtitle">A collection of our favorite moments</p>

      <div className="gallery-filter">
        <button className={`btn ${filter === 'all' ? '' : 'btn-outline'}`} onClick={() => setFilter('all')} style={{ fontSize: '0.85rem', padding: '8px 18px' }}>✨ All</button>
        <button className={`btn ${filter === 'sunflowers' ? '' : 'btn-outline'}`} onClick={() => setFilter('sunflowers')} style={{ fontSize: '0.85rem', padding: '8px 18px' }}>🌻 Sunflowers</button>
        <button className={`btn ${filter === 'dates' ? '' : 'btn-outline'}`} onClick={() => setFilter('dates')} style={{ fontSize: '0.85rem', padding: '8px 18px' }}>☕ Dates</button>
        <button className={`btn ${filter === 'us' ? '' : 'btn-outline'}`} onClick={() => setFilter('us')} style={{ fontSize: '0.85rem', padding: '8px 18px' }}>💕 Us</button>
        <button className={`btn ${filter === 'uploaded' ? '' : 'btn-outline'}`} onClick={() => setFilter('uploaded')} style={{ fontSize: '0.85rem', padding: '8px 18px' }}>📱 Uploaded</button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button className="btn" onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? '✕ Cancel' : '📤 Upload Photo'}
        </button>
      </div>

      {showUpload && (
        <div className="card" style={{ maxWidth: 500, margin: '0 auto 32px' }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--accent-pink)',
                borderRadius: 12,
                padding: 24,
                textAlign: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                transition: 'all 0.3s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(244,143,177,0.08)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              📸 Click to choose an image
            </div>
            <input
              type="text"
              placeholder="Write something special about this photo..."
              value={uploadLabel}
              onChange={e => setUploadLabel(e.target.value)}
              className="note-textarea"
              style={{ minHeight: 'auto', padding: '10px 14px' }}
            />
            <select
              value={uploadCategory}
              onChange={e => setUploadCategory(e.target.value)}
              className="note-textarea"
              style={{ minHeight: 'auto', padding: '10px 14px', cursor: 'pointer' }}
            >
              <option value="us">💕 Us</option>
              <option value="sunflowers">🌻 Sunflowers</option>
              <option value="dates">☕ Dates</option>
            </select>
          </div>
        </div>
      )}

      <div className="gallery-grid">
        {filtered.map((photo, index) => (
          <div
            key={photo.id}
            className="gallery-item"
            style={{ animationDelay: `${index * 0.08}s`, position: 'relative' }}
            onClick={() => setSelected(photo)}
          >
            {photo.uploaded && (
              <button
                className="gallery-delete-upload"
                onClick={(e) => { e.stopPropagation(); handleDeleteUploaded(photo.id) }}
                title="Delete this photo"
              >
                ✕
              </button>
            )}
            <div className="gallery-image">
              <img src={photo.src} alt={photo.label} className="gallery-img" loading="lazy" />
            </div>
            <div className="gallery-label">
              {photo.label}
              {photo.date && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{photo.date}</span>}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="lightbox-overlay" onClick={() => setSelected(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelected(null)}>✕</button>
            <div className="lightbox-image">
              <img src={selected.src} alt={selected.label} className="lightbox-img" />
            </div>
            <h3 className="lightbox-label">{selected.label}</h3>
            {selected.date && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Added: {selected.date}</p>}
          </div>
        </div>
      )}
    </section>
  )
}
