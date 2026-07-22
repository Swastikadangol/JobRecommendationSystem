import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { jobSeekerApi } from '../../api'
import {
  parseSkills, jobTypeLabel, workModeLabel,
  educationLabel, formatDate, daysUntil, isJobExpired
} from '../../utils/helpers'
import {
  ArrowLeft, MapPin, Clock, Briefcase, GraduationCap,
  Calendar, DollarSign, Building2, CheckCircle, Send,
  AlertTriangle, Ban, Timer, Wifi, Monitor, Blend,
  TrendingUp, Star, ChevronRight, X, Users
} from 'lucide-react'


/* ── Badge helpers ──────────────────────────────────────── */
const workModeMeta = {
  0:'OnSite', 1:'Remote', 2:'Hybrid',
  OnSite:'OnSite', Remote:'Remote', Hybrid:'Hybrid',
}
const wMeta = {
  OnSite: { label:'On-site', cls:'badge-gray',  icon:Monitor },
  Remote: { label:'Remote',  cls:'badge-green', icon:Wifi    },
  Hybrid: { label:'Hybrid',  cls:'badge-blue',  icon:Blend   },
}
const jMeta = {
  0:'FullTime', 1:'PartTime', 2:'Internship',
  FullTime:'FullTime', PartTime:'PartTime', Internship:'Internship',
}
const jMetaMap = {
  FullTime:   { label:'Full-time',  cls:'badge-purple', icon:Timer     },
  PartTime:   { label:'Part-time',  cls:'badge-yellow', icon:Clock     },
  Internship: { label:'Internship', cls:'badge-blue',   icon:Briefcase },
}
function TypeBadge({ val }) {
  const k = jMeta[val] ?? String(val)
  const m = jMetaMap[k] ?? { label:k, cls:'badge-gray', icon:Briefcase }
  return <span className={m.cls}><m.icon className="w-3 h-3" />{m.label}</span>
}
function ModeBadge({ val }) {
  const k = workModeMeta[val] ?? String(val)
  const m = wMeta[k] ?? { label:k, cls:'badge-gray', icon:Monitor }
  return <span className={m.cls}><m.icon className="w-3 h-3" />{m.label}</span>
}

/* ── Parse description into sections ───────────────────── */
function parseDesc(text) {
  if (!text) return { main:[], responsibilities:[], benefits:[] }
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const out = { main:[], responsibilities:[], benefits:[] }
  let cur = 'main'
  for (const line of lines) {
    const low = line.toLowerCase()
    if (low.startsWith('responsibilit')) { cur = 'responsibilities'; continue }
    if (low.startsWith('benefit') || low.startsWith('perk')) { cur = 'benefits'; continue }
    out[cur].push(line.replace(/^[•\-*]\s*/, ''))
  }
  return out
}

/* ── Apply Confirm Dialog ───────────────────────────────── */
function ApplyDialog({ job, onConfirm, onCancel, applying }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div style={{ position:'fixed', inset:0, width:'100vw', height:'100vh',
                  backgroundColor:'rgba(0,0,0,0.6)', display:'flex',
                  alignItems:'center', justifyContent:'center', zIndex:9999, padding:'1rem' }}
      onClick={onCancel}>
      <div onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-modal dark:shadow-dark-modal w-full max-w-sm animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100">Confirm Application</h3>
          <button onClick={onCancel}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Job preview */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-base font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
              {(job.companyName || 'C')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{job.jobTitle}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{job.companyName || 'Company'}</p>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
            Are you sure you want to apply for this position? Your profile, skills and experience will be shared with the employer.
          </p>

          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-outline flex-1 justify-center">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={applying}
              className="btn-primary flex-1 justify-center">
              {applying ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                </svg>
              ) : (
                <><Send className="w-4 h-4" /> Confirm Apply</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ── Match Analysis card (its own component so it can live in its own column) ── */
function MatchAnalysisCard({ recommendation }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-amber-500" />
        <h2 className="font-display font-semibold text-slate-900 dark:text-slate-100">
          Match Analysis
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Match Score</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${recommendation.matchScore || 0}%` }}
              />
            </div>
            <span className="font-semibold text-sm">
              {recommendation.matchScore || 0}%
            </span>
          </div>
        </div>

        {recommendation.matchedSkills?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-emerald-600 mb-2">
              Matching Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendation.matchedSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-lg text-xs bg-emerald-100 text-emerald-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {recommendation.missingSkills?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-red-600 mb-2">
              Missing Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendation.missingSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-lg text-xs bg-red-100 text-red-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {recommendation.reason && (
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">
              Why Recommended
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {recommendation.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────────── */
export default function JobDetail() {
  const { id }       = useParams()
  const { user }     = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()
  const location = useLocation()
  const recommendation = location.state

  const [job,         setJob]         = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [applying,    setApplying]    = useState(false)
  const [applied,     setApplied]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

 useEffect(() => {
  if (!user?.profileId) return;

  jobSeekerApi.getApprovedJobs(user.profileId)
    .then(r => {
      const found = (r.data || []).find(j => j.jobId === Number(id));
      setJob(found || null);
    })
    .catch(() => {})
    .finally(() => setLoading(false));

  jobSeekerApi.getApplications(user.profileId)
    .then(r => {
      const apps = r.data?.data || r.data || [];
      setApplied(apps.some(a => a.jobId === Number(id)));
    })
    .catch(() => {});
}, [id, user?.profileId]);

  const handleApply = async () => {
    setShowConfirm(false)
    if (!user?.profileId) { addToast('Please login to apply', 'error'); return }
    if (isJobExpired(job?.deadline)) { addToast('This job has expired', 'error'); return }
    setApplying(true)
    try {
      const res = await jobSeekerApi.apply({ jobSeekerId: user.profileId, jobId: parseInt(id) })
      setApplied(true)
      addToast(`Applied successfully! Match score: ${Math.round(res.data?.matchScore ?? 0)}%`, 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not apply', 'error')
    } finally {
      setApplying(false)
    }
  }

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="animate-fadeIn space-y-5 max-w-5xl">
      <div className="skeleton h-5 w-24 rounded-lg" />
      <div className="card h-56 skeleton" />
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <div className="card h-48 skeleton" />
          <div className="card h-32 skeleton" />
        </div>
        <div className="space-y-4">
          <div className="card h-48 skeleton" />
          <div className="card h-32 skeleton" />
        </div>
      </div>
    </div>
  )

  if (!job) return (
    <div className="text-center py-20 animate-fadeIn">
      <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
      <p className="text-slate-500 dark:text-slate-400 mb-4">Job not found.</p>
      <button onClick={() => navigate(-1)} className="btn-outline">← Go back</button>
    </div>
  )

  const skills   = parseSkills(job.requiredSkills)
  const deadline = daysUntil(job.deadline)
  const expired  = isJobExpired(job.deadline)
  const urgent   = !expired && deadline !== null && deadline <= 5
  const desc     = parseDesc(job.jobDescription)
  const compInit = (job.companyName || 'C')[0].toUpperCase()

  return (
    <div className="animate-fadeIn max-w-8xl space-y-5">

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to jobs
      </button>

      {/* Expired banner */}
      {expired && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <Ban className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            This job has expired and is no longer accepting applications.
          </p>
        </div>
      )}

      {/* ── Hero card ── */}
      <div className="card p-0 overflow-hidden">
        {/* Brand top bar */}
        <div className="h-1.5 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-500" />

        <div className="p-6">
          <div className="flex items-start gap-5">
            {/* Company logo */}
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-800/40 flex items-center justify-center text-2xl font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
              {compInit}
            </div>

            <div className="flex-1 min-w-0">
              {/* Title row */}
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    {job.jobTitle}
                  </h1>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {job.companyName || 'Company'}
                    </span>
                    {job.location && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5" /> {job.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Urgency pill */}
                {urgent && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-700 dark:text-amber-300 flex-shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {deadline === 0 ? 'Closes today!' : `${deadline}d left`}
                  </span>
                )}
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge val={job.jobType} />
                <ModeBadge val={job.workMode} />
                {job.salaryRange && (
                  <span className="badge badge-gray"><DollarSign className="w-3 h-3" />{job.salaryRange}</span>
                )}
                {job.minYearsExperience != null && (
                  <span className="badge badge-gray"><TrendingUp className="w-3 h-3" />{job.minYearsExperience}+ yrs exp</span>
                )}
                {job.deadline && (
                  <span className={`badge ${expired ? 'badge-red' : 'badge-gray'}`}>
                    <Calendar className="w-3 h-3" />
                    {expired ? 'Expired' : `Closes ${formatDate(job.deadline)}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider + Apply */}
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => !applied && !expired && setShowConfirm(true)}
              disabled={applied || applying || expired}
              className={`btn-primary py-2.5 px-8 text-base font-semibold ${
                applied  ? '!bg-emerald-600 hover:!bg-emerald-600'
                : expired ? 'opacity-40 cursor-not-allowed' : ''
              }`}>
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
                <><Send className="w-4 h-4" /> Apply Now</>
              )}
            </button>

            {applied && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Application submitted successfully
              </p>
            )}
          </div>
        </div>
      </div>

      {/*
        ── Body grid ──────────────────────────────────────────
        md:  2-col main content | 1-col sidebar (extra column wraps below)
        xl:  2-col main content | 1-col sidebar (Apply/Job Details/Company)
             | 1-col right column (Match Analysis + Tip)
        This puts Match Analysis and the Tip card in their own column
        to the right of Job Details on wide screens.
      */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">

        {/* ── LEFT: content ── */}
        <div className="md:col-span-2 xl:col-span-2 space-y-5">

          {/* About the role */}
          {desc.main.length > 0 && (
            <div className="card">
              <h2 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-4">
                About the Role
              </h2>
              <div className="space-y-3">
                {desc.main.map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {desc.responsibilities.length > 0 && (
            <div className="card">
              <h2 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Key Responsibilities
              </h2>
              <div className="space-y-2.5">
                {desc.responsibilities.map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {desc.benefits.length > 0 && (
            <div className="card">
              <h2 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Perks & Benefits
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {desc.benefits.map((line, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
                    <Star className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="card">
              <h2 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s}
                    className="px-3 py-1.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {(job.minimumEducationLevel != null || job.minYearsExperience != null) && (
            <div className="card">
              <h2 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Minimum Requirements
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {job.minYearsExperience != null && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Experience</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{job.minYearsExperience}+ years</p>
                    </div>
                  </div>
                )}
                {job.minimumEducationLevel != null && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Education</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{educationLabel(job.minimumEducationLevel)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── MIDDLE: sidebar (job details, company) ── */}
        <div className="space-y-5">

          {/* Apply CTA card */}
          {!applied && !expired && (
            <div className="card bg-gradient-to-br from-brand-50 to-slate-50 dark:from-brand-500/10 dark:to-slate-800/30 border-brand-100 dark:border-brand-800/40">
              <div className="flex items-center gap-2 mb-1">
                <Send className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <p className="text-sm font-semibold text-brand-800 dark:text-brand-200">Ready to apply?</p>
              </div>
              <p className="text-xs text-brand-600 dark:text-brand-400 mb-4">
                {deadline != null && deadline > 0
                  ? `${deadline} day${deadline !== 1 ? 's' : ''} left to apply`
                  : deadline === 0 ? 'Last day to apply!'
                  : 'Application open'}
              </p>
              <button onClick={() => setShowConfirm(true)} disabled={applying}
                className="btn-primary w-full justify-center py-2.5">
                <Send className="w-4 h-4" /> Apply Now
              </button>
            </div>
          )}

          {applied && (
            <div className="card bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/40">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Application Submitted</p>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                Your application has been sent to the employer.
              </p>
            </div>
          )}

          {/* Job details */}
          <div className="card">
            <h2 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-4">Job Details</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { icon:Timer,        label:'Job Type',    value:jobTypeLabel(job.jobType)                                                          },
                { icon:Wifi,         label:'Work Mode',   value:workModeLabel(job.workMode)                                                        },
                job.location     && { icon:MapPin,        label:'Location',    value:job.location                                                  },
                job.salaryRange  && { icon:DollarSign,    label:'Salary',      value:job.salaryRange                                               },
                job.minYearsExperience != null && { icon:TrendingUp, label:'Experience', value:`${job.minYearsExperience}+ years`                  },
                job.minimumEducationLevel != null && { icon:GraduationCap, label:'Education', value:educationLabel(job.minimumEducationLevel)      },
                job.deadline     && { icon:Calendar,      label:'Deadline',    value:formatDate(job.deadline)                                      },
                job.postedAt     && { icon:Clock,         label:'Posted',      value:formatDate(job.postedAt)                                      },
              ].filter(Boolean).map(({ icon:Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs">{label}</span>
                  </div>
                  <span className="text-xs font-semibold text-right text-slate-800 dark:text-slate-200 max-w-[60%] truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company card */}
          {job.companyName && (
            <div className="card">
              <h2 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-3">About the Company</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-800/40 flex items-center justify-center text-lg font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
                  {compInit}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{job.companyName}</p>
                  {job.location && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        

      </div>

      {/* Apply confirm dialog */}
      {showConfirm && (
        <ApplyDialog
          job={job}
          onConfirm={handleApply}
          onCancel={() => setShowConfirm(false)}
          applying={applying}
        />
      )}
    </div>
  )
}