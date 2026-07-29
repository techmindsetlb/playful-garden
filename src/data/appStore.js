const STORAGE_KEY = 'naghams-garden-data'

const defaultData = {
  loveNotes: [
    { id: 1, text: "Nagham, you make every day feel like a sunflower bloom 🌻", color: '#fff8e1' },
    { id: 2, text: "I love our cappuccino dates more than words can say ☕💕", color: '#fce4ec' },
    { id: 3, text: "You're the most beautiful person inside and out ✨", color: '#e8f5e9' },
    { id: 4, text: "Every moment with you is a treasure 💎", color: '#fff3e0' },
    { id: 5, text: "Your smile lights up my whole world 😊🌟", color: '#f3e5f5' },
  ],
  complaints: [],
  submittedCompliments: [],
  galleryImages: [],
  qaQuestions: [
    { q: "What's Nagham's favorite drink?", a: "Cappuccino ☕" },
    { q: "What flower reminds you of Nagham?", a: "Sunflower 🌻" },
    { q: "What's the best thing about Nagham?", a: "Everything! 💕" },
    { q: "Where was your first date?", a: "Donia Café 🌻" },
    { q: "What's Nagham's business called?", a: "Ehsas 🕯️" },
    { q: "What did Nagham call Abbass by mistake?", a: "Ahmad 😂" },
    { q: "What film did you watch together on Discord?", a: "Elemental 🔥💧" },
    { q: "What color did Abbass wear on the first date?", a: "Yellow 💛" },
    { q: "What date did you get engaged?", a: "August 23, 2025 💍" },
    { q: "What's the motorcycle model Abbass bought?", a: "Haojue Lindy 125cc 🏍️" },
    { q: "Where is your favorite restaurant?", a: "Al Jawad 🍽️" },
    { q: "What did Nagham write for Abbass's birthday?", a: "A whole book! 'After the Rain Sunshine' 📖" },
  ],
  customQA: []
}

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultData, ...parsed, loveNotes: parsed.loveNotes || defaultData.loveNotes }
    }
  } catch (e) { console.warn('Failed to load data:', e) }
  return { ...defaultData, loveNotes: [...defaultData.loveNotes] }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (e) {
    console.error('Failed to save data:', e)
    return false
  }
}

export function exportToJSON() {
  const data = loadData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `naghams-garden-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        saveData(data)
        resolve(data)
      } catch (err) {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
