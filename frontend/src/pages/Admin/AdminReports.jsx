import { useEffect, useState } from 'react'
import { adminApi } from '../../api'
import * as XLSX from 'xlsx'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell
} from 'recharts'
import {
  BarChart2, Users, Briefcase, FileText, TrendingUp,
  CircleCheck, CircleX, Clock, Building2, Download,
  Target, Award, UserCheck, UserX, Star
} from 'lucide-react'

/* ── Excel export ───────────────────────────────────────── */
function exportToExcel(stats) {
  const wb  = XLSX.utils.book_new()
  const now = new Date().toLocaleString()

  const s = (k) => stats?.[k] ?? 0

  // Sheet 1 — Summary
  const ws1 = XLSX.utils.aoa_to_sheet([
    ['TalentMatch — Platform Report'],
    ['Generated:', now],
    [],
    ['METRIC', 'VALUE', 'NOTES'],
    ['Total Job Seekers',         s('totalJobSeekers'),         'Registered candidates'],
    ['Total Employers',           s('totalEmployers'),          'Registered companies'],
    ['Total Platform Users',      s('totalJobSeekers') + s('totalEmployers'), 'Seekers + employers'],
    [],
    ['Total Jobs Posted',         s('totalJobs'),               'All time'],
    ['Approved Jobs',             s('approvedJobs'),            'Live on platform'],
    ['Pending Jobs',              s('pendingJobs'),             'Awaiting review'],
    ['Rejected Jobs',             s('rejectedJobs'),            'Did not pass review'],
    ['Open Jobs',                 s('openJobs'),                'Approved & not expired'],
    [],
    ['Total Applications',        s('totalApplications'),       'All time'],
    ['Hired Candidates',          s('hiredCandidates'),         'Status = Accepted'],
    ['Rejected Applications',     s('rejectedApplications'),    'Status = Rejected'],
    ['Shortlisted Candidates',    s('shortlistedCandidates'),   'Status = Shortlisted'],
    ['Jobs Filled',               s('jobsFilled'),              'Jobs with accepted candidate'],
    ['Avg Applications per Job',  s('avgApplicationsPerJob'),   'Platform average'],
    [],
    ['Job Approval Rate',         stats?.totalJobs > 0 ? `${Math.round((s('approvedJobs')/s('totalJobs'))*100)}%` : '0%', ''],
    ['Hire Rate',                 stats?.totalApplications > 0 ? `${Math.round((s('hiredCandidates')/s('totalApplications'))*100)}%` : '0%', 'Accepted/Total applications'],
  ])
  ws1['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary')

  // Sheet 2 — Job Status
  const ws2 = XLSX.utils.aoa_to_sheet([
    ['JOB STATUS BREAKDOWN'],
    ['Status', 'Count', 'Percentage'],
    ['Approved', s('approvedJobs'), stats?.totalJobs > 0 ? `${Math.round((s('approvedJobs')/s('totalJobs'))*100)}%` : '0%'],
    ['Pending',  s('pendingJobs'),  stats?.totalJobs > 0 ? `${Math.round((s('pendingJobs')/s('totalJobs'))*100)}%`  : '0%'],
    ['Rejected', s('rejectedJobs'), stats?.totalJobs > 0 ? `${Math.round((s('rejectedJobs')/s('totalJobs'))*100)}%` : '0%'],
    ['Open',     s('openJobs'),     'Approved & not expired'],
    ['Total',    s('totalJobs'),    '100%'],
  ])
  ws2['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'Job Status')

  // Sheet 3 — Applications
  const ws3 = XLSX.utils.aoa_to_sheet([
    ['APPLICATION BREAKDOWN'],
    ['Status', 'Count', 'Percentage'],
    ['Hired (Accepted)',  s('hiredCandidates'),       stats?.totalApplications > 0 ? `${Math.round((s('hiredCandidates')/s('totalApplications'))*100)}%`      : '0%'],
    ['Shortlisted',       s('shortlistedCandidates'), stats?.totalApplications > 0 ? `${Math.round((s('shortlistedCandidates')/s('totalApplications'))*100)}%` : '0%'],
    ['Rejected',          s('rejectedApplications'),  stats?.totalApplications > 0 ? `${Math.round((s('rejectedApplications')/s('totalApplications'))*100)}%`  : '0%'],
    ['Total',             s('totalApplications'),     '100%'],
    [],
    ['Avg Applications per Job', s('avgApplicationsPerJob'), ''],
  ])
  ws3['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, ws3, 'Applications')

  // Sheet 4 — Monthly trend
  if (stats?.monthlyApplications?.length) {
    const ws4 = XLSX.utils.aoa_to_sheet([
      ['MONTHLY APPLICATIONS TREND'],
      ['Month', 'Year', 'Applications'],
      ...stats.monthlyApplications.map(m => [m.month, m.year, m.count])
    ])
    ws4['!cols'] = [{ wch: 15 }, { wch: 10 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, ws4, 'Monthly Trend')
  }

  XLSX.writeFile(wb, `TalentMatch_Report_${new Date().toISOString().split('T')[0]}.xlsx`)
}

/* ── Stat card ──────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
      <div className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">{value ?? '—'}</div>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminReports() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStats()
      .then(r => setStats(r.data))
      .catch(_err => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="animate-fadeIn space-y-5">
      <div className="h-8 w-48 skeleton rounded" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(12).fill(0).map((_, i) => <div key={i} className="card h-24 skeleton" />)}
      </div>
    </div>
  )

  const s           = (k) => stats?.[k] ?? 0
  const totalUsers  = s('totalJobSeekers') + s('totalEmployers')
  const approvalRate = s('totalJobs') > 0 ? Math.round((s('approvedJobs') / s('totalJobs')) * 100) : 0
  const rejRate      = s('totalJobs') > 0 ? Math.round((s('rejectedJobs') / s('totalJobs')) * 100) : 0
  const pendRate     = s('totalJobs') > 0 ? Math.round((s('pendingJobs')  / s('totalJobs')) * 100) : 0
  const hireRate     = s('totalApplications') > 0 ? Math.round((s('hiredCandidates') / s('totalApplications')) * 100) : 0
  const shortlistRate= s('totalApplications') > 0 ? Math.round((s('shortlistedCandidates') / s('totalApplications')) * 100) : 0

  const monthlyData = stats?.monthlyApplications || []

  // Chart data
  const jobBarData = [
    { name: 'Approved', count: s('approvedJobs'), fill: '#10b981' },
    { name: 'Open',     count: s('openJobs'),     fill: '#0ea5e9' },
    { name: 'Pending',  count: s('pendingJobs'),  fill: '#f59e0b' },
    { name: 'Rejected', count: s('rejectedJobs'), fill: '#ef4444' },
  ]

  const appBarData = [
    { name: 'Hired',        count: s('hiredCandidates'),      fill: '#10b981' },
    { name: 'Shortlisted',  count: s('shortlistedCandidates'),fill: '#8b5cf6' },
    { name: 'Rejected',     count: s('rejectedApplications'), fill: '#ef4444' },
  ]

  const radarData = [
    { subject: 'Approval%',   value: approvalRate   },
    { subject: 'Hire Rate%',  value: hireRate       },
    { subject: 'Shortlist%',  value: shortlistRate  },
    { subject: 'Open Jobs%',  value: s('totalJobs') > 0 ? Math.round((s('openJobs')/s('totalJobs'))*100) : 0 },
    { subject: 'Seekers%',    value: totalUsers > 0 ? Math.round((s('totalJobSeekers')/totalUsers)*100) : 0   },
    { subject: 'Employers%',  value: totalUsers > 0 ? Math.round((s('totalEmployers')/totalUsers)*100) : 0    },
  ]

  return (
    <div className="animate-fadeIn space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-5 h-5 text-brand-600" />
            <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">Reports</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Full platform analytics — users, jobs, applications and hiring trends.
          </p>
        </div>
        <button onClick={() => exportToExcel(stats)} className="btn-primary">
          <Download className="w-4 h-4" /> Export to Excel
        </button>
      </div>

      {/* ── Section 1: Users ── */}
      <div>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Users</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={Users}    label="Total Users"    value={totalUsers}             sub={`${s('totalJobSeekers')} seekers · ${s('totalEmployers')} employers`} color="text-brand-600 dark:text-brand-400"    bg="bg-brand-50 dark:bg-brand-500/10"    />
          <StatCard icon={Users}    label="Job Seekers"    value={s('totalJobSeekers')}   sub="Registered candidates"  color="text-violet-600 dark:text-violet-400"  bg="bg-violet-50 dark:bg-violet-500/10"  />
          <StatCard icon={Building2}label="Employers"      value={s('totalEmployers')}    sub="Registered companies"   color="text-sky-600 dark:text-sky-400"         bg="bg-sky-50 dark:bg-sky-500/10"        />
        </div>
      </div>

      {/* ── Section 2: Jobs ── */}
      <div>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Jobs</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Briefcase}   label="Total Jobs"    value={s('totalJobs')}      sub="All time"               color="text-indigo-600 dark:text-indigo-400"   bg="bg-indigo-50 dark:bg-indigo-500/10"  />
          <StatCard icon={CircleCheck} label="Approved"      value={s('approvedJobs')}   sub={`${approvalRate}% of total`} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-500/10"/>
          <StatCard icon={Target}      label="Open Jobs"     value={s('openJobs')}       sub="Approved & not expired" color="text-cyan-600 dark:text-cyan-400"        bg="bg-cyan-50 dark:bg-cyan-500/10"      />
          <StatCard icon={Clock}       label="Pending"       value={s('pendingJobs')}    sub="Awaiting review"        color="text-amber-600 dark:text-amber-400"      bg="bg-amber-50 dark:bg-amber-500/10"    />
        </div>
      </div>

      {/* ── Section 3: Applications & Hiring ── */}
      <div>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Applications & Hiring</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon={FileText}  label="Total Apps"     value={s('totalApplications')} sub="All time"            color="text-rose-600 dark:text-rose-400"       bg="bg-rose-50 dark:bg-rose-500/10"      />
          <StatCard icon={UserCheck} label="Hired"          value={s('hiredCandidates')}   sub={`${hireRate}% hire rate`}  color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-500/10"/>
          <StatCard icon={Star}      label="Shortlisted"    value={s('shortlistedCandidates')} sub={`${shortlistRate}% of apps`} color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-500/10"/>
          <StatCard icon={UserX}     label="Rejected Apps"  value={s('rejectedApplications')} sub="Status = Rejected" color="text-red-600 dark:text-red-400"          bg="bg-red-50 dark:bg-red-500/10"        />
          <StatCard icon={Award}     label="Jobs Filled"    value={s('jobsFilled')}        sub="With accepted hire"  color="text-teal-600 dark:text-teal-400"        bg="bg-teal-50 dark:bg-teal-500/10"      />
          <StatCard icon={TrendingUp}label="Avg Apps/Job"   value={s('avgApplicationsPerJob')} sub="Platform average" color="text-orange-600 dark:text-orange-400"   bg="bg-orange-50 dark:bg-orange-500/10"  />
        </div>
      </div>

      {/* ── Charts row 1 ── */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* Jobs bar chart */}
        <div className="card">
          <h2 className="section-title text-base mb-1">Jobs by Status</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Breakdown of all job listings by current status</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={jobBarData} margin={{ top:5, right:10, left:0, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize:12, fill:'#94a3b8' }} />
              <YAxis tick={{ fontSize:12, fill:'#94a3b8' }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius:8, border:'1px solid #e2e8f0', fontSize:12 }} />
              <Bar dataKey="count" name="Jobs" radius={[6,6,0,0]}>
                {jobBarData.map((e,i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Applications bar chart */}
        <div className="card">
          <h2 className="section-title text-base mb-1">Application Outcomes</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Hired, shortlisted and rejected candidates</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={appBarData} margin={{ top:5, right:10, left:0, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize:12, fill:'#94a3b8' }} />
              <YAxis tick={{ fontSize:12, fill:'#94a3b8' }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius:8, border:'1px solid #e2e8f0', fontSize:12 }} />
              <Bar dataKey="count" name="Candidates" radius={[6,6,0,0]}>
                {appBarData.map((e,i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts row 2 ── */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* Monthly area chart */}
        <div className="card">
          <h2 className="section-title text-base mb-1">Application Volume Trend</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Applications received per month (last 6 months)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData} margin={{ top:5, right:10, left:0, bottom:5 }}>
              <defs>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'#94a3b8' }} />
              <YAxis tick={{ fontSize:12, fill:'#94a3b8' }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius:8, border:'1px solid #e2e8f0', fontSize:12 }} />
              <Area type="monotone" dataKey="count" name="Applications"
                stroke="#6366f1" strokeWidth={2.5} fill="url(#appGrad)"
                dot={{ r:4, fill:'#6366f1' }} activeDot={{ r:6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="card">
          <h2 className="section-title text-base mb-1">Platform Health Radar</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Key metrics as percentages</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} margin={{ top:0, right:20, left:20, bottom:0 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:11, fill:'#94a3b8' }} />
              <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fontSize:10, fill:'#94a3b8' }} />
              <Radar name="Platform" dataKey="value"
                stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius:8, border:'1px solid #e2e8f0', fontSize:12 }}
                formatter={(v) => [`${v}%`]} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Rate progress bars ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Approval Rate',  value:approvalRate,   color:'bg-emerald-500', textColor:'text-emerald-600 dark:text-emerald-400', desc:'Jobs approved'          },
          { label:'Hire Rate',      value:hireRate,       color:'bg-brand-500',   textColor:'text-brand-600 dark:text-brand-400',     desc:'Applications hired'     },
          { label:'Shortlist Rate', value:shortlistRate,  color:'bg-purple-500',  textColor:'text-purple-600 dark:text-purple-400',   desc:'Applications shortlisted'},
          { label:'Rejection Rate', value:rejRate,        color:'bg-red-500',     textColor:'text-red-600 dark:text-red-400',         desc:'Jobs rejected'          },
        ].map(r => (
          <div key={r.label} className="card">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">{r.label}</p>
            <p className={`font-display text-3xl font-bold mb-1 ${r.textColor}`}>{r.value}%</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">{r.desc}</p>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${r.color} transition-all duration-700`} style={{ width:`${r.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Full summary table ── */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-brand-600" />
          <h2 className="section-title text-base">Full Summary Table</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Metric</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Value</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { icon:Users,       label:'Total Job Seekers',       value:s('totalJobSeekers'),         note:'Registered candidates'          },
                { icon:Building2,   label:'Total Employers',          value:s('totalEmployers'),          note:'Registered companies'           },
                { icon:Users,       label:'Total Platform Users',     value:totalUsers,                   note:'Seekers + employers'            },
                { icon:Briefcase,   label:'Total Jobs Posted',        value:s('totalJobs'),               note:'All time'                       },
                { icon:CircleCheck, label:'Approved Jobs',            value:s('approvedJobs'),            note:`${approvalRate}% of total`      },
                { icon:Target,      label:'Open Jobs',                value:s('openJobs'),                note:'Approved & not expired'         },
                { icon:Clock,       label:'Pending Jobs',             value:s('pendingJobs'),             note:`${pendRate}% of total`          },
                { icon:CircleX,     label:'Rejected Jobs',            value:s('rejectedJobs'),            note:`${rejRate}% of total`           },
                { icon:FileText,    label:'Total Applications',       value:s('totalApplications'),       note:'All time'                       },
                { icon:UserCheck,   label:'Hired Candidates',         value:s('hiredCandidates'),         note:`${hireRate}% hire rate`         },
                { icon:Star,        label:'Shortlisted Candidates',   value:s('shortlistedCandidates'),   note:`${shortlistRate}% shortlist rate`},
                { icon:UserX,       label:'Rejected Applications',    value:s('rejectedApplications'),    note:'Status = Rejected'              },
                { icon:Award,       label:'Jobs Filled',              value:s('jobsFilled'),              note:'With at least 1 hired candidate'},
                { icon:TrendingUp,  label:'Avg Applications per Job', value:s('avgApplicationsPerJob'),   note:'Platform average'               },
              ].map(row => (
                <tr key={row.label} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <row.icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{row.label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900 dark:text-slate-100">{row.value}</td>
                  <td className="py-3 px-3 text-right text-xs text-slate-400 dark:text-slate-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}