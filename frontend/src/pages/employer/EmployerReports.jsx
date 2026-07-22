import { useEffect, useState } from 'react'
import { employerApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import * as XLSX from 'xlsx'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
  Cell,
  LineChart,
  Line
} from "recharts";
import {
    BarChart2, Briefcase, FileText, TrendingUp,
    CircleCheck, CircleX, Clock, Download,
    Target, Award, UserCheck, UserX, Star
} from 'lucide-react'

/* ── Excel export ───────────────────────────────────────── */
function exportToExcel(report) {
    const wb = XLSX.utils.book_new()
    const now = new Date().toLocaleString()

    const s = (k) => report?.[k] ?? 0

    // Sheet 1 — Summary
    const ws1 = XLSX.utils.aoa_to_sheet([
        ['TalentMatch — Employer Report'],
        ['Generated:', now],
        [],
        ['METRIC', 'VALUE', 'NOTES'],
        ['Total Jobs Posted', s('totalJobs'), 'All time'],
        ['Active Jobs', s('activeJobs'), 'Approved & currently active'],
        ['Pending Jobs', s('pendingJobs'), 'Awaiting review'],
        ['Expired Jobs', s('expiredJobs'), 'No longer accepting applicants'],
        [],
        ['Total Applications', s('totalApplications'), 'All time'],
        ['Applied Candidates', s('appliedCandidates'), 'Status = Applied'],
        ['Shortlisted Candidates', s('shortlistedCandidates'), 'Status = Shortlisted'],
        ['Accepted Candidates', s('acceptedCandidates'), 'Status = Accepted'],
        ['Rejected Candidates', s('rejectedCandidates'), 'Status = Rejected'],
        ['Avg Applications per Job', s('avgApplicationsPerJob'), 'Your average'],
        [],
        ['Shortlist Rate', report?.totalApplications > 0 ? `${Math.round((s('shortlistedCandidates') / s('totalApplications')) * 100)}%` : '0%', ''],
        ['Acceptance Rate', report?.totalApplications > 0 ? `${Math.round((s('acceptedCandidates') / s('totalApplications')) * 100)}%` : '0%', 'Accepted/Total applications'],
    ])
    ws1['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 30 }]
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary')

    // Sheet 2 — Job Status
    const ws2 = XLSX.utils.aoa_to_sheet([
        ['JOB STATUS BREAKDOWN'],
        ['Status', 'Count', 'Percentage'],
        ['Active', s('activeJobs'), report?.totalJobs > 0 ? `${Math.round((s('activeJobs') / s('totalJobs')) * 100)}%` : '0%'],
        ['Pending', s('pendingJobs'), report?.totalJobs > 0 ? `${Math.round((s('pendingJobs') / s('totalJobs')) * 100)}%` : '0%'],
        ['Expired', s('expiredJobs'), report?.totalJobs > 0 ? `${Math.round((s('expiredJobs') / s('totalJobs')) * 100)}%` : '0%'],
        ['Total', s('totalJobs'), '100%'],
    ])
    ws2['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(wb, ws2, 'Job Status')

    // Sheet 3 — Applications
    const ws3 = XLSX.utils.aoa_to_sheet([
        ['APPLICATION BREAKDOWN'],
        ['Status', 'Count', 'Percentage'],
        ['Applied', s('appliedCandidates'), report?.totalApplications > 0 ? `${Math.round((s('appliedCandidates') / s('totalApplications')) * 100)}%` : '0%'],
        ['Shortlisted', s('shortlistedCandidates'), report?.totalApplications > 0 ? `${Math.round((s('shortlistedCandidates') / s('totalApplications')) * 100)}%` : '0%'],
        ['Accepted', s('acceptedCandidates'), report?.totalApplications > 0 ? `${Math.round((s('acceptedCandidates') / s('totalApplications')) * 100)}%` : '0%'],
        ['Rejected', s('rejectedCandidates'), report?.totalApplications > 0 ? `${Math.round((s('rejectedCandidates') / s('totalApplications')) * 100)}%` : '0%'],
        ['Total', s('totalApplications'), '100%'],
        [],
        ['Avg Applications per Job', s('avgApplicationsPerJob'), ''],
    ])
    ws3['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(wb, ws3, 'Applications')

    // Sheet 4 — Monthly trend
    if (report?.monthlyApplications?.length) {
        const ws4 = XLSX.utils.aoa_to_sheet([
            ['MONTHLY APPLICATIONS TREND'],
            ['Month', 'Year', 'Applications'],
            ...report.monthlyApplications.map(m => [m.month, m.year, m.count])
        ])
        ws4['!cols'] = [{ wch: 15 }, { wch: 10 }, { wch: 20 }]
        XLSX.utils.book_append_sheet(wb, ws4, 'Monthly Trend')
    }

    XLSX.writeFile(wb, `TalentMatch_EmployerReport_${new Date().toISOString().split('T')[0]}.xlsx`)
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

function CustomTrendTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md px-3 py-2 text-xs">
            <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
            {payload.map((entry) => (
                <p key={entry.dataKey} style={{ color: entry.color }} className="font-medium">
                    {entry.name} : {entry.value}
                </p>
            ))}
        </div>
    )
}

export default function EmployerReports({ employerId: employerIdProp }) {
    const { user } = useAuth()
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)
    const [employerId, setEmployerId] = useState(
        employerIdProp ?? user?.profileId ?? null
    );

    const [granularity, setGranularity] = useState('weekly') // 'daily' | 'weekly' | 'monthly' 

    useEffect(() => {
        if (!employerId) return
        setLoading(true)
        employerApi.getReports(employerId)
            .then(r => {
                console.log("Employer Report:", r.data);
                setReport(r.data);
            })
            .catch(_err => { })
            .finally(() => setLoading(false))
    }, [employerId])

    if (loading) return (
        <div className="animate-fadeIn space-y-5">
            <div className="h-8 w-48 skeleton rounded" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array(8).fill(0).map((_, i) => <div key={i} className="card h-24 skeleton" />)}
            </div>
        </div>
    )

    const s = (k) => report?.[k] ?? 0

    const activeRate = s('totalJobs') > 0 ? Math.round((s('activeJobs') / s('totalJobs')) * 100) : 0
    const pendRate = s('totalJobs') > 0 ? Math.round((s('pendingJobs') / s('totalJobs')) * 100) : 0
const expiredRate =
    s('totalJobs') > 0
        ? Math.round((s('expiredJobs') / s('totalJobs')) * 100)
        : 0
    const shortlistRate = s('totalApplications') > 0 ? Math.round((s('shortlistedCandidates') / s('totalApplications')) * 100) : 0
    const acceptRate = s('totalApplications') > 0 ? Math.round((s('acceptedCandidates') / s('totalApplications')) * 100) : 0
    const rejectRate = s('totalApplications') > 0 ? Math.round((s('rejectedCandidates') / s('totalApplications')) * 100) : 0


    // Chart data
    const jobBarData = [
        { name: 'Active', count: s('activeJobs'), fill: '#10b981' },
        { name: 'Pending', count: s('pendingJobs'), fill: '#f59e0b' },
        { name: 'Expired', count: s('expiredJobs'), fill: '#64748b' },
    ]

    const appBarData = [
        { name: 'Applied', count: s('appliedCandidates'), fill: '#0ea5e9' },
        { name: 'Shortlisted', count: s('shortlistedCandidates'), fill: '#8b5cf6' },
        { name: 'Accepted', count: s('acceptedCandidates'), fill: '#10b981' },
        { name: 'Rejected', count: s('rejectedCandidates'), fill: '#ef4444' },
    ]



    const trendSourceMap = {
        daily: report?.dailyTrend,
        weekly: report?.weeklyTrend,
        monthly: report?.monthlyTrend,
    }

    const trendData =
        trendSourceMap[granularity]?.map((item) => ({
            period: item.label,
            applications: item.applications,
            accepted: item.accepted,
        })) || []

    const showAcceptedLine = granularity !== 'all'

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
                        Your job postings, applications and hiring performance.
                    </p>
                </div>
                <button onClick={() => exportToExcel(report)} className="btn-primary">
                    <Download className="w-4 h-4" /> Export to Excel
                </button>
            </div>

            {/* ── Section 1: Jobs ── */}
            <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Jobs</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Briefcase} label="Total Jobs" value={s('totalJobs')} sub="All time" color="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-50 dark:bg-indigo-500/10" />
                    <StatCard icon={CircleCheck} label="Active" value={s('activeJobs')} sub={`${activeRate}% of total`} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-500/10" />
                    <StatCard icon={Clock} label="Pending" value={s('pendingJobs')} sub="Awaiting review" color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-500/10" />
                    <StatCard icon={CircleX} label="Expired" value={s('expiredJobs')} sub={`${expiredRate}% of total`} color="text-slate-600 dark:text-slate-400" bg="bg-slate-100 dark:bg-slate-500/10" />
                </div>
            </div>

            {/* ── Section 2: Applications & Hiring ── */}
            <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Applications & Hiring</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard icon={FileText} label="Total Apps" value={s('totalApplications')} sub="All time" color="text-rose-600 dark:text-rose-400" bg="bg-rose-50 dark:bg-rose-500/10" />
                    <StatCard icon={Target} label="Applied" value={s('appliedCandidates')} sub="Status = Applied" color="text-sky-600 dark:text-sky-400" bg="bg-sky-50 dark:bg-sky-500/10" />
                    <StatCard icon={Star} label="Shortlisted" value={s('shortlistedCandidates')} sub={`${shortlistRate}% of apps`} color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-500/10" />
                    <StatCard icon={UserCheck} label="Accepted" value={s('acceptedCandidates')} sub={`${acceptRate}% accept rate`} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-500/10" />
                    <StatCard icon={UserX} label="Rejected" value={s('rejectedCandidates')} sub="Status = Rejected" color="text-red-600 dark:text-red-400" bg="bg-red-50 dark:bg-red-500/10" />
                    <StatCard icon={TrendingUp} label="Avg Apps/Job" value={s('avgApplicationsPerJob')} sub="Your average" color="text-orange-600 dark:text-orange-400" bg="bg-orange-50 dark:bg-orange-500/10" />
                </div>
            </div>

            {/* ── Charts row 1 ── */}
            <div className="grid md:grid-cols-2 gap-5">

                {/* Jobs bar chart */}
                <div className="card">
                    <h2 className="section-title text-base mb-1">Jobs by Status</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Breakdown of your job listings by current status</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={jobBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                            <Bar dataKey="count" name="Jobs" radius={[6, 6, 0, 0]}>
                                {jobBarData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Applications pie chart */}
                <div className="card">
                    <h2 className="section-title text-base mb-1">Application Outcomes</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Applied, shortlisted, accepted and rejected candidates</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <Pie
                                data={appBarData}
                                dataKey="count"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={75}
                                paddingAngle={2}
                                label={({ name, percent }) => s('totalApplications') > 0 ? `${name} ${Math.round(percent * 100)}%` : name}
                                labelLine={false}
                            >
                                {appBarData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Charts row 2: Trend chart with Daily/Weekly/Monthly toggle ── */}
            <div className="card md:col-span-2">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
                    <div>
                        <h2 className="section-title text-base mb-1">Applications & Accepted Trend</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Applications received vs. candidates accepted
                        </p>
                    </div>
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        {['daily', 'weekly', 'monthly'].map((g) => (
                            <button
                                key={g}
                                onClick={() => setGranularity(g)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                                    granularity === g
                                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400'
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                {trendData.length > 1 ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTrendTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="applications"
                                name="Applications"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#fff', stroke: '#ef4444', strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                            />
                            {showAcceptedLine && (
                                <Line
                                    type="monotone"
                                    dataKey="accepted"
                                    name="Accepted"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#fff', stroke: '#22c55e', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[260px] flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
                        Not enough data yet to show a trend
                    </div>
                )}
            </div>

            {/* ── Rate progress bars ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Rate', value: activeRate, color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', desc: 'Jobs currently active' },
                    { label: 'Accept Rate', value: acceptRate, color: 'bg-brand-500', textColor: 'text-brand-600 dark:text-brand-400', desc: 'Applications accepted' },
                    { label: 'Shortlist Rate', value: shortlistRate, color: 'bg-purple-500', textColor: 'text-purple-600 dark:text-purple-400', desc: 'Applications shortlisted' },
                    { label: 'Reject Rate', value: rejectRate, color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', desc: 'Applications rejected' },
                ].map(r => (
                    <div key={r.label} className="card">
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">{r.label}</p>
                        <p className={`font-display text-3xl font-bold mb-1 ${r.textColor}`}>{r.value}%</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">{r.desc}</p>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${r.color} transition-all duration-700`} style={{ width: `${r.value}%` }} />
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
                                { icon: Briefcase, label: 'Total Jobs Posted', value: s('totalJobs'), note: 'All time' },
                                { icon: CircleCheck, label: 'Active Jobs', value: s('activeJobs'), note: `${activeRate}% of total` },
                                { icon: Clock, label: 'Pending Jobs', value: s('pendingJobs'), note: `${pendRate}% of total` },
                                { icon: CircleX, label: 'Expired Jobs', value: s('expiredJobs'), note: `${expiredRate}% of total` },
                                { icon: FileText, label: 'Total Applications', value: s('totalApplications'), note: 'All time' },
                                { icon: Target, label: 'Applied Candidates', value: s('appliedCandidates'), note: 'Status = Applied' },
                                { icon: Star, label: 'Shortlisted Candidates', value: s('shortlistedCandidates'), note: `${shortlistRate}% shortlist rate` },
                                { icon: UserCheck, label: 'Accepted Candidates', value: s('acceptedCandidates'), note: `${acceptRate}% accept rate` },
                                { icon: UserX, label: 'Rejected Candidates', value: s('rejectedCandidates'), note: `${rejectRate}% reject rate` },
                                { icon: TrendingUp, label: 'Avg Applications per Job', value: s('avgApplicationsPerJob'), note: 'Your average' },
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