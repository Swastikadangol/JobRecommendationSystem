import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center
                 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                 shadow-lg dark:shadow-dark-modal hover:scale-105 active:scale-95
                 transition-all duration-200"
    >
      {dark
        ? <Sun  className="w-4.5 h-4.5 text-amber-400" />
        : <Moon className="w-4.5 h-4.5 text-slate-500" />
      }
    </button>
  )
}