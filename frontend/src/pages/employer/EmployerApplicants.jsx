import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { employerApi } from '../../api'
import { useToast } from '../../context/ToastContext'
import { AppCardSkeleton } from '../../components/shared/Skeleton'
import {
  Users, ArrowLeft, Building2, TrendingUp,
  Calendar, ChevronDown
} from 'lucide-react'
import { statusBadge, timeAgo, matchColor } from '../../utils/helpers'

const STATUS_TABS = [
  { label: 'All',         value: null },
  { label: 'Applied',     value: 0    },
  { label: 'Reviewed',    value: 1    },
  { label: 'Shortlisted', value: 2    },
  { label: 'Rejected',    value: 3    },
  { label: 'Accepted',    value: 4    },
]

const STATUS_OPTIONS = [
  { value: 1, label: 'Reviewed'    },
  { value: 2, label: 'Shortlisted' },
  { value: 3, label: 'Rejected'    },
  { value: 4, label: 'Accepted'    },
]

const STATUS_MAP = { 1: 'Reviewed', 2: 'Shortlisted', 3: 'Rejected', 4: 'Accepted' }

/* ── Applicant card ─────────────────────────────────────── */
function ApplicantCard({ app, onStatusChange, updating }) {
  const { label, cls } = statusBadge(app.applicationStatus)
  const [open, setOpen] = useState(false)

  return (
    <div className="card animate-fadeIn">
      <div className="flex items-start gap-4">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-800/60 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-brand-500 dark:text-brand-400" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100">
                {app.applicantName || app.fullName || 'Applicant'}
              </h3>
              {app.email && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{app.email}</p>
              )}
            </div>

            {/* Status badge + update dropdown */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={cls}>{label}</span>
              <div className="relative">
                <button
                  disabled={updating === app.applicationId}
                  onClick={() => setOpen(o => !o)}
                  className="btn-outline text-xs py-1 px-2.5 gap-1"
                >
                  {updating === app.applicationId ? (
                    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                    </svg>
                  ) : (
                    <>Update <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
                {open && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-modal dark:shadow-dark-modal z-20 py-1 animate-fadeIn">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s.value}
                        onClick={() => { onStatusChange(app.applicationId, s.value); setOpen(false) }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {app.appliedAt && (
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <Calendar className="w-3 h-3" />
                Applied {timeAgo(app.appliedAt)}
              </span>
            )}
            {app.matchScore != null && (
              <span className={`flex items-center gap-1 text-xs font-semibold ${matchColor(app.matchScore)}`}>
                <TrendingUp className="w-3 h-3" />
                {Math.round(app.matchScore)}% match
              </span>
            )}
          </div>

          {/* Skills */}
          {app.skills && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {app.skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 6).map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────────── */
export default function EmployerApplicants() {
  const { jobId }    = useParams()
  const navigate     = useNavigate()
  const { addToast } = useToast()

  const [applicants, setApplicants] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [activeTab,  setActiveTab]  = useState(null)
  const [updating,   setUpdating]   = useState(null)

  useEffect(() => {
    employerApi.getApplicants(jobId)
      .then(r => setApplicants(r.data || []))
      .catch(_err => addToast('Failed to load applicants', 'error'))
      .finally(() => setLoading(false))
  }, [jobId])

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId)
    try {
      await employerApi.updateAppStatus(appId, STATUS_MAP[newStatus])
      setApplicants(prev =>
        prev.map(a => a.applicationId === appId ? { ...a, applicationStatus: newStatus } : a)
      )
      addToast('Status updated', 'success')
    } catch (_err) {
      addToast('Failed to update status', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const sorted = useMemo(() =>
    [...applicants].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)),
    [applicants]
  )

  const filtered = useMemo(() =>
    activeTab === null
      ? sorted
      : sorted.filter(a => a.applicationStatus === activeTab),
    [sorted, activeTab]
  )

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t.value] = t.value === null
      ? applicants.length
      : applicants.filter(a => a.applicationStatus === t.value).length
    return acc
  }, {})

  return (
    <div className="animate-fadeIn space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/employer/jobs')}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Users className="w-5 h-5 text-brand-600" />
            <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Applicants
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {applicants.length} application{applicants.length !== 1 ? 's' : ''} · sorted by match score
          </p>
        </div>
      </div>

      {/* Stats */}
      {!loading && applicants.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total',       value: applicants.length,                                             color: 'text-brand-600 dark:text-brand-400',   bg: 'bg-brand-50 dark:bg-brand-500/10'   },
            { label: 'Shortlisted', value: applicants.filter(a => a.applicationStatus === 2).length,     color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' },
            { label: 'Accepted',    value: applicants.filter(a => a.applicationStatus === 4).length,     color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          ].map(s => (
            <div key={s.label} className="card text-center py-3">
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Status tabs */}
      {!loading && applicants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map(t => (
            <button
              key={String(t.value)}
              onClick={() => setActiveTab(t.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 ${
                activeTab === t.value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              {t.label}
              {counts[t.value] > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === t.value
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {counts[t.value]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => <AppCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-14 border-dashed border-2 border-slate-200 dark:border-slate-700">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-display font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {activeTab === null
              ? 'No applications yet'
              : `No ${STATUS_TABS.find(t => t.value === activeTab)?.label} applicants`}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {activeTab === null
              ? 'Share your job listing to start receiving applications'
              : 'Try switching to a different status tab'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <ApplicantCard
              key={app.applicationId}
              app={app}
              onStatusChange={handleStatusChange}
              updating={updating}
            />
          ))}
        </div>
      )}
    </div>
  )
}
