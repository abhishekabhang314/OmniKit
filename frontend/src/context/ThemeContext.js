import { createContext, useContext } from 'react'

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

export function useThemeContext() {
  return useContext(ThemeContext)
}
