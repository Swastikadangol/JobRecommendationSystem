import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { adminApi } from '../../api'
import { useToast } from '../../context/ToastContext'
import { CardSkeleton } from '../../components/shared/Skeleton'
import { jobTypeLabel, workModeLabel, formatDate } from '../../utils/helpers'
import {
  Briefcase, CircleCheck, CircleX, Clock,
  MapPin, Building2, Search, X,
  Calendar, Trash2, Eye
} from 'lucide-react'


const STATUS_TABS = [
  { label: 'All',      value: ''         },
  { label: 'Pending',  value: 'Pending'  },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
]

function StatusBadge({ status }) {
  const map = {
    0: { label: 'Pending',  cls: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40'       },
    1: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40' },
    2: { label: 'Rejected', cls: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40'                   },
    Pending:  { label: 'Pending',  cls: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40'        },
    Approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40'},
    Rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40'                   },
  }
  const s = map[status] || { label: String(status), cls: 'bg-slate-100 text-slate-500 border-slate-200' }
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${s.cls}`}>{s.label}</span>
  )
}

import JobDetailPanel from './AdminJobDetail'

/* ── placeholder kept for grep ── */
function _unused() {
  const [detail,  setDetail]  = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getJobDetail(jobId)
      .then(r => setDetail(r.data))
      .catch(_err => {})
      .finally(() => setLoading(false))
  }, [jobId])

  const isPending = detail?.status === 'Pending' || detail?.status === 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">

        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-600" />
            <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100">Job Detail</h3>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array(4).fill(0).map((_, i) => <div key={i} className="h-8 skeleton rounded" />)}
          </div>
        ) : detail ? (
          <div className="p-6 space-y-5">

            {/* Title + status */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
                  {detail.jobTitle}
                </h2>
                <StatusBadge status={detail.status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> {detail.companyName}
                </span>
                {detail.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {detail.location}
                  </span>
                )}
                {detail.salaryRange && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> {detail.salaryRange}
                  </span>
                )}
                {detail.deadline && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Closes {formatDate(detail.deadline)}
                  </span>
                )}
              </div>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2">
              <span className="skill-tag">{jobTypeLabel(detail.jobType)}</span>
              <span className="skill-tag">{workModeLabel(detail.workMode)}</span>
              {detail.minimumEducationLevel && (
                <span className="skill-tag">Min. {detail.minimumEducationLevel}</span>
              )}
              {detail.minYearsExperience != null && (
                <span className="skill-tag">{detail.minYearsExperience}+ yrs exp</span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Applicants',  value: detail.totalApplicants },
                { label: 'Avg Match',   value: detail.avgMatchScore != null ? `${detail.avgMatchScore}%` : '—' },
                { label: 'Posted',      value: formatDate(detail.postedAt) },
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">{s.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</p>
              <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {detail.jobDescription}
              </div>
            </div>

            {/* Skills */}
            {detail.requiredSkills && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {detail.requiredSkills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Employer info */}
            {detail.employerEmail && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm">
                <span className="text-slate-400">Posted by:</span>
                <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">{detail.employerEmail}</span>
              </div>
            )}

            {/* Actions */}
            {isPending && (
              <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => onApprove(detail.jobId)} disabled={acting === detail.jobId}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-60">
                  {acting === detail.jobId
                    ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/></svg>
                    : <><CircleCheck className="w-4 h-4" /> Approve Job</>
                  }
                </button>
                <button onClick={() => onReject(detail.jobId)} disabled={acting === detail.jobId}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60">
                  <CircleX className="w-4 h-4" /> Reject Job
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400">Failed to load job details.</div>
        )}
      </div>
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────────── */
export default function AdminJobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs,       setJobs]       = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [acting,     setActing]     = useState(null)
  const [viewJob,    setViewJob]    = useState(null)
  const [deleting,   setDeleting]   = useState(null)
  const { addToast } = useToast()

  const statusFilter = searchParams.get('status') || ''

  useEffect(() => {
    setLoading(true)
    adminApi.getJobs(statusFilter ? { status: statusFilter } : {})
      .then(r => setJobs(r.data || []))
      .catch(_err => addToast('Failed to load jobs', 'error'))
      .finally(() => setLoading(false))
  }, [statusFilter])

  const approve = async (jobId) => {
    setActing(jobId)
    try {
      await adminApi.approveJob(jobId)
      setJobs(prev => prev.map(j => j.jobId === jobId ? { ...j, status: 'Approved' } : j))
      setViewJob(null)
      addToast('Job approved!', 'success')
    } catch (_err) { addToast('Failed to approve', 'error') }
    finally { setActing(null) }
  }

  const reject = async (jobId) => {
    setActing(jobId)
    try {
      await adminApi.rejectJob(jobId)
      setJobs(prev => prev.map(j => j.jobId === jobId ? { ...j, status: 'Rejected' } : j))
      setViewJob(null)
      addToast('Job rejected.', 'success')
    } catch (_err) { addToast('Failed to reject', 'error') }
    finally { setActing(null) }
  }

  const deleteJob = async (jobId) => {
    try {
      await adminApi.deleteJob(jobId)
      setJobs(prev => prev.filter(j => j.jobId !== jobId))
      setDeleting(null)
      addToast('Job deleted.', 'success')
    } catch (_err) { addToast('Failed to delete', 'error') }
  }

  const filtered = useMemo(() => {
    if (!search) return jobs
    const q = search.toLowerCase()
    return jobs.filter(j =>
      j.jobTitle?.toLowerCase().includes(q) ||
      j.companyName?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q)
    )
  }, [jobs, search])

  const pendingCount = jobs.filter(j => j.status === 'Pending' || j.status === 0).length
  const counts = { '': jobs.length, Pending: pendingCount, Approved: jobs.filter(j => j.status === 'Approved' || j.status === 1).length, Rejected: jobs.filter(j => j.status === 'Rejected' || j.status === 2).length }

  return (
    <div className="animate-fadeIn space-y-5">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-5 h-5 text-brand-600" />
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">Manage Jobs</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review, approve or reject job listings. Click any job to see full details.
        </p>
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && !statusFilter && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <span className="font-semibold">{pendingCount} job{pendingCount > 1 ? 's' : ''}</span> awaiting approval.
          </p>
          <button onClick={() => setSearchParams({ status: 'Pending' })}
            className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline flex-shrink-0">
            View pending →
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_TABS.map(t => (
              <button key={t.value}
                onClick={() => setSearchParams(t.value ? { status: t.value } : {})}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  statusFilter === t.value
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
                }`}>
                {t.label}
                <span className={`ml-1.5 text-xs ${statusFilter === t.value ? 'opacity-70' : 'text-slate-400'}`}>
                  ({counts[t.value] ?? 0})
                </span>
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search title, company, location…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm w-full" />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Job list */}
      {loading ? (
        <div className="space-y-3">{Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-14 border-dashed border-2 border-slate-200 dark:border-slate-700">
          <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-display font-semibold text-slate-700 dark:text-slate-300 mb-1">No jobs found</p>
          <p className="text-sm text-slate-400">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => (
            <div key={job.jobId} className="card hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100">{job.jobTitle}</h3>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{job.companyName || '—'}</span>
                    {job.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>}
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{jobTypeLabel(job.jobType)}</span>
                    <span>{workModeLabel(job.workMode)}</span>
                    {job.postedAt && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Posted {formatDate(job.postedAt)}</span>}
                  </div>
                  {job.requiredSkills && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.requiredSkills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5).map(s => (
                        <span key={s} className="skill-tag">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <button onClick={() => setViewJob(job.jobId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  {(job.status === 'Pending' || job.status === 0) && (
                    <>
                      <button disabled={acting === job.jobId} onClick={() => approve(job.jobId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-60">
                        <CircleCheck className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button disabled={acting === job.jobId} onClick={() => reject(job.jobId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60">
                        <CircleX className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => setDeleting(job.jobId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job detail panel */}
      {viewJob && (
        <JobDetailPanel
          jobId={viewJob}
          onClose={() => setViewJob(null)}
          onApprove={approve}
          onReject={reject}
          acting={acting}
        />
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-xs p-6 text-center animate-fadeIn">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-2">Delete this job?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">This will remove all associated applications and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={() => deleteJob(deleting)}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}