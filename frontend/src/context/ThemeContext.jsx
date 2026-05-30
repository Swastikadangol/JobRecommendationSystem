import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const getInitialDark = () => {
  const stored = localStorage.getItem('theme')
  if (stored) return stored === 'dark'
  return false // ← default to light mode, ignore OS preference
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(getInitialDark)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
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