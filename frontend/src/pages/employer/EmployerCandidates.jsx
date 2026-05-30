// import { useEffect, useState, useMemo } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { employerApi } from '../../api'
// import { useToast } from '../../context/ToastContext'
// import { AppCardSkeleton } from '../../components/shared/Skeleton'
// import { statusBadge, timeAgo, matchColor } from '../../utils/helpers'
// import {
//   Users, Search, Briefcase, TrendingUp,
//   Calendar, ChevronDown, ArrowRight, X
// } from 'lucide-react'

// /* ── status map ─────────────────────────────────────────── */
// const STATUS_TABS = [
//   { label: 'All',         value: null },
//   { label: 'Applied',     value: 0    },
//   { label: 'Reviewed',    value: 1    },
//   { label: 'Shortlisted', value: 2    },
//   { label: 'Rejected',    value: 3    },
//   { label: 'Accepted',    value: 4    },
// ]
// const STATUS_OPTIONS = [
//   { value: 1, label: 'Reviewed'    },
//   { value: 2, label: 'Shortlisted' },
//   { value: 3, label: 'Rejected'    },
//   { value: 4, label: 'Accepted'    },
// ]
// const STATUS_MAP = { 1: 'Reviewed', 2: 'Shortlisted', 3: 'Rejected', 4: 'Accepted' }

// /* ── Candidate row card ─────────────────────────────────── */
// function CandidateCard({ app, onStatusChange, updating, onViewJob }) {
//   const { label, cls } = statusBadge(app.applicationStatus)
//   const [open, setOpen] = useState(false)

//   // close dropdown when clicking outside
//   useEffect(() => {
//     if (!open) return
//     const handler = () => setOpen(false)
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [open])

//   return (
//     <div className="card animate-fadeIn hover:shadow-sm transition-shadow">
//       <div className="flex items-start gap-4">

//         {/* Avatar initials */}
//         <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-800/40 flex items-center justify-center flex-shrink-0 text-sm font-bold text-brand-600 dark:text-brand-400">
//           {(app.applicantName || app.fullName || '?')[0].toUpperCase()}
//         </div>

//         {/* Main info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-3 flex-wrap">
//             <div className="min-w-0">
//               <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 truncate">
//                 {app.applicantName || app.fullName || 'Applicant'}
//               </h3>
//               <div className="flex items-center gap-2 flex-wrap mt-0.5">
//                 {app.email && (
//                   <span className="text-xs text-slate-400 dark:text-slate-500">{app.email}</span>
//                 )}
//               </div>
//             </div>

//             {/* Status + update */}
//             <div className="flex items-center gap-2 flex-shrink-0">
//               <span className={cls}>{label}</span>
//               <div className="relative" onMouseDown={e => e.stopPropagation()}>
//                 <button
//                   disabled={updating === app.applicationId}
//                   onClick={() => setOpen(o => !o)}
//                   className="btn-outline text-xs py-1 px-2.5 gap-1"
//                 >
//                   {updating === app.applicationId ? (
//                     <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
//                       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
//                     </svg>
//                   ) : (
//                     <>Update <ChevronDown className="w-3 h-3" /></>
//                   )}
//                 </button>
//                 {open && (
//                   <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg z-20 py-1 animate-fadeIn">
//                     {STATUS_OPTIONS.map(s => (
//                       <button key={s.value}
//                         onClick={() => { onStatusChange(app.applicationId, s.value); setOpen(false) }}
//                         className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
//                         {s.label}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Meta row */}
//           <div className="flex flex-wrap items-center gap-3 mt-2">
//             {app.jobTitle && (
//               <button onClick={() => onViewJob(app.jobId)}
//                 className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium">
//                 <Briefcase className="w-3 h-3" /> {app.jobTitle}
//                 <ArrowRight className="w-3 h-3" />
//               </button>
//             )}
//             {app.appliedAt && (
//               <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
//                 <Calendar className="w-3 h-3" /> {timeAgo(app.appliedAt)}
//               </span>
//             )}
//             {app.matchScore != null && (
//               <span className={`flex items-center gap-1 text-xs font-semibold ${matchColor(app.matchScore)}`}>
//                 <TrendingUp className="w-3 h-3" /> {Math.round(app.matchScore)}% match
//               </span>
//             )}
//           </div>

//           {/* Skills */}
//           {app.skills && (
//             <div className="flex flex-wrap gap-1.5 mt-2">
//               {app.skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5).map(s => (
//                 <span key={s} className="skill-tag">{s}</span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ── Main Page ──────────────────────────────────────────── */
// export default function EmployerCandidates() {
//   const { user }     = useAuth()
//   const navigate     = useNavigate()
//   const { addToast } = useToast()

//   const [allApps,   setAllApps]   = useState([])  // flat list of all apps across all jobs
//   const [jobs,      setJobs]      = useState([])
//   const [loading,   setLoading]   = useState(true)
//   const [activeTab, setActiveTab] = useState(null)
//   const [search,    setSearch]    = useState('')
//   const [jobFilter, setJobFilter] = useState('')  // filter by specific job
//   const [updating,  setUpdating]  = useState(null)

//   useEffect(() => {
//     if (!user?.profileId) return
//     // Load all jobs first, then fetch applicants for each
//     employerApi.getMyJobs(user.profileId)
//       .then(async r => {
//         const jobs = r.data || []
//         setJobs(jobs)
//         // Fetch applicants for all jobs in parallel
//         const results = await Promise.allSettled(
//           jobs.map(j =>
//             employerApi.getApplicants(j.jobId)
//               .then(res => (res.data || []).map(a => ({ ...a, jobTitle: j.jobTitle, jobId: j.jobId })))
//           )
//         )
//         const flat = results
//           .filter(r => r.status === 'fulfilled')
//           .flatMap(r => r.value)
//         setAllApps(flat)
//       })
//       .catch(_err => addToast('Failed to load candidates', 'error'))
//       .finally(() => setLoading(false))
//   }, [user?.profileId])

//   const handleStatusChange = async (appId, newStatus) => {
//     setUpdating(appId)
//     try {
//       await employerApi.updateAppStatus(appId, STATUS_MAP[newStatus])
//       setAllApps(prev => prev.map(a =>
//         a.applicationId === appId ? { ...a, applicationStatus: newStatus } : a
//       ))
//       addToast('Status updated', 'success')
//     } catch (_err) {
//       addToast('Failed to update status', 'error')
//     } finally {
//       setUpdating(null)
//     }
//   }

//   const handleViewJob = (jobId) => navigate(`/employer/jobs/${jobId}/applicants`)

//   // sorted best match first
//   const sorted = useMemo(() =>
//     [...allApps].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)),
//     [allApps]
//   )

//   const filtered = useMemo(() => {
//     let list = sorted
//     if (activeTab !== null) list = list.filter(a => a.applicationStatus === activeTab)
//     if (jobFilter)          list = list.filter(a => String(a.jobId) === jobFilter)
//     if (search) {
//       const q = search.toLowerCase()
//       list = list.filter(a =>
//         a.applicantName?.toLowerCase().includes(q) ||
//         a.fullName?.toLowerCase().includes(q)      ||
//         a.email?.toLowerCase().includes(q)         ||
//         a.skills?.toLowerCase().includes(q)
//       )
//     }
//     return list
//   }, [sorted, activeTab, jobFilter, search])

//   // counts per status tab
//   const counts = STATUS_TABS.reduce((acc, t) => {
//     const base = jobFilter ? sorted.filter(a => String(a.jobId) === jobFilter) : sorted
//     acc[t.value] = t.value === null ? base.length : base.filter(a => a.applicationStatus === t.value).length
//     return acc
//   }, {})

//   // stats
//   const shortlisted = allApps.filter(a => a.applicationStatus === 2).length
//   const accepted    = allApps.filter(a => a.applicationStatus === 4).length
//   const avgMatch    = allApps.length
//     ? Math.round(allApps.reduce((s, a) => s + (a.matchScore ?? 0), 0) / allApps.length)
//     : 0

//   return (
//     <div className="animate-fadeIn space-y-5">

//       {/* Header */}
//       <div>
//         <div className="flex items-center gap-2 mb-1">
//           <Users className="w-5 h-5 text-brand-600" />
//           <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">Candidates</h1>
//         </div>
//         <p className="text-sm text-slate-500 dark:text-slate-400">
//           All applicants across your job listings, sorted by match score.
//         </p>
//       </div>

//       {/* Stats row */}
//       {!loading && allApps.length > 0 && (
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           {[
//             { label: 'Total',       value: allApps.length, color: 'text-brand-600 dark:text-brand-400',   bg: 'bg-brand-50 dark:bg-brand-500/10'   },
//             { label: 'Shortlisted', value: shortlisted,    color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' },
//             { label: 'Accepted',    value: accepted,       color: 'text-emerald-600 dark:text-emerald-400',bg:'bg-emerald-50 dark:bg-emerald-500/10'},
//             { label: 'Avg Match',   value: `${avgMatch}%`, color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/10'   },
//           ].map(s => (
//             <div key={s.label} className="card py-3 text-center">
//               <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
//               <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Filters row */}
//       {!loading && allApps.length > 0 && (
//         <div className="flex flex-wrap gap-3 items-center">
//           {/* Search */}
//           <div className="relative flex-1 min-w-48">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search name, email, skills…"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               className="input pl-9 py-2 text-sm"
//             />
//             {search && (
//               <button onClick={() => setSearch('')}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//                 <X className="w-3.5 h-3.5" />
//               </button>
//             )}
//           </div>

//           {/* Job filter */}
//           <select
//             value={jobFilter}
//             onChange={e => setJobFilter(e.target.value)}
//             className="input py-2 text-sm w-auto min-w-40"
//           >
//             <option value="">All jobs</option>
//             {jobs.map(j => (
//               <option key={j.jobId} value={String(j.jobId)}>{j.jobTitle}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Status tabs */}
//       {!loading && allApps.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           {STATUS_TABS.map(t => (
//             <button key={String(t.value)} onClick={() => setActiveTab(t.value)}
//               className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
//                 activeTab === t.value
//                   ? 'bg-brand-600 text-white border-brand-600'
//                   : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500'
//               }`}>
//               {t.label}
//               {counts[t.value] > 0 && (
//                 <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
//                   activeTab === t.value
//                     ? 'bg-white/20 text-white'
//                     : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
//                 }`}>{counts[t.value]}</span>
//               )}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Results count */}
//       {!loading && allApps.length > 0 && (search || jobFilter || activeTab !== null) && (
//         <p className="text-xs text-slate-400 dark:text-slate-500">
//           Showing {filtered.length} of {allApps.length} candidate{allApps.length !== 1 ? 's' : ''}
//         </p>
//       )}

//       {/* Candidate list */}
//       {loading ? (
//         <div className="space-y-3">
//           {Array(5).fill(0).map((_, i) => <AppCardSkeleton key={i} />)}
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="card text-center py-14 border-dashed border-2 border-slate-200 dark:border-slate-700">
//           <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
//           <p className="font-display font-semibold text-slate-700 dark:text-slate-300 mb-1">
//             {allApps.length === 0 ? 'No applications yet' : 'No candidates match your filters'}
//           </p>
//           <p className="text-sm text-slate-400 dark:text-slate-500">
//             {allApps.length === 0
//               ? 'Share your job listings to start receiving applications'
//               : 'Try clearing your filters'}
//           </p>
//           {(search || jobFilter || activeTab !== null) && (
//             <button
//               onClick={() => { setSearch(''); setJobFilter(''); setActiveTab(null) }}
//               className="btn-outline mt-4 inline-flex"
//             >
//               <X className="w-4 h-4" /> Clear filters
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map(app => (
//             <CandidateCard
//               key={`${app.applicationId}-${app.jobId}`}
//               app={app}
//               onStatusChange={handleStatusChange}
//               updating={updating}
//               onViewJob={handleViewJob}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { employerApi } from '../../api'
import { useToast } from '../../context/ToastContext'
import { AppCardSkeleton } from '../../components/shared/Skeleton'
import { Users, Search, X, ChevronDown } from 'lucide-react'

const STATUS_TABS = [
  { label: 'All',         value: null },
  { label: 'New',         value: 0    },
  { label: 'Shortlisted', value: 2    },
  { label: 'Interview',   value: 1    },
  { label: 'Rejected',    value: 3    },
  { label: 'Accepted',    value: 4    },
]
const STATUS_OPTIONS = [
  { value: 1, label: 'Interview'  },
  { value: 2, label: 'Shortlist'  },
  { value: 3, label: 'Rejected'   },
  { value: 4, label: 'Accepted'   },
]
const STATUS_MAP = { 1: 'Reviewed', 2: 'Shortlisted', 3: 'Rejected', 4: 'Accepted' }

const AVATAR_COLORS = [
  'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
]
const avatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

const jobDotColor = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'active')   return 'bg-emerald-500'
  if (s === 'paused')   return 'bg-amber-400'
  return 'bg-slate-400'
}

/* ── Left panel: job card ───────────────────────────────── */
function JobCard({ job, apps, isSelected, onClick }) {
  const newCount    = apps.filter(a => a.applicationStatus === 0).length
  const shortlisted = apps.filter(a => a.applicationStatus === 2).length
  const interviewed = apps.filter(a => a.applicationStatus === 1).length
  const other       = apps.length - newCount - shortlisted - interviewed
  const avgMatch    = apps.length
    ? Math.round(apps.reduce((s, a) => s + (a.matchScore ?? 0), 0) / apps.length)
    : null

  return (
    <button onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all duration-200 ${
        isSelected
          ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
      }`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-semibold text-sm leading-snug text-slate-900 dark:text-slate-100">
          {job.jobTitle}
        </span>
        {newCount > 0 && (
          <span className="flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-white">
            +{newCount}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className={`w-1.5 h-1.5 rounded-full ${jobDotColor(job.status)}`} />
        <span className="text-xs font-medium tracking-wide text-slate-400 dark:text-slate-500">
          {(job.status || 'ACTIVE').toUpperCase()}
        </span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {apps.length} applicant{apps.length !== 1 ? 's' : ''}
        </span>
        {avgMatch != null && (
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            avg <span className="text-brand-600 dark:text-brand-400">{avgMatch}%</span>
          </span>
        )}
      </div>
      {apps.length > 0 && (
        <div className="flex h-1 rounded-full overflow-hidden gap-px mb-2">
          {newCount    > 0 && <div className="bg-blue-400 rounded-full"    style={{ flex: newCount    }} />}
          {shortlisted > 0 && <div className="bg-purple-400 rounded-full" style={{ flex: shortlisted }} />}
          {interviewed > 0 && <div className="bg-emerald-400 rounded-full"style={{ flex: interviewed }} />}
          {other       > 0 && <div className="bg-slate-200 dark:bg-slate-600 rounded-full" style={{ flex: other }} />}
        </div>
      )}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        {[
          newCount    > 0 && `${newCount} new`,
          shortlisted > 0 && `${shortlisted} shortlisted`,
          interviewed > 0 && `${interviewed} interview`,
        ].filter(Boolean).join(' · ') || 'No applicants yet'}
      </p>
    </button>
  )
}

/* ── Right panel: candidate card ───────────────────────── */
function CandidateCard({ app, onStatusChange, updating }) {
  const [open, setOpen] = useState(false)
  const initials  = (app.applicantName || app.fullName || '?')[0].toUpperCase()
  const avatarCls = avatarColor(app.applicantName || app.fullName || '')

  const statusLabel =
    app.applicationStatus === 0 ? 'New'
    : app.applicationStatus === 1 ? 'Interview'
    : app.applicationStatus === 2 ? 'Shortlisted'
    : app.applicationStatus === 3 ? 'Rejected'
    : app.applicationStatus === 4 ? 'Accepted'
    : 'Applied'

  useEffect(() => {
    if (!open) return
    const h = () => setOpen(false)
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 hover:shadow-md transition-shadow">
      {app.appliedAt && (
        <p className="text-[10px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3">
          Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      )}
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-bold ${avatarCls}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                {app.applicantName || app.fullName || 'Applicant'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {app.email || ''}
              </p>
            </div>
            {app.matchScore != null && (
              <div className="text-right flex-shrink-0">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">
                  {Math.round(app.matchScore)}
                  <span className="text-sm font-semibold text-slate-400">%</span>
                </span>
                <p className="text-[10px] tracking-widest font-semibold text-slate-400 uppercase">Match</p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 my-2.5" />

          {app.skills && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {app.skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5).map(s => (
                <span key={s} className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              app.applicationStatus === 0 ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
              : app.applicationStatus === 2 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : app.applicationStatus === 4 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : app.applicationStatus === 3 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            }`}>
              {statusLabel}
            </span>

            <div className="flex items-center gap-1.5 ml-auto">
              {app.applicationStatus !== 2 && (
                <button
                  disabled={updating === app.applicationId}
                  onClick={() => onStatusChange(app.applicationId, 2)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-white transition-colors">
                  Shortlist
                </button>
              )}
              <div className="relative flex" onMouseDown={e => e.stopPropagation()}>
                <button
                  disabled={updating === app.applicationId}
                  onClick={() => onStatusChange(app.applicationId, 1)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-l-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors">
                  {updating === app.applicationId
                    ? <svg className="animate-spin w-3 h-3 mx-2" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/></svg>
                    : 'Interview'
                  }
                </button>
                <button onClick={() => setOpen(o => !o)}
                  className="px-1.5 py-1.5 text-xs font-semibold rounded-r-xl bg-amber-500 hover:bg-amber-600 text-white border-l border-amber-600 transition-colors">
                  <ChevronDown className="w-3 h-3" />
                </button>
                {open && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl z-20 py-1 animate-fadeIn">
                    {STATUS_OPTIONS.map(s => (
                      <button key={s.value}
                        onClick={() => { onStatusChange(app.applicationId, s.value); setOpen(false) }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────────── */
export default function EmployerCandidates() {
  const { user }     = useAuth()
  const { addToast } = useToast()

  const [allApps,     setAllApps]     = useState([])
  const [jobs,        setJobs]        = useState([])
  const [loading,     setLoading]     = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [activeTab,   setActiveTab]   = useState(null)
  const [search,      setSearch]      = useState('')
  const [updating,    setUpdating]    = useState(null)

  useEffect(() => {
    if (!user?.profileId) return
    employerApi.getMyJobs(user.profileId)
      .then(async r => {
        const jobs = r.data || []
        setJobs(jobs)
        const results = await Promise.allSettled(
          jobs.map(j =>
            employerApi.getApplicants(j.jobId)
              .then(res => (res.data || []).map(a => ({ ...a, jobTitle: j.jobTitle, jobId: j.jobId })))
          )
        )
        const flat = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value)
        setAllApps(flat)
        if (jobs.length > 0) setSelectedJob(jobs[0])
      })
      .catch(_err => addToast('Failed to load candidates', 'error'))
      .finally(() => setLoading(false))
  }, [user?.profileId])

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId)
    try {
      await employerApi.updateAppStatus(appId, STATUS_MAP[newStatus])
      setAllApps(prev => prev.map(a =>
        a.applicationId === appId ? { ...a, applicationStatus: newStatus } : a
      ))
      addToast('Status updated', 'success')
    } catch (_err) {
      addToast('Failed to update status', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const appsByJob = useMemo(() => {
    const map = {}
    for (const job of jobs) map[job.jobId] = allApps.filter(a => a.jobId === job.jobId)
    return map
  }, [allApps, jobs])

  const jobApps = useMemo(() =>
    selectedJob
      ? [...allApps.filter(a => a.jobId === selectedJob.jobId)]
          .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      : [],
    [allApps, selectedJob]
  )

  const filteredApps = useMemo(() => {
    let list = jobApps
    if (activeTab !== null) list = list.filter(a => a.applicationStatus === activeTab)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.applicantName?.toLowerCase().includes(q) ||
        a.fullName?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.skills?.toLowerCase().includes(q)
      )
    }
    return list
  }, [jobApps, activeTab, search])

  const tabCounts = useMemo(() =>
    STATUS_TABS.reduce((acc, t) => {
      acc[t.value] = t.value === null
        ? jobApps.length
        : jobApps.filter(a => a.applicationStatus === t.value).length
      return acc
    }, {}),
    [jobApps]
  )

  const avgMatch = jobApps.length
    ? Math.round(jobApps.reduce((s, a) => s + (a.matchScore ?? 0), 0) / jobApps.length)
    : null

  if (loading) return (
    <div className="space-y-3 animate-fadeIn">
      {Array(4).fill(0).map((_, i) => <AppCardSkeleton key={i} />)}
    </div>
  )

  return (
    <div className="animate-fadeIn space-y-5">

      {/* ── Page header ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-brand-600" />
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Candidates
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Browse applicants by job listing and manage their status.
        </p>
      </div>

      {/* ── Split panel ── */}
      <div className="flex gap-5 items-start">

        {/* LEFT: Jobs list */}
        <div className="w-72 flex-shrink-0">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">
            {jobs.length} listing{jobs.length !== 1 ? 's' : ''} · select to view applicants
          </p>
          <div className="space-y-2.5">
            {jobs.length === 0 ? (
              <div className="text-center py-10 text-sm text-slate-400 dark:text-slate-500">
                No jobs posted yet
              </div>
            ) : jobs.map(job => (
              <JobCard
                key={job.jobId}
                job={job}
                apps={appsByJob[job.jobId] || []}
                isSelected={selectedJob?.jobId === job.jobId}
                onClick={() => { setSelectedJob(job); setActiveTab(null); setSearch('') }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Candidates */}
        <div className="flex-1 min-w-0">
          {!selectedJob ? (
            <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">
              Select a job to view candidates
            </div>
          ) : (
            <>
              {/* Job heading */}
              <div className="mb-5">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {selectedJob.jobTitle}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {jobApps.length} total applicant{jobApps.length !== 1 ? 's' : ''}
                  {avgMatch != null && ` · avg match ${avgMatch}%`}
                </p>

                {/* Status tabs */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {STATUS_TABS.map(t => (
                    <button key={String(t.value)} onClick={() => setActiveTab(t.value)}
                      className={`px-3.5 py-1 text-xs font-semibold rounded-full border transition-all ${
                        activeTab === t.value
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}>
                      {t.label}
                      <span className={`ml-1.5 text-xs ${activeTab === t.value ? 'opacity-70' : 'text-slate-400 dark:text-slate-500'}`}>
                        ({tabCounts[t.value]})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input type="text" placeholder="Search name, email, skills…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="input pl-9 py-2 text-sm w-full" />
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* List */}
              {filteredApps.length === 0 ? (
                <div className="bg-white dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center py-14">
                  <Users className="w-9 h-9 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {jobApps.length === 0 ? 'No applications yet' : 'No candidates match filters'}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    {jobApps.length === 0
                      ? 'Share this listing to start receiving applications'
                      : 'Try clearing your filters'}
                  </p>
                  {(search || activeTab !== null) && (
                    <button onClick={() => { setSearch(''); setActiveTab(null) }}
                      className="btn-outline mt-4 inline-flex text-sm gap-1.5">
                      <X className="w-4 h-4" /> Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApps.map(app => (
                    <CandidateCard
                      key={`${app.applicationId}-${app.jobId}`}
                      app={app}
                      onStatusChange={handleStatusChange}
                      updating={updating}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}