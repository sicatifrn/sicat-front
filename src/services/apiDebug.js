import { ref } from 'vue'

const MAX_LOG = 30

/** URL base do axios SICAT (build-time VITE_API_BASE_URL + fallback). */
export const apiBaseUrlResolved = ref('')

/** Últimas respostas HTTP do cliente principal e do SUAP (para debug). */
export const apiRequestLog = ref([])

export function setApiBaseUrlResolved(url) {
  apiBaseUrlResolved.value = url || ''
}

/**
 * @param {{ source?: string, method: string, path?: string, status: number|string, ok: boolean }} entry
 */
export function pushApiLog(entry) {
  const row = {
    ts: Date.now(),
    source: entry.source || 'sicat',
    method: entry.method,
    path: entry.path || '',
    status: entry.status,
    ok: entry.ok
  }
  apiRequestLog.value = [row, ...apiRequestLog.value].slice(0, MAX_LOG)
}

export function clearApiRequestLog() {
  apiRequestLog.value = []
}
