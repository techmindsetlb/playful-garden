/**
 * GitHub API wrapper for Nagham's Garden
 * Reads and writes data via GitHub Contents API through Cloudflare Worker proxy.
 * Based on the same pattern used in ehsas-inventory.
 */

import SYNC_CONFIG from './syncConfig.js'

const SyncAPI = {
  /**
   * Get the API base URL
   */
  apiUrl(path) {
    if (SYNC_CONFIG.workerUrl) {
      return `${SYNC_CONFIG.workerUrl}/${path}`
    }
    return `https://api.github.com/repos/${SYNC_CONFIG.owner}/${SYNC_CONFIG.repo}/contents/${path}`
  },

  /**
   * Get auth headers
   */
  getHeaders() {
    // If using Worker proxy, no auth header needed (token is in Worker secret)
    if (SYNC_CONFIG.workerUrl) {
      return { 'Content-Type': 'application/json' }
    }
    // Direct GitHub API — would require token in config (not recommended)
    return {
      'Authorization': `token ${SYNC_CONFIG.token || ''}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }
  },

  /**
   * Fetch data from GitHub via the Worker proxy
   */
  async getData() {
    if (!SYNC_CONFIG.workerUrl) {
      // No Worker configured — return null (fallback to localStorage)
      return null
    }

    try {
      const res = await fetch(this.apiUrl(SYNC_CONFIG.dataPath), {
        headers: this.getHeaders(),
      })

      if (!res.ok) {
        if (res.status === 404) return null
        console.warn('SyncAPI getData error:', res.status)
        return null
      }

      const body = await res.json()
      // atob decodes to Latin-1, but our content is UTF-8 (emojis!)
      // Use decodeURIComponent + escape to properly convert Latin-1 → UTF-8
      const binary = atob(body.content.replace(/\n/g, ''))
      const decoded = decodeURIComponent(escape(binary))
      return JSON.parse(decoded)
    } catch (err) {
      console.warn('SyncAPI.getData failed:', err)
      return null
    }
  },

  /**
   * Save data to GitHub via the Worker proxy
   */
  async saveData(data) {
    if (!SYNC_CONFIG.workerUrl) {
      return false
    }

    try {
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))))
      const payload = {
        message: `Update data [${new Date().toLocaleString()}]`,
        content,
        branch: SYNC_CONFIG.branch,
      }

      const res = await fetch(this.apiUrl(SYNC_CONFIG.dataPath), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.message || `GitHub API error: ${res.status}`)
      }

      return true
    } catch (err) {
      console.error('SyncAPI.saveData failed:', err)
      return false
    }
  },
}

export default SyncAPI
