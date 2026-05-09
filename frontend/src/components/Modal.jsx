import { X } from 'lucide-react'

// Modal component (popup dialog box)
export default function Modal({ title, onClose, children, wide }) {

  return (
    // overlay background (dark screen behind modal)
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-up"
      onClick={onClose} // close modal when clicking outside
    >

      {/* modal container */}
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto
          ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
        onClick={e => e.stopPropagation()} // prevent closing when clicking inside modal
      >

        {/* modal header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">

          {/* title */}
          <h2 className="text-lg font-bold text-gray-900">
            {title}
          </h2>

          {/* close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>

        </div>

        {/* modal content */}
        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  )
}