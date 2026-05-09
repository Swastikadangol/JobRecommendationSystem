import { Search, X } from 'lucide-react'

const JOB_TYPES = [
  { label: 'Full-time', value: '0' },
  { label: 'Part-time', value: '1' },
  { label: 'Internship', value: '2' },
]

const WORK_MODES = [
  { label: 'On-site', value: '0' },
  { label: 'Remote', value: '1' },
  { label: 'Hybrid', value: '2' },
]

const EMPLOYER_STATUSES = [
  { label: 'Active', value: 'true' },
  { label: 'Closed', value: 'false' },
]

const ADMIN_STATUSES = [
  { label: 'Pending', value: '0' },
  { label: 'Approved', value: '1' },
  { label: 'Rejected', value: '2' },
]

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 ${
        active
          ? 'bg-brand-600 text-white border-brand-600'
          : 'bg-white text-ink-muted border-surface-200 hover:border-brand-300 hover:text-brand-600'
      }`}
    >
      {label}
    </button>
  )
}

export default function FilterBar({ role = 'JobSeeker', filters, onChange, onReset, totalCount, showCount = true, placeholder }) {
  const setFilter = (key, val) =>
    onChange({ ...filters, [key]: val === filters[key] ? '' : val })

  const hasActive = Object.values(filters).some(v => v !== '' && v !== null && v !== undefined)

  const searchPlaceholder = placeholder || {
    JobSeeker: 'Search by title, skill, or keyword…',
    Employer: 'Search by job title…',
    Admin: 'Search by title or company…',
  }[role] || 'Search…'

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light pointer-events-none" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={filters.search || ''}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          className="input pl-10"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Chip filters */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Job Type — all roles */}
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

        {/* JobSeeker: work mode + location */}
        {role === 'JobSeeker' && (
          <>
            <div className="w-px h-5 bg-surface-200" />
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
            <div className="w-px h-5 bg-surface-200" />
            <input
              type="text"
              placeholder="Location…"
              value={filters.location || ''}
              onChange={e => onChange({ ...filters, location: e.target.value })}
              className="px-3 py-1.5 text-xs border border-surface-200 rounded-lg focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 placeholder-ink-light w-28 bg-white"
            />
          </>
        )}

        {/* Employer: active/closed status */}
        {role === 'Employer' && (
          <>
            <div className="w-px h-5 bg-surface-200" />
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

        {/* Admin: pending/approved/rejected status */}
        {role === 'Admin' && (
          <>
            <div className="w-px h-5 bg-surface-200" />
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

        {/* Clear + count — right side */}
        <div className="ml-auto flex items-center gap-3">
          {hasActive && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
          {showCount && totalCount !== undefined && (
            <span className="text-xs text-ink-light tabular-nums">
              {totalCount} {totalCount === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}