import { useEffect, useState, useMemo } from 'react'
import { adminApi } from '../../api'
import { useToast } from '../../context/ToastContext'
import { AppCardSkeleton } from '../../components/shared/Skeleton'
import { FileText, Search, X, TrendingUp, Calendar, Building2 } from 'lucide-react'

// Normalize status to string regardless of whether API returns string or int
const toStatusString = (s) => {
  if (s === null || s === undefined) return 'Applied'
  if (typeof s === 'string' && s.length > 0 && isNaN(Number(s))) return s
  const map = { 0:'Applied', 1:'Reviewed', 2:'Shortlisted', 3:'Rejected', 4:'Accepted' }
  return map[Number(s)] ?? String(s)
}

const STATUS_TABS = [
  { label: 'All',         value: null          },
  { label: 'Applied',     value: 'Applied'      },
  { label: 'Reviewed',    value: 'Reviewed'     },
  { label: 'Shortlisted', value: 'Shortlisted'  },
  { label: 'Rejected',    value: 'Rejected'     },
  { label: 'Accepted',    value: 'Accepted'     },
]

const STATUS_CLS = {
  Applied:     'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  Reviewed:    'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  Shortlisted: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  Rejected:    'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  Accepted:    'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
}

function matchColor(score) {
  if (score >= 70) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 40) return 'text-amber-600 dark:text-amber-400'
  return 'text-slate-400 dark:text-slate-500'
}

export default function AdminApplications() {
  const { addToast }    = useToast()
  const [apps,    setApps]    = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [tab,     setTab]     = useState(null)

  useEffect(() => {
    adminApi.getApplications()
      .then(r => {
        const raw = r.data || []
        // normalize every app's status to string
        const normalized = raw.map(a => ({
          ...a,
          applicationStatus: toStatusString(a.applicationStatus)
        }))
        setApps(normalized)
      })
      .catch(_err => addToast('Failed to load applications', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const sorted = useMemo(() =>
    [...apps].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)),
    [apps]
  )

  const filtered = useMemo(() => {
    let list = sorted
    if (tab !== null) list = list.filter(a => a.applicationStatus === tab)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.applicantName?.toLowerCase().includes(q)  ||
        a.applicantEmail?.toLowerCase().includes(q) ||
        a.jobTitle?.toLowerCase().includes(q)       ||
        a.companyName?.toLowerCase().includes(q)
      )
    }
    return list
  }, [sorted, tab, search])

  const counts = useMemo(() =>
    STATUS_TABS.reduce((acc, t) => {
      acc[t.value] = t.value === null
        ? apps.length
        : apps.filter(a => a.applicationStatus === t.value).length
      return acc
    }, {}),
    [apps]
  )

  const avgMatch = apps.length
    ? Math.round(apps.reduce((s, a) => s + (a.matchScore ?? 0), 0) / apps.length)
    : 0

  return (
    <div className="animate-fadeIn space-y-5">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-brand-600" />
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Applications
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          All job applications across the platform.
        </p>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:'Total',       value:apps.length,                                                       color:'text-brand-600 dark:text-brand-400',    bg:'bg-brand-50 dark:bg-brand-500/10'    },
            { label:'Shortlisted', value:apps.filter(a=>a.applicationStatus==='Shortlisted').length,        color:'text-purple-600 dark:text-purple-400',  bg:'bg-purple-50 dark:bg-purple-500/10'  },
            { label:'Accepted',    value:apps.filter(a=>a.applicationStatus==='Accepted').length,           color:'text-emerald-600 dark:text-emerald-400', bg:'bg-emerald-50 dark:bg-emerald-500/10'},
            { label:'Avg Match',   value:`${avgMatch}%`,                                                    color:'text-amber-600 dark:text-amber-400',    bg:'bg-amber-50 dark:bg-amber-500/10'    },
          ].map(s => (
            <div key={s.label} className="card text-center py-3">
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card space-y-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map(t => (
            <button key={String(t.value)} onClick={() => setTab(t.value)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                tab === t.value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
              }`}>
              {t.label}
              <span className={`ml-1.5 text-xs ${tab === t.value ? 'opacity-70' : 'text-slate-400'}`}>
                ({counts[t.value] ?? 0})
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search applicant, job title, company…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm w-full" />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          Showing {filtered.length} of {apps.length} applications
          {apps.length > 0 && (
            <span className="ml-2 text-slate-300 dark:text-slate-600">
              · statuses: {[...new Set(apps.map(a => a.applicationStatus))].join(', ')}
            </span>
          )}
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{Array(6).fill(0).map((_, i) => <AppCardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-14 border-dashed border-2 border-slate-200 dark:border-slate-700">
          <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-display font-semibold text-slate-700 dark:text-slate-300 mb-1">No applications found</p>
          <p className="text-sm text-slate-400">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(a => (
            <div key={a.applicationId} className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-sm font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
                  {(a.applicantName || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {a.applicantName || 'Applicant'}
                      </h3>
                      {a.applicantEmail && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{a.applicantEmail}</p>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${STATUS_CLS[a.applicationStatus] || 'bg-slate-100 text-slate-500'}`}>
                      {a.applicationStatus}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {a.jobTitle && (
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <FileText className="w-3 h-3 text-slate-400" /> {a.jobTitle}
                      </span>
                    )}
                    {a.companyName && (
                      <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                        <Building2 className="w-3 h-3" /> {a.companyName}
                      </span>
                    )}
                    {a.appliedAt && (
                      <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(a.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                    {a.matchScore != null && (
                      <span className={`flex items-center gap-1 text-xs font-semibold ${matchColor(a.matchScore)}`}>
                        <TrendingUp className="w-3 h-3" /> {Math.round(a.matchScore)}% match
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}