import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { employerApi } from '../../api'
import JobCard from '../../components/shared/JobCard'
import { CardSkeleton, StatSkeleton } from '../../components/shared/Skeleton'
import {
  Briefcase, Users, TrendingUp,
  ArrowRight, Building2, Clock, Sparkles
} from 'lucide-react'

export default function EmployerDashboard() {
  const { user }   = useAuth()
  const profileId  = user?.profileId
  const firstName  = (user?.companyName || user?.userName || 'there').split(' ')[0]

  const [jobs,        setJobs]        = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)

  useEffect(() => {
    if (!profileId) return
    employerApi.getMyJobs(profileId)
      .then(r => setJobs(r.data || []))
      .catch(_err => {})
      .finally(() => setLoadingJobs(false))
  }, [profileId])

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const totalJobs       = jobs.length
  const activeJobs      = jobs.filter(j => j.isActive !== false && !isExpired(j.deadline)).length
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount ?? 0), 0)
  const pendingJobs     = jobs.filter(j => j.jobStatus === 0 || j.jobStatus === 'Pending').length

  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0))
    .slice(0, 4)

  const stats = [
    {
      label: 'Total Listings',
      value: totalJobs,
      icon: Briefcase,
      color: 'text-brand-600 dark:text-brand-400',
      bg:    'bg-brand-50 dark:bg-brand-500/10',
      sub:   `${activeJobs} active · ${pendingJobs} pending review`,
    },
    {
      label: 'Total Applicants',
      value: totalApplicants,
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg:    'bg-emerald-50 dark:bg-emerald-500/10',
      sub:   totalJobs > 0
        ? `Avg ${Math.round(totalApplicants / totalJobs)} per job`
        : 'Post jobs to start receiving applications',
    },
    {
      label: 'Active Jobs',
      value: activeJobs,
      icon: TrendingUp,
      color: 'text-amber-500 dark:text-amber-400',
      bg:    'bg-amber-50 dark:bg-amber-500/10',
      sub:   pendingJobs > 0 ? `${pendingJobs} awaiting approval` : 'All jobs reviewed',
    },
  ]

  return (
    <div className="animate-fadeIn space-y-6">

      {/* ── Header — no Post a Job button ── */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {greeting}, {firstName} ✦
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Here's an overview of your hiring activity today.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loadingJobs
          ? Array(3).fill(0).map((_, i) => <StatSkeleton key={i} />)
          : stats.map(s => (
            <div key={s.label} className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                  {s.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
                {s.value}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{s.sub}</p>
            </div>
          ))
        }
      </div>

      {/* ── Main grid ── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Recent listings */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <h2 className="section-title">Recent Listings</h2>
            </div>
            <Link to="/employer/jobs" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingJobs ? (
            Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : recentJobs.length === 0 ? (
            <div className="card text-center py-10 border-dashed border-2 border-slate-200 dark:border-slate-700">
              <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="font-display font-semibold text-slate-700 dark:text-slate-300 mb-1">
                No jobs posted yet
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                Create your first listing to start hiring
              </p>
              <Link to="/employer/post-job" className="btn-primary inline-flex">
                Post a Job
              </Link>
            </div>
          ) : (
            recentJobs.map(job => (
              <JobCard
                key={job.jobId}
                job={job}
                role="Employer"
                onEdit={j => window.location.href = `/employer/jobs/${j.jobId}/edit`}
                onViewCandidates={j => window.location.href = `/employer/jobs/${j.jobId}/applicants`}
              />
            ))
          )}
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="section-title">Quick Actions</h2>

          {[
            {
              to:        '/employer/post-job',
              icon:      Briefcase,
              iconBg:    'bg-brand-50 dark:bg-brand-500/10',
              iconColor: 'text-brand-600 dark:text-brand-400',
              title:     'Post a New Job',
              desc:      'Create a listing and start receiving applications',
            },
            {
              to:        '/employer/jobs',
              icon:      Building2,
              iconBg:    'bg-emerald-50 dark:bg-emerald-500/10',
              iconColor: 'text-emerald-600 dark:text-emerald-400',
              title:     'Manage Listings',
              desc:      'Edit, close or review your job postings',
            },
            {
              to:        '/employer/profile',
              icon:      Users,
              iconBg:    'bg-amber-50 dark:bg-amber-500/10',
              iconColor: 'text-amber-600 dark:text-amber-400',
              title:     'Company Profile',
              desc:      'Update your company details and contact info',
            },
          ].map(a => (
            <Link key={a.to} to={a.to} className="card-hover flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${a.iconBg} flex items-center justify-center flex-shrink-0`}>
                <a.icon className={`w-5 h-5 ${a.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{a.title}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{a.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
            </Link>
          ))}

          {!loadingJobs && pendingJobs > 0 && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <span className="font-semibold">{pendingJobs} job{pendingJobs > 1 ? 's' : ''}</span> awaiting admin approval.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function isExpired(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}