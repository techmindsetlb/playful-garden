const SYNC_CONFIG = {
  owner: 'techmindsetlb',
  repo: 'playful-garden',
  branch: 'main',
  // Set this to your Cloudflare Worker URL after deploying worker.js
  // Leave empty to use localStorage only
  workerUrl: '',
  // === Data Storage Paths ===
  dataPath: 'data/naghams-garden-data.json',
  // === App Settings ===
  appName: "Nagham's Garden",
  defaultPin: '2002',
  // === LocalStorage Keys ===
  cacheKey: 'naghams_garden_data',
  lastSyncKey: 'naghams_garden_last_sync',
}

export default SYNC_CONFIG
