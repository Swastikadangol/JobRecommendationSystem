export default function EmptyState({ icon: Icon, title, desc, action }) {

  return (
    // main container (centered empty state UI)
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

      {/* optional icon (passed as prop) */}
      {Icon && <Icon size={40} className="text-gray-300 mb-4" />}

      {/* title text */}
      <h3 className="text-base font-semibold text-gray-600 mb-1">
        {title}
      </h3>

      {/* optional description */}
      {desc && (
        <p className="text-sm text-gray-400 mb-4">
          {desc}
        </p>
      )}

      {/* optional action button / element */}
      {action}

    </div>
  )
}