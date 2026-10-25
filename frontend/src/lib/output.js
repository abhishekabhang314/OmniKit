// Clipboard and download helpers for tool output actions. Each returns false
// on failure so ActionButton can skip its "done" confirmation.

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}

export async function copyImage(blob) {
  try { await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]); return true } catch { return false }
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
