// Standalone Job Detail Panel — used inside AdminJobs.jsx
// Import: import JobDetailPanel from './AdminJobDetail'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { adminApi } from '../../api'
import { jobTypeLabel, workModeLabel } from '../../utils/helpers'
import {
  X, Building2, MapPin, DollarSign, Calendar,
  Clock, Users, TrendingUp, Briefcase, Globe,
  CircleCheck, CircleX, BookOpen, Layers
} from 'lucide-react'

function StatusBadge({ status }) {
  const map = {
    0: { label: 'Pending',  dot: 'bg-amber-400',   cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'       },
    1: { label: 'Approved', dot: 'bg-emerald-400',  cls: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40' },
    2: { label: 'Rejected', dot: 'bg-red-400',      cls: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/40' },
    Pending:  { label: 'Pending',  dot: 'bg-amber-400',  cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'        },
    Approved: { label: 'Approved', dot: 'bg-emerald-400', cls: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'},
    Rejected: { label: 'Rejected', dot: 'bg-red-400',     cls: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/40' },
  }
  const s = map[status] || { label: String(status), dot: 'bg-slate-400', cls: 'bg-slate-100 text-slate-500 border-slate-200' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function InfoPill({ icon: Icon, value, color = 'text-slate-500 dark:text-slate-400' }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${color}`} />
      <span className="text-slate-600 dark:text-slate-300">{value}</span>
    </div>,
    document.body
  )
}

export default function JobDetailPanel({ jobId, onClose, onApprove, onReject, acting }) {
  const [detail,  setDetail]  = useState(null)
  const [loading, setLoading] = useState(true)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    adminApi.getJobDetail(jobId)
      .then(r => setDetail(r.data))
      .catch(_err => {})
      .finally(() => setLoading(false))
  }, [jobId])

  const isPending = detail?.status === 'Pending' || detail?.status === 0
  const skills    = detail?.requiredSkills
    ? detail.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
    : []

  return createPortal(
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,width:'100vw',height:'100vh',backgroundColor:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'1rem'}}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col animate-fadeIn">

        {/* ── Sticky header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            </div>
            <span className="font-display font-semibold text-slate-900 dark:text-slate-100">Job Details</span>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-6 space-y-4">
              <div className="h-32 skeleton rounded-2xl" />
              <div className="grid grid-cols-3 gap-3">
                {Array(3).fill(0).map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />)}
              </div>
              <div className="h-40 skeleton rounded-xl" />
            </div>
          ) : detail ? (
            <div className="p-6 space-y-6">

              {/* ── Hero section ── */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-950 p-5">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-xl font-bold text-white leading-tight mb-1">
                        {detail.jobTitle}
                      </h2>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="text-sm font-medium">{detail.companyName || '—'}</span>
                      </div>
                    </div>
                    <StatusBadge status={detail.status} />
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    {[
                      { icon: MapPin,      val: detail.location   },
                      { icon: DollarSign,  val: detail.salaryRange},
                      { icon: Calendar,    val: detail.deadline ? `Closes ${new Date(detail.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}` : null },
                      { icon: Clock,       val: detail.postedAt   ? `Posted ${new Date(detail.postedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}` : null },
                    ].map((f, i) => f.val && (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <f.icon className="w-3.5 h-3.5 text-slate-400" />
                        {f.val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Stats row ── */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Users,      label: 'Applicants',  value: detail.totalApplicants ?? 0,          color: 'text-brand-600 dark:text-brand-400',   bg: 'bg-brand-50 dark:bg-brand-500/10'   },
                  { icon: TrendingUp, label: 'Avg Match',   value: detail.avgMatchScore != null ? `${detail.avgMatchScore}%` : '—', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10'},
                  { icon: Briefcase,  label: 'Job Type',    value: jobTypeLabel(detail.jobType),          color: 'text-violet-600 dark:text-violet-400',  bg: 'bg-violet-50 dark:bg-violet-500/10' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3.5">
                    <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <div className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">{s.value}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* ── Requirements chips ── */}
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Requirements</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: Layers,    label: 'Work Mode',  value: workModeLabel(detail.workMode)                                               },
                    { icon: Globe,     label: 'Location',   value: detail.location                                                              },
                    { icon: BookOpen,  label: 'Education',  value: detail.minimumEducationLevel ? `Min. ${detail.minimumEducationLevel}` : null  },
                    { icon: Clock,     label: 'Experience', value: detail.minYearsExperience != null ? `${detail.minYearsExperience}+ years` : null },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <f.icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{f.label}</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Required skills ── */}
              {skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Description ── */}
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Job Description</p>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line border border-slate-100 dark:border-slate-700/50">
                  {detail.jobDescription}
                </div>
              </div>

              {/* ── Employer info ── */}
              {detail.employerEmail && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Posted by</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{detail.employerEmail}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 py-20">
              <Briefcase className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p>Failed to load job details.</p>
            </div>
          )}
        </div>

        {/* ── Sticky footer actions ── */}
        {!loading && isPending && (
          <div className="flex gap-3 p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl flex-shrink-0">
            <button onClick={() => onReject(detail.jobId)} disabled={acting === detail.jobId}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl border-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-60">
              <CircleX className="w-4 h-4" /> Reject
            </button>
            <button onClick={() => onApprove(detail.jobId)} disabled={acting === detail.jobId}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-60 shadow-lg shadow-emerald-500/20">
              {acting === detail.jobId
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/></svg>
                : <><CircleCheck className="w-4 h-4" /> Approve Job</>
              }
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}