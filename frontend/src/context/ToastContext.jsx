import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

//create global toast context
const ToastContext = createContext(null)

//TOAST PROVIDER COMPONENT
export function ToastProvider({ children }) {

  //store all active toast notifications
  const [toasts, setToasts] = useState([])

  /**
   * addToast function
   * message = toast text
   * type = success | error | warning
   */
  const addToast = useCallback((message, type = 'success') => {

    //unique id for each toast
    const id = Date.now() + Math.random()

    //add new toast into state
    setToasts(prev => [
      ...prev,
      { id, message, type }
    ])

    //auto remove toast after 4 seconds
    setTimeout(() => {
      setToasts(prev =>
        prev.filter(t => t.id !== id)
      )
    }, 4000)

  }, [])

  //remove toast manually
  const removeToast = (id) =>
    setToasts(prev =>
      prev.filter(t => t.id !== id)
    )

  //icons based on toast type
  const icons = {
    success: (
      <CheckCircle className="w-4 h-4 text-emerald-500" />
    ),
    error: (
      <XCircle className="w-4 h-4 text-red-500" />
    ),
    warning: (
      <AlertCircle className="w-4 h-4 text-amber-500" />
    ),
  }

  //left border colors based on type
  const colors = {
    success: 'border-l-emerald-400',
    error: 'border-l-red-400',
    warning: 'border-l-amber-400',
  }

  return (
    <ToastContext.Provider value={{ addToast }}>

      {/* render whole app */}
      {children}

      {/* toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-80">

        {/* render all active toasts */}
        {toasts.map(toast => (

          <div
            key={toast.id}
            className={`
              flex items-start gap-3 p-3.5
              bg-white rounded-xl shadow-modal
              border border-surface-200 border-l-4
              ${colors[toast.type]}
              animate-fadeIn
            `}
          >

            {/* toast icon */}
            <span className="mt-0.5">
              {icons[toast.type]}
            </span>

            {/* toast message */}
            <p className="text-sm text-ink flex-1">
              {toast.message}
            </p>

            {/* close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-ink-light hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>

          </div>
        ))}

      </div>
    </ToastContext.Provider>
  )
}

//custom hook for easy toast access
export const useToast = () => useContext(ToastContext)