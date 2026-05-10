import { useNavigate } from 'react-router-dom'
import {
  Clock, Briefcase, TrendingUp, Users, Edit2, XCircle, CheckCircle,
  Ban, AlertTriangle, Wifi, Monitor, Blend, Timer, DollarSign, Building2, MapPin
} from 'lucide-react'
import { jobTypeLabel, workModeLabel, parseSkills, timeAgo, matchColor, daysUntil, isJobExpired } from '../../utils/helpers'

/* ── Badge meta with icons ── */
const workModeMeta = {
  0: { cls: 'badge-gray',   icon: Monitor }, OnSite: { cls: 'badge-gray',   icon: Monitor },
  1: { cls: 'badge-green',  icon: Wifi    }, Remote: { cls: 'badge-green',  icon: Wifi    },
  2: { cls: 'badge-blue',   icon: Blend   }, Hybrid: { cls: 'badge-blue',   icon: Blend   },
}
const jobTypeMeta = {
  0: { cls: 'badge-purple', icon: Timer    }, FullTime:   { cls: 'badge-purple', icon: Timer    },
  1: { cls: 'badge-yellow', icon: Clock    }, PartTime:   { cls: 'badge-yellow', icon: Clock    },
  2: { cls: 'badge-blue',   icon: Briefcase}, Internship: { cls: 'badge-blue',   icon: Briefcase},
}
const statusMeta = {
  0: { cls: 'badge-yellow', label: 'Pending'  }, Pending:  { cls: 'badge-yellow', label: 'Pending'  },
  1: { cls: 'badge-green',  label: 'Approved' }, Approved: { cls: 'badge-green',  label: 'Approved' },
  2: { cls: 'badge-red',    label: 'Rejected' }, Rejected: { cls: 'badge-red',    label: 'Rejected' },
  3: { cls: 'badge-gray',   label: 'Closed'   }, Closed:   { cls: 'badge-gray',   label: 'Closed'   },
}

function TypeBadge({ val }) {
  const m = jobTypeMeta[val] ?? { cls: 'badge-gray', icon: Briefcase }
  return <span className={m.cls}><m.icon className="w-3 h-3" />{jobTypeLabel(val)}</span>
}
function ModeBadge({ val }) {
  const m = workModeMeta[val] ?? { cls: 'badge-gray', icon: Monitor }
  return <span className={m.cls}><m.icon className="w-3 h-3" />{workModeLabel(val)}</span>
}

/* ════════════ JOBSEEKER CARD ════════════ */
function JobSeekerCard({ job, showMatch }) {
  const navigate   = useNavigate()
  const skills     = parseSkills(job.requiredSkills)
  const expired    = isJobExpired(job.deadline)
  const days       = daysUntil(job.deadline)
  const urgentSoon = !expired && days !== null && days <= 5

  return (
    <div
      className={`card-hover flex flex-col gap-3 animate-fadeIn ${expired ? 'opacity-60' : ''}`}
      onClick={() => navigate(`/jobs/${job.jobId}`)}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-base text-slate-900 dark:text-slate-100 leading-snug truncate">{job.jobTitle}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{job.companyName || 'Company'}</p>
        </div>
        {/* Large match score (Recommendations page) */}
        {showMatch && job.matchScore !== undefined && !expired && (
          <div className="flex-shrink-0 text-right">
            <div className={`font-display font-bold text-xl leading-none ${matchColor(job.matchScore)}`}>{Math.round(job.matchScore)}%</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-0.5 justify-end"><TrendingUp className="w-3 h-3" />match</div>
          </div>
        )}
        {/* Small match score (Browse page) */}
        {!showMatch && job.matchScore > 0 && !expired && (
          <span className={`flex-shrink-0 text-xs font-semibold ${matchColor(job.matchScore)}`}>{Math.round(job.matchScore)}%</span>
        )}
        {expired && <span className="badge badge-red flex-shrink-0"><Ban className="w-3 h-3" />Expired</span>}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <TypeBadge val={job.jobType} />
        <ModeBadge val={job.workMode} />
        {job.location && (
          <span className="badge badge-gray"><MapPin className="w-3 h-3" />{job.location}</span>
        )}
        {job.salaryRange && (
          <span className="badge badge-gray"><DollarSign className="w-3 h-3" />{job.salaryRange}</span>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 5).map(s => <span key={s} className="skill-tag">{s}</span>)}
          {skills.length > 5 && <span className="skill-tag text-slate-400 dark:text-slate-500">+{skills.length - 5}</span>}
        </div>
      )}

      {/* Footer — posted LEFT, deadline RIGHT */}
      <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Clock className="w-3 h-3" />{timeAgo(job.postedAt)}
        </span>
        {expired ? (
          <span className="text-xs font-medium text-red-400">Closed</span>
        ) : urgentSoon ? (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
            <AlertTriangle className="w-3 h-3" />{days === 0 ? 'Today' : `${days}d left`}
          </span>
        ) : job.deadline ? (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Closes {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/* ════════════ EMPLOYER CARD ════════════ */
function EmployerCard({ job, onEdit, onClose, onViewCandidates }) {
  const expired  = isJobExpired(job.deadline)
  const isActive = job.isActive !== false && !expired
  return (
    <div className="card flex flex-col gap-3 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-base text-slate-900 dark:text-slate-100 truncate">{job.jobTitle}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Posted {timeAgo(job.postedAt)}{job.deadline && ` · Closes ${new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}</p>
        </div>
        <span className={`badge flex-shrink-0 ${isActive ? 'badge-green' : 'badge-gray'}`}>{expired ? 'Expired' : isActive ? 'Active' : 'Closed'}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <TypeBadge val={job.jobType} /><ModeBadge val={job.workMode} />
        {job.location && <span className="badge badge-gray"><MapPin className="w-3 h-3" />{job.location}</span>}
      </div>
      <div className="flex items-center gap-6 py-3 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
        <div className="text-center">
          <div className="font-display font-bold text-slate-900 dark:text-slate-100 text-xl">{job.applicantCount ?? 0}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Applicants</div>
        </div>
        {job.avgMatchScore !== undefined && (
          <div className="text-center">
            <div className={`font-display font-bold text-xl ${matchColor(job.avgMatchScore)}`}>{Math.round(job.avgMatchScore)}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Avg match</div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {onEdit && <button onClick={() => onEdit(job)} className="btn-outline flex-1 justify-center text-xs py-2"><Edit2 className="w-3.5 h-3.5" />Edit</button>}
        {onViewCandidates && <button onClick={() => onViewCandidates(job)} className="btn-primary flex-1 justify-center text-xs py-2"><Users className="w-3.5 h-3.5" />Candidates</button>}
        {onClose && !expired && <button onClick={() => onClose(job)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><XCircle className="w-4 h-4" /></button>}
      </div>
    </div>
  )
}

/* ════════════ ADMIN CARD ════════════ */
function AdminCard({ job, onApprove, onReject }) {
  const skills    = parseSkills(job.requiredSkills)
  const expired   = isJobExpired(job.deadline)
  const cfg       = statusMeta[job.jobStatus] ?? { cls: 'badge-gray', label: 'Unknown' }
  const isPending = job.jobStatus === 0 || job.jobStatus === 'Pending'
  return (
    <div className="card flex flex-col gap-3 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-base text-slate-900 dark:text-slate-100 truncate">{job.jobTitle}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{job.companyName}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Posted {timeAgo(job.postedAt)}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={cfg.cls}>{cfg.label}</span>
          {expired && <span className="badge badge-red"><Ban className="w-3 h-3" />Expired</span>}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <TypeBadge val={job.jobType} /><ModeBadge val={job.workMode} />
        {job.location && <span className="badge badge-gray"><MapPin className="w-3 h-3" />{job.location}</span>}
        {job.salaryRange && <span className="badge badge-gray"><DollarSign className="w-3 h-3" />{job.salaryRange}</span>}
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map(s => <span key={s} className="skill-tag">{s}</span>)}
          {skills.length > 4 && <span className="skill-tag text-slate-400 dark:text-slate-500">+{skills.length - 4}</span>}
        </div>
      )}
      {isPending && (
        <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button onClick={() => onApprove?.(job)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
            <CheckCircle className="w-3.5 h-3.5" />Approve
          </button>
          <button onClick={() => onReject?.(job)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30">
            <XCircle className="w-3.5 h-3.5" />Reject
          </button>
        </div>
      )}
    </div>
  )
}

export default function JobCard({ job, role = 'JobSeeker', showMatch = false, onApprove, onReject, onEdit, onClose, onViewCandidates }) {
  if (role === 'Employer') return <EmployerCard job={job} onEdit={onEdit} onClose={onClose} onViewCandidates={onViewCandidates} />
  if (role === 'Admin')    return <AdminCard job={job} onApprove={onApprove} onReject={onReject} />
  return <JobSeekerCard job={job} showMatch={showMatch} />
}