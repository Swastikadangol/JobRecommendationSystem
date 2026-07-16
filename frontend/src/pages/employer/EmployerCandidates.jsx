import { createPortal } from 'react-dom'
import { useEffect, useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { employerApi } from '../../api'
import { useToast } from '../../context/ToastContext'
import { CardSkeleton } from '../../components/shared/Skeleton'
import {
  Users, Search, X, ChevronDown, Briefcase,
  TrendingUp, Calendar, CirclePlus, Eye, Mail,
  Phone, BookOpen, Star, Building2, Clock, MapPin, FileText
} from 'lucide-react'
/* ─────────────────────────────────────────────────────────
   Backend statuses: Applied, Reviewed, Shortlisted, Rejected, Accepted
   ───────────────────────────────────────────────────────── */
const STATUS_TABS = [
  { label: 'All', value: null },
  { label: 'Applied', value: 'Applied' },
  { label: 'Reviewed', value: 'Reviewed' },
  { label: 'Shortlisted', value: 'Shortlisted' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Accepted', value: 'Accepted' },
]
const STATUS_OPTIONS = [
  { value: 'Reviewed', label: 'Mark Reviewed' },
  { value: 'Shortlisted', label: 'Shortlist' },
  { value: 'Rejected', label: 'Reject' },
  { value: 'Accepted', label: 'Accept' },
]
const STATUS_CLS = {
  Applied: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
  Reviewed: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
  Shortlisted: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40',
  Rejected: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40',
  Accepted: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
}

/* Normalize status — backend may return string or int */
const toStr = (s) => {
  if (!s && s !== 0) return 'Applied'
  if (typeof s === 'string' && isNaN(Number(s))) return s
  return { 0: 'Applied', 1: 'Reviewed', 2: 'Shortlisted', 3: 'Rejected', 4: 'Accepted' }[Number(s)] ?? String(s)
}

/* Avatar colors */
const GRADS = [
  'from-violet-500 to-violet-600', 'from-sky-500 to-sky-600',
  'from-emerald-500 to-emerald-600', 'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600', 'from-indigo-500 to-indigo-600',
]
const JOB_COLORS = [
  'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400',
  'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400',
  'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400',
]
const grad = (n = '') => GRADS[(n.charCodeAt(0) || 0) % GRADS.length]
const jobColor = (n = '') => JOB_COLORS[(n.charCodeAt(0) || 0) % JOB_COLORS.length]

/* ── Duration helper ────────────────────────────────────── */
function duration(start, end) {
  const s = new Date(start)
  const e = end ? new Date(end) : new Date()
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
  if (months < 1) return 'Less than a month'
  if (months < 12) return `${months} mo${months > 1 ? 's' : ''}`
  const y = Math.floor(months / 12), m = months % 12
  return `${y}y${m > 0 ? ` ${m}mo` : ''}`
}

/* ══════════════════════════════════════════════════════════
   CANDIDATE DETAIL MODAL
══════════════════════════════════════════════════════════ */
function CandidateDetailModal({ app, onClose, onStatusChange, updating }) {
  const name = app.applicantName || app.fullName || 'Applicant'
  const g = grad(name)
  const status = toStr(app.applicationStatus)
  const cls = STATUS_CLS[status] || 'bg-slate-100 text-slate-500 border-slate-200'
  const skills = (app.applicantSkills || app.skills || '').split(',').map(s => s.trim()).filter(Boolean)
  const exps = app.experiences || []

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
      }}>
      <div onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-modal dark:shadow-dark-modal w-full max-w-lg max-h-[92vh] flex flex-col animate-fadeIn overflow-hidden">

        {/* ── Hero header ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 px-6 pt-5 pb-5 flex-shrink-0">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* Close */}
          <button onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-end gap-4 relative">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0`}>
              {name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h2 className="font-display text-xl font-bold text-white truncate">{name}</h2>
              {app.applicantEmail && (
                <p className="text-slate-300 text-sm mt-0.5 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />{app.applicantEmail}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${cls}`}>
                  {status}
                </span>
                {app.matchScore != null && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <TrendingUp className="w-3 h-3" />{Math.round(app.matchScore)}% match
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* Quick info pills */}
          <div className="grid grid-cols-2 gap-2.5">
            {app.applicantPhone && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{app.applicantPhone}</p>
                </div>
              </div>
            )}
            {app.applicantEducation && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <BookOpen className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Education</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{app.applicantEducation}</p>
                </div>
              </div>
            )}
            {app.appliedAt && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Applied</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                    {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
            {app.jobTitle && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Applied for</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{app.jobTitle}</p>
                </div>
              </div>
            )}
          </div>

          {/* Match score bar */}
          {app.matchScore != null && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Match Score
                </p>
                <span className={`text-sm font-bold ${app.matchScore >= 70 ? 'text-emerald-600 dark:text-emerald-400'
                  : app.matchScore >= 40 ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-400'
                  }`}>{Math.round(app.matchScore)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${app.matchScore >= 70 ? 'bg-emerald-500'
                  : app.matchScore >= 40 ? 'bg-amber-500'
                    : 'bg-slate-400'
                  }`} style={{ width: `${Math.min(app.matchScore, 100)}%` }} />
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {app.matchScore >= 70 ? 'Strong match for this role'
                  : app.matchScore >= 40 ? 'Moderate match'
                    : 'Low match for this role'}
              </p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            </div>
          )}

          {/* ── Experience ── */}
          {exps.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                Work Experience ({exps.length})
              </p>
              <div className="space-y-3">
                {exps.map((exp, i) => (
                  <div key={exp.experienceId || i}
                    className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                    {/* dot on timeline */}
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-brand-500" />

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                            {exp.jobTitle}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3 text-brand-500 flex-shrink-0" />
                            <p className="text-xs font-medium text-brand-600 dark:text-brand-400 truncate">
                              {exp.companyName}
                            </p>
                          </div>
                        </div>
                        {!exp.endDate && (
                          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {' → '}
                          {exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            : 'Present'}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {duration(exp.startDate, exp.endDate)}
                        </p>
                      </div>

                      {exp.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
              <Briefcase className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
              <p className="text-xs text-slate-400 dark:text-slate-500">No work experience listed</p>
            </div>
          )}
        </div>

        {/* ── Footer: status actions ── */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Update Status</p>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map(opt => (
              <button key={opt.value}
                disabled={status === opt.value || updating === app.applicationId}
                onClick={() => { onStatusChange(app.applicationId, opt.value); onClose() }}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${opt.value === 'Accepted'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
                  : opt.value === 'Rejected'
                    ? 'border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : opt.value === 'Shortlisted'
                      ? 'bg-brand-600 hover:bg-brand-700 text-white border-brand-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ══════════════════════════════════════════════════════════
   LEFT PANEL — Job Card
══════════════════════════════════════════════════════════ */
function JobCard({ job, apps, isSelected, onClick }) {
  const newCount = apps.filter(a => a.applicationStatus === 'Applied').length
  const shortlisted = apps.filter(a => a.applicationStatus === 'Shortlisted').length
  const accepted = apps.filter(a => a.applicationStatus === 'Accepted').length
  const other = apps.length - newCount - shortlisted - accepted
  const avgMatch = apps.length
    ? Math.round(apps.reduce((s, a) => s + (a.matchScore ?? 0), 0) / apps.length) : null

  return (
    <button onClick={onClick}
      className={`w-full text-left rounded-2xl border transition-all duration-200 ${isSelected
        ? 'bg-brand-600 border-brand-600 shadow-lg shadow-brand-500/20'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-card'
        }`}>
      <div className="p-4">
        {/* Top */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${isSelected ? 'bg-white/20 text-white' : jobColor(job.jobTitle || '')
            }`}>
            {(job.jobTitle || '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <p className={`font-semibold text-sm leading-snug truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                }`}>{job.jobTitle}</p>
              {newCount > 0 && (
                <span className={`flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-400 text-white'
                  }`}>+{newCount}</span>
              )}
            </div>
            <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}>
              {apps.length} applicant{apps.length !== 1 ? 's' : ''}
              {avgMatch != null && ` · avg ${avgMatch}%`}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {apps.length > 0 && (
          <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5 mb-2">
            {newCount > 0 && <div className={`rounded-full ${isSelected ? 'bg-white/40' : 'bg-blue-400'}`} style={{ flex: newCount }} />}
            {shortlisted > 0 && <div className={`rounded-full ${isSelected ? 'bg-white/60' : 'bg-purple-400'}`} style={{ flex: shortlisted }} />}
            {accepted > 0 && <div className={`rounded-full ${isSelected ? 'bg-white/90' : 'bg-emerald-400'}`} style={{ flex: accepted }} />}
            {other > 0 && <div className={`rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-600'}`} style={{ flex: other }} />}
          </div>
        )}

        <p className={`text-xs ${isSelected ? 'text-white/60' : 'text-slate-400 dark:text-slate-500'}`}>
          {[
            newCount > 0 && `${newCount} new`,
            shortlisted > 0 && `${shortlisted} shortlisted`,
            accepted > 0 && `${accepted} accepted`,
          ].filter(Boolean).join(' · ') || 'No applicants yet'}
        </p>
      </div>
    </button>
  )
}

/* ══════════════════════════════════════════════════════════
   RIGHT PANEL — Candidate Row Card
══════════════════════════════════════════════════════════ */
function CandidateCard({ app, onStatusChange, updating, onView }) {
  const [open, setOpen] = useState(false)
  const name = app.applicantName || app.fullName || 'Applicant'
  const status = toStr(app.applicationStatus)
  const cls = STATUS_CLS[status] || 'bg-slate-100 text-slate-500 border-slate-200'
  const skills = (app.applicantSkills || app.skills || '').split(',').map(s => s.trim()).filter(Boolean)
  const hasExp = (app.experiences || []).length > 0

  useEffect(() => {
    if (!open) return
    const h = () => setOpen(false)
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start gap-3">

        {/* Avatar */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad(name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
          {name[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + match */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {app.appliedAt && (
                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
                {hasExp && (
                  <span className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400">
                    <Briefcase className="w-3 h-3" />
                    {(app.experiences || []).length} exp
                  </span>
                )}
              </div>
            </div>

            {/* Match score */}
            {app.matchScore != null && (
              <div className="text-right flex-shrink-0">
                <span className={`font-display text-xl font-bold leading-none ${app.matchScore >= 70 ? 'text-emerald-600 dark:text-emerald-400'
                  : app.matchScore >= 40 ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-400'
                  }`}>
                  {Math.round(app.matchScore)}<span className="text-xs font-semibold text-slate-400">%</span>
                </span>
                <p className="text-[10px] tracking-wider font-semibold text-slate-400 uppercase">Match</p>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {skills.slice(0, 4).map(s => <span key={s} className="skill-tag">{s}</span>)}
              {skills.length > 4 && (
                <span className="text-xs text-slate-400 dark:text-slate-500 self-center">+{skills.length - 4}</span>
              )}
            </div>
          )}

          {/* Status + actions */}
          <div className="border-t border-slate-100 dark:border-slate-800 mt-2.5 pt-2.5 flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${cls}`}>
              {status}
            </span>

            <div className="flex items-center gap-1.5 ml-auto">
              {/* View button */}
              <button onClick={() => onView(app)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/40 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all">
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              {/* View Resume */}
             {app.applicantResume && (
  <a
    href={`${import.meta.env.VITE_API_URL || 'https://localhost:7227'}/${app.applicantResume}`}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl 
    border border-emerald-200 dark:border-emerald-800/40 
    text-emerald-600 dark:text-emerald-400 
    hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
  >
    <FileText className="w-3.5 h-3.5" /> Resume
  </a>
)}

              {/* Shortlist quick */}
              {status !== 'Shortlisted' && status !== 'Accepted' && (
                <button
                  disabled={updating === app.applicationId}
                  onClick={() => onStatusChange(app.applicationId, 'Shortlisted')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800/40 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                  <Star className="w-3 h-3" /> Shortlist
                </button>
              )}

              {/* Dropdown */}
              <div className="relative" onMouseDown={e => e.stopPropagation()}>
                <button
                  disabled={updating === app.applicationId}
                  onClick={() => setOpen(o => !o)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-60">
                  {updating === app.applicationId
                    ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" /></svg>
                    : <>Update <ChevronDown className="w-3 h-3" /></>
                  }
                </button>
                {open && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-modal dark:shadow-dark-modal z-20 py-1 animate-fadeIn">
                    {STATUS_OPTIONS.map(s => (
                      <button key={s.value}
                        disabled={status === s.value}
                        onClick={() => { onStatusChange(app.applicationId, s.value); setOpen(false) }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
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

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function EmployerCandidates() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const location = useLocation()

  const [allApps, setAllApps] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [activeTab, setActiveTab] = useState(null)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)
  const [viewingApp, setViewingApp] = useState(null)
  const [jobSearch, setJobSearch] = useState('')

  useEffect(() => {
    if (!user?.profileId) return
    employerApi.getMyJobs(user.profileId)
      .then(async r => {
        const jobs = r.data || []
        setJobs(jobs)
        const results = await Promise.allSettled(
          jobs.map(j =>
            employerApi.getApplicants(j.jobId)
              .then(res => {
                return (res.data || []).map(a => ({
                  ...a,
                  applicationStatus: toStr(a.applicationStatus),
                  jobTitle: j.jobTitle,
                  jobId: j.jobId,
                }))
              })
              .catch(err => { throw err })
          )
        )
        const flat = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value)
        setAllApps(flat)

        if (jobs.length > 0) {
          // Preselect the job passed via navigation state (e.g. from "Candidates"
          // button on a job card), falling back to the first job.
          const targetId = location.state?.selectedJobId
          const preselected = targetId != null
            ? jobs.find(j => j.jobId === targetId)
            : null
          setSelectedJob(preselected || jobs[0])
        }
      })
      .catch(() => {
        addToast('Failed to load candidates', 'error')
      }).finally(() => setLoading(false))
  }, [user?.profileId])

  // Whenever the selected job changes (including the initial preselect from
  // navigation state), bring it into view inside the scrollable left panel —
  // important once there are enough jobs that the list scrolls internally.
  useEffect(() => {
    if (!selectedJob || loading) return
    const el = document.getElementById(`job-card-${selectedJob.jobId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedJob, loading])

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId)
    try {
      await employerApi.updateAppStatus(appId, newStatus)
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

  const filteredJobs = useMemo(() => {
    if (!jobSearch) return jobs
    const q = jobSearch.toLowerCase()
    return jobs.filter(j => j.jobTitle?.toLowerCase().includes(q))
  }, [jobs, jobSearch])

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
        (a.applicantSkills || a.skills || '').toLowerCase().includes(q)
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

  return (
    <div className="animate-fadeIn space-y-5">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-brand-600" />
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">Candidates</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Browse applicants by listing · view profiles · manage status.
        </p>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-1 space-y-3">{Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
          <div className="lg:col-span-4 space-y-3">{Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-7 gap-5 items-start">

          {/* ── LEFT: job list — pinned to viewport, scrolls independently ── */}
          <div className="lg:col-span-2 lg:sticky lg:top-5 lg:self-start lg:max-h-[calc(100vh-2.5rem)] flex flex-col">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3 flex-shrink-0">
              {jobs.length} listing{jobs.length !== 1 ? 's' : ''} · select to view
            </p>

            {jobs.length === 0 ? (
              <div className="card text-center py-10 border-dashed border-2 border-slate-200 dark:border-slate-700">
                <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">No jobs posted</p>
                <p className="text-xs text-slate-400 mb-3">Post a job to start receiving applications</p>
                <Link to="/employer/post-job" className="btn-primary inline-flex text-xs">
                  <CirclePlus className="w-3.5 h-3.5" /> Post a Job
                </Link>
              </div>
            ) : (
              <>
                {/* Job search — only really needed once the list gets long */}
                {jobs.length > 5 && (
                  <div className="relative mb-2.5 flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Search your listings…"
                      value={jobSearch} onChange={e => setJobSearch(e.target.value)}
                      className="input pl-9 py-2 text-sm w-full" />
                    {jobSearch && (
                      <button onClick={() => setJobSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-2.5 overflow-y-auto pr-1 -mr-1">
                  {filteredJobs.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">
                      No listings match "{jobSearch}"
                    </p>
                  ) : (
                    filteredJobs.map(job => (
                      <div key={job.jobId} id={`job-card-${job.jobId}`}>
                        <JobCard job={job}
                          apps={appsByJob[job.jobId] || []}
                          isSelected={selectedJob?.jobId === job.jobId}
                          onClick={() => { setSelectedJob(job); setActiveTab(null); setSearch('') }}
                        />
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── RIGHT: candidates ── */}
          <div className="lg:col-span-5">
            {!selectedJob ? (
              <div className="card text-center py-20 border-dashed border-2 border-slate-200 dark:border-slate-700">
                <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400 dark:text-slate-500">Select a job to view candidates</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Heading */}
                <div>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                      {selectedJob.jobTitle}
                    </h2>
                    {avgMatch != null && (
                      <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="w-4 h-4" /> avg {avgMatch}% match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {jobApps.length} total applicant{jobApps.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Status tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_TABS.map(t => (
                    <button key={String(t.value)} onClick={() => setActiveTab(t.value)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${activeTab === t.value
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
                        }`}>
                      {t.label}
                      <span className={`ml-1 text-xs ${activeTab === t.value ? 'opacity-70' : 'text-slate-400'}`}>
                        ({tabCounts[t.value]})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
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
                  <div className="card text-center py-12 border-dashed border-2 border-slate-200 dark:border-slate-700">
                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1 text-sm">
                      {jobApps.length === 0 ? 'No applications yet' : 'No candidates match filters'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {jobApps.length === 0 ? 'Share this listing to attract applicants' : 'Try clearing your filters'}
                    </p>
                    {(search || activeTab !== null) && (
                      <button onClick={() => { setSearch(''); setActiveTab(null) }}
                        className="btn-outline mt-3 inline-flex text-xs gap-1">
                        <X className="w-3.5 h-3.5" /> Clear filters
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
                        onView={setViewingApp}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {viewingApp && (
        <CandidateDetailModal
          app={viewingApp}
          onClose={() => setViewingApp(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  )
}