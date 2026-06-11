const HIGH_CONTRAST_KEY = 'sicat_high_contrast'

export const isHighContrastEnabled = () => localStorage.getItem(HIGH_CONTRAST_KEY) === 'true'

export const applyHighContrast = (enabled = isHighContrastEnabled()) => {
  document.documentElement.classList.toggle('high-contrast', enabled)
}

export const setHighContrast = (enabled) => {
  localStorage.setItem(HIGH_CONTRAST_KEY, enabled ? 'true' : 'false')
  applyHighContrast(enabled)
  window.dispatchEvent(new CustomEvent('accessibility-changed', { detail: { highContrast: enabled } }))
}

export const toggleHighContrast = () => {
  const enabled = !isHighContrastEnabled()
  setHighContrast(enabled)
  return enabled
}

