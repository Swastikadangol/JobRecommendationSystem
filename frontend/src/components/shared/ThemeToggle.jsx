import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed bottom-6 right-6 z-50
                 w-10 h-10 rounded-full flex items-center justify-center
                 bg-white dark:bg-slate-800
                 border border-slate-200 dark:border-slate-700
                 text-slate-500 dark:text-slate-400
                 shadow-lg dark:shadow-slate-900/60
                 hover:scale-110 active:scale-95
                 hover:border-brand-400 dark:hover:border-brand-500
                 hover:text-brand-600 dark:hover:text-brand-400
                 transition-all duration-200"
    >
      {dark
        ? <Sun  className="w-4 h-4 text-amber-400" />
        : <Moon className="w-4 h-4 text-slate-500" />
      }
    </button>
  )
}