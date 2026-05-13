import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

// Apply theme class immediately on load — prevents white flash before JS runs
const getInitialDark = () => {
  const stored = localStorage.getItem('theme')
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(getInitialDark)

  useEffect(() => {
    // Apply to <html> element so all dark: classes activate
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // ✅ Persist theme independently — never cleared by logout
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggle = () => setDark(d => !d)

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)