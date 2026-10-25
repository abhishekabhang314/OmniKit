import { createContext, useContext } from 'react'

// go(href, label): curtain transition to an internal route.
// openPalette(): opens the ⌘K tool search.
export const ShellContext = createContext({
  go: () => {},
  openPalette: () => {},
})

export function useShell() {
  return useContext(ShellContext)
}
