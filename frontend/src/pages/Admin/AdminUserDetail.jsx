// Standalone User Detail Panel — used inside AdminUsers.jsx
// Import: import UserDetailModal from './AdminUserDetail'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { adminApi } from '../../api'
import {
  X, Mail, Phone, User, Building2, BookOpen,
  Briefcase, Calendar, Globe, MapPin, TrendingUp,
  FileText, ShieldCheck, Clock
} from 'lucide-react'

const STATUS_CLS = {
  Applied:     'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  Reviewed:    'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  Shortlisted: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  Rejected:    'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  Accepted:    'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
}
const APP_STATUS = { 0:'Applied', 1:'Reviewed', 2:'Shortlisted', 3:'Rejected', 4:'Accepted' }
const JOB_STATUS = { 0:'Pending', 1:'Approved', 2:'Rejected', Pending:'Pending', Approved:'Approved', Rejected:'Rejected' }
const JOB_STATUS_CLS = {
  Pending:  'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  Approved: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  Rejected: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
}

function Tab({ label, active, onClick, count }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
        active
          ? 'border-brand-600 text-brand-600 dark:text-brand-400'
          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
      }`}>
      {label}
      {count != null && (
        <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
          active ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
        }`}>{count}</span>
      )}
    </button>
  )
}

export default function UserDetailModal({ userId, onClose }) {
  const [detail,  setDetail]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('profile')

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    adminApi.getUserDetail(userId)
      .then(r => setDetail(r.data))
      .catch(_err => {})
      .finally(() => setLoading(false))
  }, [userId])

  const isJobSeeker = detail?.role === 0 || detail?.role === 'JobSeeker'
  const isEmployer  = detail?.role === 1 || detail?.role === 'Employer'
  const isAdmin     = detail?.role === 2 || detail?.role === 'Admin'
  const isActive    = detail?.status === 'Active' || detail?.status === 0

  const roleLabel = isJobSeeker ? 'Job Seeker' : isEmployer ? 'Employer' : 'Admin'
  const name      = detail?.profile?.fullName || detail?.profile?.companyName || detail?.userName || '?'
  const initials  = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const AVATAR_COLORS = [
    'from-violet-500 to-violet-600',
    'from-sky-500 to-sky-600',
    'from-emerald-500 to-emerald-600',
    'from-amber-500 to-amber-600',
    'from-rose-500 to-rose-600',
  ]
  const avatarGrad = AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]

  return createPortal(
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,width:'100vw',height:'100vh',backgroundColor:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'1rem'}}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col animate-fadeIn">

        {/* ── Close button ── */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <X className="w-4 h-4" />
        </button>

        {/* ── Hero header ── */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-800 to-slate-900 px-6 pt-6 pb-5 flex-shrink-0">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {loading ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 skeleton rounded-2xl" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-36 skeleton rounded" />
                <div className="h-3 w-48 skeleton rounded" />
              </div>
            </div>
          ) : detail && (
            <div className="flex items-end gap-4 relative">
              {/* Avatar */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-xl font-bold text-white shadow-lg flex-shrink-0`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <h2 className="font-display text-xl font-bold text-white truncate">{name}</h2>
                <p className="text-slate-300 text-sm mt-0.5 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" /> {detail.email}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-white/10 text-slate-200 border border-white/10">
                    {isAdmin ? <ShieldCheck className="w-3 h-3" /> : isEmployer ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {roleLabel}
                  </span>
                  {detail.createdAt && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(detail.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        {!loading && detail && (
          <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 flex-shrink-0">
            <Tab label="Profile" active={tab === 'profile'} onClick={() => setTab('profile')} />
            {isJobSeeker && (
              <Tab label="Applications" active={tab === 'apps'} onClick={() => setTab('apps')}
                count={detail.applications?.length ?? 0} />
            )}
            {isEmployer && (
              <Tab label="Job Listings" active={tab === 'jobs'} onClick={() => setTab('jobs')}
                count={detail.jobs?.length ?? 0} />
            )}
          </div>
        )}

        {/* ── Scrollable content ── */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}
            </div>
          ) : !detail ? (
            <div className="text-center py-10 text-slate-400">Failed to load user details.</div>
          ) : tab === 'profile' ? (
            <div className="space-y-3">

              {/* Account info */}
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Account</p>
                <div className="space-y-2">
                  {[
                    { icon: User,  label: 'Username', value: detail.userName },
                    { icon: Mail,  label: 'Email',    value: detail.email    },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <f.icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 dark:text-slate-500">{f.label}</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{f.value || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Seeker profile */}
              {isJobSeeker && detail.profile && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Profile</p>
                  <div className="space-y-2">
                    {[
                      { icon: User,     label: 'Full Name',  value: detail.profile.fullName  },
                      { icon: Phone,    label: 'Phone',      value: detail.profile.phone     },
                      { icon: BookOpen, label: 'Education',  value: detail.profile.education },
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
                  {detail.profile.skills && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.profile.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                          <span key={s} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Employer profile */}
              {isEmployer && detail.profile && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Company</p>
                  <div className="space-y-2">
                    {[
                      { icon: Building2, label: 'Company Name',  value: detail.profile.companyName   },
                      { icon: Phone,     label: 'Contact',       value: detail.profile.contactNumber },
                      { icon: Globe,     label: 'Website',       value: detail.profile.website       },
                      { icon: Briefcase, label: 'Industry',      value: detail.profile.industry      },
                      { icon: MapPin,    label: 'City',          value: detail.profile.city          },
                    ].filter(f => f.value).map(f => (
                      <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <f.icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-400 dark:text-slate-500">{f.label}</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{f.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          ) : tab === 'apps' && detail.applications?.length > 0 ? (
            <div className="space-y-2.5">
              {detail.applications.map(a => (
                <div key={a.applicationId} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">{a.jobTitle || '—'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-400 dark:text-slate-500">{a.companyName}</p>
                      {a.matchScore != null && (
                        <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="w-3 h-3" /> {Math.round(a.matchScore)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_CLS[APP_STATUS[a.applicationStatus]] || 'bg-slate-100 text-slate-500'}`}>
                      {APP_STATUS[a.applicationStatus] || '—'}
                    </span>
                    {a.appliedAt && (
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(a.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          ) : tab === 'jobs' && detail.jobs?.length > 0 ? (
            <div className="space-y-2.5">
              {detail.jobs.map(j => (
                <div key={j.jobId} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">{j.jobTitle}</p>
                    {j.postedAt && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(j.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                    JOB_STATUS_CLS[JOB_STATUS[j.status] || j.status] || 'bg-slate-100 text-slate-500'
                  }`}>
                    {JOB_STATUS[j.status] || j.status}
                  </span>
                </div>
              ))}
            </div>

          ) : (
            <div className="text-center py-10 text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm">No {tab === 'apps' ? 'applications' : 'jobs'} found.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}