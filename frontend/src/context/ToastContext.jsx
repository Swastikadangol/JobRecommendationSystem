import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

/* ─────────────────────────────────────────────
   Create Toast Context
   Used to share toast functions globally
───────────────────────────────────────────── */
const ToastContext = createContext(null)

/* ─────────────────────────────────────────────
   Toast Provider Component
   Wrap app with this provider
───────────────────────────────────────────── */
export function ToastProvider({ children }) {

  // Stores all active toast messages
  const [toasts, setToasts] = useState([])

  /* ─────────────────────────────────────────
     Add new toast notification

     message → text to display
     type    → success | error | warning
  ───────────────────────────────────────── */
  const addToast = useCallback((message, type = 'success') => {

    // Unique toast id
    const id = Date.now()

    // Add new toast to list
    setToasts(prev => [
      ...prev,
      { id, message, type }
    ])

    // Auto remove toast after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)

  }, [])

  /* ─────────────────────────────────────────
     Remove toast manually
  ───────────────────────────────────────── */
  const removeToast = (id) =>
    setToasts(prev => prev.filter(t => t.id !== id))

  /* ─────────────────────────────────────────
     Toast styles based on type
  ───────────────────────────────────────── */
  const config = {

    // Success toast
    success: {
      icon: (
        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
      ),
      bar: 'bg-emerald-500',
      ring: 'ring-emerald-100 dark:ring-emerald-900/40',
    },

    // Error toast
    error: {
      icon: (
        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      ),
      bar: 'bg-red-500',
      ring: 'ring-red-100 dark:ring-red-900/40',
    },

    // Warning toast
    warning: {
      icon: (
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
      ),
      bar: 'bg-amber-500',
      ring: 'ring-amber-100 dark:ring-amber-900/40',
    },
  }

  return (

    /* Provide addToast globally */
    <ToastContext.Provider value={{ addToast }}>

      {/* Render application */}
      {children}

      {/* ─────────────────────────────────────
          Toast Container
          Positioned bottom-right
      ───────────────────────────────────── */}
      <div className="fixed bottom-20 right-5 z-[100] flex flex-col gap-2.5 w-80 pointer-events-none">

        {/* Loop through all toasts */}
        {toasts.map(toast => {

          // Get style config for toast type
          const c = config[toast.type] || config.success

          return (
            <div
              key={toast.id}
              className={`
                pointer-events-auto
                flex items-start gap-3
                p-4 rounded-2xl
                bg-white dark:bg-slate-900
                border border-slate-100 dark:border-slate-800
                shadow-xl dark:shadow-slate-900/80
                ring-1 ${c.ring}
                animate-fadeIn
                overflow-hidden relative
              `}
            >

              {/* Left colored status bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${c.bar}`}
              />

              {/* Toast icon */}
              <div className="ml-2">
                {c.icon}
              </div>

              {/* Toast message */}
              <p className="text-sm text-slate-800 dark:text-slate-100 flex-1 leading-relaxed">
                {toast.message}
              </p>

              {/* Close button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="
                  flex-shrink-0 p-0.5 rounded-lg
                  text-slate-400 dark:text-slate-500
                  hover:text-slate-700 dark:hover:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  transition-colors
                "
              >
                <X className="w-3.5 h-3.5" />
              </button>

            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

/* ─────────────────────────────────────────────
   Custom hook for using toast context
───────────────────────────────────────────── */
export const useToast = () => useContext(ToastContext)