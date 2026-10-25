const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

// Label for the search shortcut (⌘K on Apple devices, Ctrl K elsewhere).
export const SHORTCUT = isMac ? '⌘K' : 'Ctrl K'
