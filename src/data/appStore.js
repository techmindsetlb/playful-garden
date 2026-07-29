import SyncAPI from './syncAPI.js'
import SYNC_CONFIG from './syncConfig.js'

const STORAGE_KEY = SYNC_CONFIG.cacheKey || 'naghams-garden-data'
const LAST_SYNC_KEY = SYNC_CONFIG.lastSyncKey || 'naghams-garden-last-sync'

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
  customQA: [],
  lastUpdated: null,
}

let syncInProgress = false

/**
 * Detect if a string has corrupted UTF-8/emoji encoding
 * (e.g., garbled multi-byte chars from buggy atob decoding)
 */
function hasCorruptedEncoding(text) {
  if (typeof text !== 'string') return false
  // Check for the Unicode replacement character (appears when UTF-8 decoding fails)
  if (text.includes('\uFFFD')) return true
  // Check for consecutive garbled multi-byte sequences common in Latin-1→UTF-8 corruption
  // Corrupted emojis show as 3+ consecutive high bytes like: ðŸŒ» (corrupted 🌻)
  if (/[\x80-\xBF]{4,}/.test(text)) return true
  return false
}

/**
 * Check if an array of items has corrupted emoji content
 */
function hasCorruptedItems(items, textFields) {
  if (!items?.length) return false
  return items.some(item =>
    textFields.some(field => hasCorruptedEncoding(item[field]))
  )
}

/**
 * Load data from localStorage (fast cache), then try to sync from GitHub
 */
export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Detect corrupted emojis and fall back to clean defaults
      const cleanLoveNotes = (parsed.loveNotes?.length && !hasCorruptedItems(parsed.loveNotes, ['text']))
        ? parsed.loveNotes : defaultData.loveNotes
      const cleanQA = (parsed.qaQuestions?.length && !hasCorruptedItems(parsed.qaQuestions, ['q', 'a']))
        ? parsed.qaQuestions : defaultData.qaQuestions
      return {
        ...defaultData,
        ...parsed,
        loveNotes: cleanLoveNotes,
        qaQuestions: cleanQA,
        customQA: parsed.customQA?.length ? parsed.customQA : defaultData.customQA,
        galleryImages: parsed.galleryImages?.length ? parsed.galleryImages : defaultData.galleryImages,
        complaints: parsed.complaints?.length ? parsed.complaints : defaultData.complaints,
        submittedCompliments: parsed.submittedCompliments?.length ? parsed.submittedCompliments : defaultData.submittedCompliments,
      }
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e)
  }
  return structuredClone(defaultData)
}

/**
 * Save to localStorage immediately + sync to GitHub in background
 */
export function saveData(data) {
  data.lastUpdated = new Date().toISOString()
  let localOk = false
  // Save to localStorage immediately
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    localOk = true
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
  // Sync to GitHub in background (non-blocking)
  if (SYNC_CONFIG.workerUrl && !syncInProgress) {
    syncInProgress = true
    SyncAPI.saveData(data)
      .then((ok) => {
        if (ok) {
          localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
        }
      })
      .catch(() => {})
      .finally(() => {
        syncInProgress = false
      })
  }
  return localOk
}

/**
 * Force sync from GitHub (overwrites local data with remote)
 */
export async function syncFromGitHub() {
  if (!SYNC_CONFIG.workerUrl) {
    return { ok: false, message: 'No Worker URL configured' }
  }
  try {
    const remote = await SyncAPI.getData()
    if (remote) {
      // Detect corrupted emojis from sync and fall back to clean defaults
      const cleanLoveNotes = (remote.loveNotes?.length && !hasCorruptedItems(remote.loveNotes, ['text']))
        ? remote.loveNotes : defaultData.loveNotes
      const cleanQA = (remote.qaQuestions?.length && !hasCorruptedItems(remote.qaQuestions, ['q', 'a']))
        ? remote.qaQuestions : defaultData.qaQuestions
      const merged = {
        ...defaultData,
        ...remote,
        loveNotes: cleanLoveNotes,
        qaQuestions: cleanQA,
        customQA: remote.customQA?.length ? remote.customQA : defaultData.customQA,
        galleryImages: remote.galleryImages?.length ? remote.galleryImages : defaultData.galleryImages,
        complaints: remote.complaints?.length ? remote.complaints : defaultData.complaints,
        submittedCompliments: remote.submittedCompliments?.length ? remote.submittedCompliments : defaultData.submittedCompliments,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
      return { ok: true, data: merged }
    }
    // No remote data exists yet — push local data to GitHub
    const local = loadData()
    const pushed = await SyncAPI.saveData(local)
    if (pushed) {
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
    }
    return { ok: pushed, data: local }
  } catch (err) {
    console.error('Sync from GitHub failed:', err)
    return { ok: false, message: err.message }
  }
}

/**
 * Push local data to GitHub
 */
export async function pushToGitHub() {
  if (!SYNC_CONFIG.workerUrl) {
    return { ok: false, message: 'No Worker URL configured' }
  }
  try {
    const local = loadData()
    const ok = await SyncAPI.saveData(local)
    if (ok) {
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
    }
    return { ok, message: ok ? 'Synced!' : 'Sync failed' }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

/**
 * Check if Worker is configured
 */
export function isSyncConfigured() {
  return !!SYNC_CONFIG.workerUrl
}

/**
 * Get last sync time
 */
export function getLastSyncTime() {
  return localStorage.getItem(LAST_SYNC_KEY)
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
