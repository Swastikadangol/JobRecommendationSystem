import { Search, X } from 'lucide-react'

/* ─────────────────────────────────────────────
   Filter options for different roles
───────────────────────────────────────────── */

// Job types
const JOB_TYPES = [
  { label: 'Full-time',  value: 'FullTime' },
  { label: 'Part-time',  value: 'PartTime' },
  { label: 'Internship', value: 'Internship' },
]

// Work mode types
const WORK_MODES = [
  { label: 'On-site', value: 'OnSite' },
  { label: 'Remote', value: 'Remote' },
  { label: 'Hybrid', value: 'Hybrid' },
]

// Employer job statuses
const EMPLOYER_STATUSES = [
  { label: 'Active', value: 'true' },
  { label: 'Expired', value: 'expired' },
  { label: 'Rejected', value: 'rejected' },
]

// Admin approval statuses
const ADMIN_STATUSES = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
]

/* ─────────────────────────────────────────────
   Reusable filter chip button
───────────────────────────────────────────── */
function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 ${
        active
          ? 'bg-brand-600 text-white border-brand-600'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'
      }`}
    >
      {label}
    </button>
  )
}

/* ─────────────────────────────────────────────
   Small vertical separator between groups
───────────────────────────────────────────── */
function Sep() {
  return (
    <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
  )
}

/* ─────────────────────────────────────────────
   Main FilterBar Component
───────────────────────────────────────────── */
export default function FilterBar({
  role = 'JobSeeker', // Default role
  filters,            // Current filter state
  onChange,           // Update filter state
  onReset,            // Reset all filters
  totalCount,         // Total result count
  showCount = true,  // Toggle count visibility
  placeholder,        // Custom search placeholder
}) {

  /* Toggle filter:
     - If same value clicked again => remove filter
     - Otherwise set new value
  */
  const setFilter = (key, val) =>
    onChange({
      ...filters,
      [key]: val === filters[key] ? '' : val,
    })

  // Check if any filter is active
  const hasActive = Object.values(filters).some(
    v => v !== '' && v !== null && v !== undefined
  )

  // Placeholder text based on role
  const searchPlaceholder = placeholder || {
    JobSeeker: 'Search by title, skill, or keyword…',
    Employer:  'Search by job title…',
    Admin:     'Search by title or company…',
  }[role] || 'Search…'

  return (
    <div className="space-y-3">

      {/* ─────────────────────────────────────
          Search Input
      ───────────────────────────────────── */}
      <div className="relative">

        {/* Search icon */}
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />

        {/* Search field */}
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={filters.search || ''}
          onChange={e =>
            onChange({
              ...filters,
              search: e.target.value,
            })
          }
          className="input pl-10"
        />

        {/* Clear search button */}
        {filters.search && (
          <button
            onClick={() =>
              onChange({
                ...filters,
                search: '',
              })
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────
          Filter Chips Section
      ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* ── Job Types (visible for all roles) ── */}
        <div className="flex items-center gap-1">
          {JOB_TYPES.map(t => (
            <Chip
              key={t.value}
              label={t.label}
              active={filters.jobType === t.value}
              onClick={() => setFilter('jobType', t.value)}
            />
          ))}
        </div>

        {/* ─────────────────────────────────────
            JobSeeker Filters
        ───────────────────────────────────── */}
        {role === 'JobSeeker' && (
          <>
            {/* Separator */}
            <Sep />

            {/* Work mode chips */}
            <div className="flex items-center gap-1">
              {WORK_MODES.map(m => (
                <Chip
                  key={m.value}
                  label={m.label}
                  active={filters.workMode === m.value}
                  onClick={() => setFilter('workMode', m.value)}
                />
              ))}
            </div>

            {/* Separator */}
            <Sep />

            {/* Location input */}
            <input
              type="text"
              placeholder="Location…"
              value={filters.location || ''}
              onChange={e =>
                onChange({
                  ...filters,
                  location: e.target.value,
                })
              }
              className="
                px-3 py-1.5 text-xs rounded-lg
                border border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-800
                text-slate-700 dark:text-slate-300
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus:outline-none
                focus:border-brand-400 dark:focus:border-brand-500
                focus:ring-1 focus:ring-brand-400/20 dark:focus:ring-brand-500/20
                w-28 transition-colors
              "
            />
          </>
        )}

        {/* ─────────────────────────────────────
            Employer Filters
        ───────────────────────────────────── */}
        {role === 'Employer' && (
          <>
            <Sep />

            {/* Active / Closed status */}
            <div className="flex items-center gap-1">
              {EMPLOYER_STATUSES.map(s => (
                <Chip
                  key={s.value}
                  label={s.label}
                  active={filters.isActive === s.value}
                  onClick={() => setFilter('isActive', s.value)}
                />
              ))}
            </div>
          </>
        )}

        {/* ─────────────────────────────────────
            Admin Filters
        ───────────────────────────────────── */}
        {role === 'Admin' && (
          <>
            <Sep />

            {/* Approval statuses */}
            <div className="flex items-center gap-1">
              {ADMIN_STATUSES.map(s => (
                <Chip
                  key={s.value}
                  label={s.label}
                  active={filters.status === s.value}
                  onClick={() => setFilter('status', s.value)}
                />
              ))}
            </div>
          </>
        )}

        {/* ─────────────────────────────────────
            Right Side Actions
        ───────────────────────────────────── */}
        <div className="ml-auto flex items-center gap-3">

          {/* Clear all filters */}
          {hasActive && (
            <button
              onClick={onReset}
              className="
                flex items-center gap-1.5
                text-xs text-slate-500 dark:text-slate-400
                hover:text-slate-800 dark:hover:text-slate-200
                transition-colors
              "
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}

          {/* Result count */}
          {showCount && totalCount !== undefined && (
            <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
              {totalCount} {totalCount === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

      </div>
    </div>
  )
}