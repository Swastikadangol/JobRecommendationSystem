import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, LineChart, Line,
  CartesianGrid, Legend
} from 'recharts'
import {
  Users, Briefcase, FileText, CircleAlert,
  ArrowRight, TrendingUp, ShieldCheck, Building2,
  CircleCheck, Clock
} from 'lucide-react'

const COLORS = {
  approved: '#10b981',
  pending:  '#f59e0b',
  rejected: '#ef4444',
  seekers:  '#6366f1',
  employers:'#0ea5e9',
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStats()
      .then(r => setStats(r.data))
      .catch(_err => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Job Seekers',       value: stats?.totalJobSeekers,    icon: Users,        color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-500/10',   to: '/admin/users?role=jobseeker'   },
    { label: 'Employers',         value: stats?.totalEmployers,     icon: Building2,    color: 'text-sky-600 dark:text-sky-400',          bg: 'bg-sky-50 dark:bg-sky-500/10',         to: '/admin/users?role=employer'    },
    { label: 'Total Jobs',        value: stats?.totalJobs,          icon: Briefcase,    color: 'text-brand-600 dark:text-brand-400',      bg: 'bg-brand-50 dark:bg-brand-500/10',     to: '/admin/jobs'                   },
    { label: 'Pending Approval',  value: stats?.pendingJobs,        icon: CircleAlert,  color: 'text-amber-600 dark:text-amber-400',      bg: 'bg-amber-50 dark:bg-amber-500/10',     to: '/admin/jobs?status=Pending'    },
    { label: 'Approved Jobs',     value: stats?.approvedJobs,       icon: CircleCheck,  color: 'text-emerald-600 dark:text-emerald-400',  bg: 'bg-emerald-50 dark:bg-emerald-500/10', to: '/admin/jobs?status=Approved'   },
    { label: 'Applications',      value: stats?.totalApplications,  icon: FileText,     color: 'text-rose-600 dark:text-rose-400',        bg: 'bg-rose-50 dark:bg-rose-500/10',       to: '/admin/applications'           },
  ]

  // Chart data
  const jobStatusData = stats ? [
    { name: 'Approved', value: stats.approvedJobs,  color: COLORS.approved },
    { name: 'Pending',  value: stats.pendingJobs,   color: COLORS.pending  },
    { name: 'Rejected', value: stats.rejectedJobs,  color: COLORS.rejected },
  ] : []

  const userDistData = stats ? [
    { name: 'Job Seekers', value: stats.totalJobSeekers, color: COLORS.seekers  },
    { name: 'Employers',   value: stats.totalEmployers,  color: COLORS.employers},
  ] : []

  const monthlyData = stats?.monthlyApplications || []

  return (
    <div className="animate-fadeIn space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Full platform overview — users, jobs, applications and trends.
        </p>
      </div>

      {/* Pending alert */}
      {!loading && stats?.pendingJobs > 0 && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
          <div className="flex items-center gap-2">
            <CircleAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <span className="font-semibold">{stats.pendingJobs} job{stats.pendingJobs > 1 ? 's' : ''}</span> awaiting approval.
            </p>
          </div>
          <Link to="/admin/jobs?status=Pending"
            className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1 flex-shrink-0">
            Review <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map(c => (
          <Link key={c.label} to={c.to}
            className="card hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                {c.label}
              </span>
              <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                <c.icon className={`w-4 h-4 ${c.color}`} />
              </div>
            </div>
            {loading
              ? <div className="h-8 w-16 skeleton rounded" />
              : <div className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {c.value ?? '—'}
                </div>
            }
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 group-hover:text-brand-500 transition-colors">
              View details <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts row 1 */}
      {!loading && stats && (
        <div className="grid md:grid-cols-2 gap-5">

          {/* Job Status Pie */}
          <div className="card">
            <h2 className="section-title mb-4">Job Status Breakdown</h2>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={jobStatusData} cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70}
                    dataKey="value" paddingAngle={3}>
                    {jobStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5">
                {jobStatusData.map(d => (
                  <div key={d.name} className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{d.name}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 ml-auto pl-4">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Distribution Doughnut */}
          <div className="card">
            <h2 className="section-title mb-4">User Distribution</h2>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={userDistData} cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70}
                    dataKey="value" paddingAngle={3}>
                    {userDistData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5">
                {userDistData.map(d => (
                  <div key={d.name} className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{d.name}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 ml-auto pl-4">{d.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400">
                    Total: {(stats.totalJobSeekers + stats.totalEmployers)} users
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications trend line chart */}
      {!loading && monthlyData.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <h2 className="section-title">Application Trend (Last 6 Months)</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Line type="monotone" dataKey="count" name="Applications"
                stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }}
                activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="section-title mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: '/admin/jobs?status=Pending', icon: Clock,      bg: 'bg-amber-50 dark:bg-amber-500/10',   color: 'text-amber-600',   title: 'Pending Jobs',     desc: 'Review & approve'     },
            { to: '/admin/users',               icon: Users,      bg: 'bg-violet-50 dark:bg-violet-500/10', color: 'text-violet-600',  title: 'Manage Users',     desc: 'View all accounts'    },
            { to: '/admin/jobs',                icon: Briefcase,  bg: 'bg-brand-50 dark:bg-brand-500/10',   color: 'text-brand-600',   title: 'All Jobs',         desc: 'Browse listings'      },
            { to: '/admin/applications',        icon: FileText,   bg: 'bg-rose-50 dark:bg-rose-500/10',     color: 'text-rose-600',    title: 'Applications',     desc: 'View all applications'},
          ].map(a => (
            <Link key={a.to} to={a.to} className="card-hover flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${a.bg} flex items-center justify-center flex-shrink-0`}>
                <a.icon className={`w-4 h-4 ${a.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}