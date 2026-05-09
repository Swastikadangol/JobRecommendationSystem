/**
 * ─────────────────────────────────────────────
 * CARD SKELETON
 * ─────────────────────────────────────────────
 * Loading placeholder for job cards
 *
 * Used while fetching:
 * - Job listings
 * - Dashboard cards
 * - Search results
 *
 * Skeleton loaders improve UX by showing
 * the expected layout before real data loads
 */
export function CardSkeleton() {
  return (
    <div className="card space-y-3">

      {/* Top section → icon + title */}
      <div className="flex gap-3">

        {/* Fake company/logo icon */}
        <div className="skeleton w-10 h-10 rounded-xl" />

        <div className="flex-1 space-y-2">

          {/* Fake job title */}
          <div className="skeleton h-4 rounded w-3/4" />

          {/* Fake company/location text */}
          <div className="skeleton h-3 rounded w-1/2" />
        </div>
      </div>

      {/* Fake badge/tags section */}
      <div className="flex gap-2">

        <div className="skeleton h-5 rounded-full w-16" />
        <div className="skeleton h-5 rounded-full w-14" />
        <div className="skeleton h-5 rounded-full w-20" />
      </div>

      {/* Fake skill chips */}
      <div className="flex gap-1.5">

        <div className="skeleton h-6 rounded-lg w-12" />
        <div className="skeleton h-6 rounded-lg w-16" />
        <div className="skeleton h-6 rounded-lg w-10" />
      </div>

      {/* Bottom info section */}
      <div className="flex justify-between pt-1 border-t border-surface-100">

        {/* Fake salary/date */}
        <div className="skeleton h-3 rounded w-16" />

        {/* Fake status text */}
        <div className="skeleton h-3 rounded w-20" />
      </div>
    </div>
  )
}

/**
 * ─────────────────────────────────────────────
 * STAT SKELETON
 * ─────────────────────────────────────────────
 * Loading placeholder for dashboard stats
 *
 * Example:
 * - Total Jobs
 * - Applications
 * - Interviews
 * - Hires
 */
export function StatSkeleton() {
  return (
    <div className="card space-y-2">

      {/* Top row → title + icon */}
      <div className="flex justify-between">

        {/* Fake stat title */}
        <div className="skeleton h-3 w-20 rounded" />

        {/* Fake icon */}
        <div className="skeleton h-6 w-6 rounded-lg" />
      </div>

      {/* Fake main stat number */}
      <div className="skeleton h-8 w-14 rounded" />
    </div>
  )
}

/**
 * ─────────────────────────────────────────────
 * APPLICATION CARD SKELETON
 * ─────────────────────────────────────────────
 * Loading placeholder for application cards
 *
 * Used while fetching:
 * - Applied jobs
 * - Recent applications
 * - Application history
 */
export function AppCardSkeleton() {
  return (
    <div className="card flex gap-3 items-start">

      {/* Fake company/job icon */}
      <div className="skeleton w-9 h-9 rounded-xl flex-shrink-0" />

      <div className="flex-1 space-y-2">

        {/* Fake job title */}
        <div className="skeleton h-4 rounded w-2/3" />

        {/* Fake company name */}
        <div className="skeleton h-3 rounded w-1/3" />

        {/* Fake applied date/status */}
        <div className="skeleton h-3 rounded w-1/4" />
      </div>
    </div>
  )
}