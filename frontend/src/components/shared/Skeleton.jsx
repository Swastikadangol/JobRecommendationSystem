// All skeletons use the .skeleton class from index.css which handles dark mode automatically

export function CardSkeleton() {
  return (
    <div className="card space-y-3">
      <div className="flex gap-3">
        <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 rounded-lg w-3/4" />
          <div className="skeleton h-3 rounded-lg w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-6 rounded-full w-16" />
        <div className="skeleton h-6 rounded-full w-14" />
        <div className="skeleton h-6 rounded-full w-20" />
      </div>
      <div className="flex gap-1.5">
        <div className="skeleton h-6 rounded-lg w-12" />
        <div className="skeleton h-6 rounded-lg w-16" />
        <div className="skeleton h-6 rounded-lg w-10" />
      </div>
      <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="skeleton h-3 rounded w-16" />
        <div className="skeleton h-3 rounded w-20" />
      </div>
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="card space-y-2">
      <div className="flex justify-between items-start">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-7 w-7 rounded-lg" />
      </div>
      <div className="skeleton h-8 w-14 rounded" />
      <div className="skeleton h-3 w-24 rounded" />
    </div>
  )
}

export function AppCardSkeleton() {
  return (
    <div className="card flex gap-3 items-start">
      <div className="skeleton w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 rounded w-2/3" />
        <div className="skeleton h-3 rounded w-1/3" />
        <div className="skeleton h-3 rounded w-1/4" />
      </div>
    </div>
  )
}