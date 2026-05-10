import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { jobSeekerApi } from '../../api'
import {
  parseSkills, jobTypeLabel, workModeLabel, educationLabel,
  formatDate, daysUntil,
  isJobExpired
} from '../../utils/helpers'
import {
  ArrowLeft, MapPin, Clock, Briefcase, GraduationCap, Calendar,
  DollarSign, Building2, CheckCircle, Send, AlertTriangle, Ban,
  Timer, Wifi, Monitor, Blend, Users, TrendingUp
} from 'lucide-react'

/* ── Badge helpers with icons ────────────────────────────────── */
const workModeMeta = {
  0: { label: 'On-site', cls: 'badge-gray',   icon: Monitor },
  1: { label: 'Remote',  cls: 'badge-green',  icon: Wifi },
  2: { label: 'Hybrid',  cls: 'badge-blue',   icon: Blend },
  OnSite: { label: 'On-site', cls: 'badge-gray',  icon: Monitor },
  Remote: { label: 'Remote',  cls: 'badge-green', icon: Wifi },
  Hybrid: { label: 'Hybrid',  cls: 'badge-blue',  icon: Blend },
}
const jobTypeMeta = {
  0: { label: 'Full-time',   cls: 'badge-purple', icon: Timer },
  1: { label: 'Part-time',   cls: 'badge-yellow', icon: Clock },
  2: { label: 'Internship',  cls: 'badge-blue',   icon: Briefcase },
  FullTime:   { label: 'Full-time',  cls: 'badge-purple', icon: Timer },
  PartTime:   { label: 'Part-time',  cls: 'badge-yellow', icon: Clock },
  Internship: { label: 'Internship', cls: 'badge-blue',   icon: Briefcase },
}

function TypeBadge({ val }) {
  const m = jobTypeMeta[val] ?? { label: val, cls: 'badge-gray', icon: Briefcase }
  return <span className={m.cls}><m.icon className="w-3 h-3" /> {m.label}</span>
}
function ModeBadge({ val }) {
  const m = workModeMeta[val] ?? { label: val, cls: 'badge-gray', icon: Monitor }
  return <span className={m.cls}><m.icon className="w-3 h-3" /> {m.label}</span>
}

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    jobSeekerApi.getApprovedJobs()
      .then(r => {
        const found = (r.data || []).find(j => j.jobId === parseInt(id))
        setJob(found || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    if (user?.profileId) {
      jobSeekerApi.getApplications(user.profileId)
        .then(r => {
          const apps = r.data?.data || []
          setApplied(apps.some(a => a.jobId === parseInt(id)))
        })
        .catch(() => {})
    }
  }, [id, user?.profileId])

  const handleApply = async () => {
    if (!user?.profileId) { addToast('Please login to apply', 'error'); return }
    if (isJobExpired(job?.deadline)) { addToast('This job has expired', 'error'); return }
    setApplying(true)
    try {
      const res = await jobSeekerApi.apply({ jobSeekerId: user.profileId, jobId: parseInt(id) })
      setApplied(true)
      addToast(`Applied! Match score: ${Math.round(res.data.matchScore)}%`, 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not apply', 'error')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-fadeIn space-y-4 max-w-4xl mx-auto">
        <div className="skeleton h-5 w-24 rounded" />
        <div className="card space-y-4">
          <div className="flex gap-4">
            <div className="skeleton w-16 h-16 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-7 rounded w-1/2" />
              <div className="skeleton h-4 rounded w-1/3" />
            </div>
          </div>
          <div className="flex gap-2">
            {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-7 rounded-full w-24" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <p style={{ color: 'var(--ink-muted)' }} className="mb-4">Job not found.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">Go back</button>
      </div>
    )
  }

  const skills  = parseSkills(job.requiredSkills)
  const deadline = daysUntil(job.deadline)
  const expired  = isJobExpired(job.deadline)
  const urgentSoon = !expired && deadline !== null && deadline <= 5

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: 'var(--ink-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}>
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </button>

      {/* Expired banner */}
      {expired && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <Ban className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">This job has expired and is no longer accepting applications.</p>
        </div>
      )}

      {/* Hero card */}
      <div className="card">
        <div className="flex items-start gap-5 mb-5">
          {/* Company logo */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
            <Building2 className="w-7 h-7" style={{ color: 'var(--ink-muted)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="font-display text-2xl font-bold leading-tight" style={{ color: 'var(--ink)' }}>
                  {job.jobTitle}
                </h1>
                <p className="text-base mt-1 font-medium" style={{ color: 'var(--ink-muted)' }}>
                  {job.companyName || 'Company'}
                </p>
              </div>
              {urgentSoon && !expired && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 font-medium flex-shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {deadline === 0 ? 'Closes today' : `${deadline}d left`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Meta row — badges like reference screenshot */}
        <div className="flex flex-wrap items-center gap-2 pb-5 mb-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <TypeBadge val={job.jobType} />
          <ModeBadge val={job.workMode} />
          {job.location && (
            <span className="badge badge-gray">
              <MapPin className="w-3 h-3" /> {job.location}
            </span>
          )}
          {job.minYearsExperience != null && (
            <span className="badge badge-gray">
              <TrendingUp className="w-3 h-3" /> {job.minYearsExperience}+ yrs exp
            </span>
          )}
          {job.salaryRange && (
            <span className="badge badge-gray">
              <DollarSign className="w-3 h-3" /> {job.salaryRange}
            </span>
          )}
          {job.deadline && (
            <span className={`badge ${expired ? 'badge-red' : 'badge-gray'}`}>
              <Calendar className="w-3 h-3" />
              {expired ? 'Expired' : `Apply before: ${formatDate(job.deadline)}`}
            </span>
          )}
        </div>

        {/* Apply button */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleApply}
            disabled={applied || applying || expired}
            className={`btn-primary py-2.5 px-7 text-base font-semibold ${
              applied ? '!bg-emerald-600 hover:!bg-emerald-600' :
              expired ? '!bg-slate-200 !text-slate-400 !cursor-not-allowed dark:!bg-slate-700 dark:!text-slate-500' : ''
            }`}
          >
            {applying ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                </svg>
                Applying…
              </span>
            ) : applied ? (
              <><CheckCircle className="w-4 h-4" /> Applied</>
            ) : expired ? (
              <><Ban className="w-4 h-4" /> Expired</>
            ) : (
              <><Send className="w-4 h-4" /> Apply now</>
            )}
          </button>
          {applied && (
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              ✓ Your application has been submitted
            </p>
          )}
        </div>
      </div>

      {/* Body — 2 col layout */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Left: description + skills */}
        <div className="md:col-span-2 space-y-5">
          {job.jobDescription && (
            <div className="card">
              <h2 className="font-display font-semibold mb-4" style={{ color: 'var(--ink)', fontSize: '1.05rem' }}>
                Job Description
              </h2>
              <div className="space-y-2">
                {job.jobDescription.split('\n').filter(Boolean).map((line, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>{line}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Skills */}
          {skills.length > 0 && (
            <div className="card">
              <h2 className="font-display font-semibold mb-4" style={{ color: 'var(--ink)', fontSize: '1.05rem' }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s}
                    className="px-3 py-1.5 rounded-xl text-sm font-medium border"
                    style={{
                      background: 'var(--bg-hover)',
                      borderColor: 'var(--border)',
                      color: 'var(--ink)',
                    }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: job details sidebar */}
        <div className="space-y-5">
          {/* Job Details */}
          <div className="card">
            <h2 className="font-display font-semibold mb-4" style={{ color: 'var(--ink)', fontSize: '1.05rem' }}>
              Job Details
            </h2>
            <div className="space-y-0 divide-y" style={{ borderColor: 'var(--border)' }}>
              {[
                { icon: Timer,        label: 'Job Type',   value: jobTypeLabel(job.jobType) },
                { icon: Wifi,         label: 'Work Mode',  value: workModeLabel(job.workMode) },
                ...(job.location ? [{ icon: MapPin, label: 'Location', value: job.location }] : []),
                ...(job.minYearsExperience != null ? [{ icon: TrendingUp, label: 'Experience', value: `${job.minYearsExperience}+ years` }] : []),
                ...(job.minimumEducationLevel != null ? [{ icon: GraduationCap, label: 'Education', value: educationLabel(job.minimumEducationLevel) }] : []),
                ...(job.salaryRange ? [{ icon: DollarSign, label: 'Salary', value: job.salaryRange }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-2" style={{ color: 'var(--ink-muted)' }}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{label}</span>
                  </div>
                  <span className="text-sm font-medium text-right" style={{ color: 'var(--ink)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company */}
          {job.companyName && (
            <div className="card">
              <h2 className="font-display font-semibold mb-3" style={{ color: 'var(--ink)', fontSize: '1.05rem' }}>
                Company
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                  <Building2 className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{job.companyName}</p>
                  {job.location && <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{job.location}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}