import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { employerApi } from '../../api'
import JobCard from '../../components/shared/JobCard'
import { CardSkeleton, StatSkeleton } from '../../components/shared/Skeleton'
import {
  Briefcase, Users, TrendingUp,
  ArrowRight, Building2, Clock, Sparkles
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function EmployerDashboard() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const profileId  = user?.profileId
  const firstName  = (user?.companyName || user?.userName || 'there').split(' ')[0]

  const [jobs,        setJobs]        = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)

  const [report, setReport] = useState(null)

useEffect(() => {
  if (!profileId) return

  employerApi.getReports(profileId)
    .then(r => setReport(r.data))
}, [profileId])
  useEffect(() => {
  if (!profileId) return

  employerApi.getMyJobs(profileId)
    .then(r => {
      console.log("Jobs data:", r.data)
      setJobs(r.data || [])
    })
    .catch(_err => {})
    .finally(() => setLoadingJobs(false))
}, [profileId])

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const totalJobs = report?.totalJobs ?? jobs.length

const activeJobs = report?.activeJobs ?? 0

const pendingJobs = report?.pendingJobs ?? 0

const expiredJobs = report?.expiredJobs ?? 0

const totalApplicants = report?.totalApplications ?? 0;
const avgApplicants =
  totalJobs > 0
    ? Math.round(totalApplicants / totalJobs)
    : 0

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
     {
    label: 'Pending Jobs',
    value: pendingJobs,
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    sub: 'Awaiting approval'
  },
  {
    label: 'Expired Jobs',
    value: expiredJobs,
    icon: Briefcase,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-500/10',
    sub: 'Deadline passed'
  },
  ]
 const jobStatusData = [
  { name: "Active", value: activeJobs, fill: "#10b981" },
  { name: "Pending", value: pendingJobs, fill: "#f59e0b" },
  { name: "Expired", value: expiredJobs, fill: "#ef4444" },
]

const applicationStatusData = [
  {
    name: "Applied",
    value: report?.appliedCandidates ?? 0,
    fill: "#3b82f6",
  },
  {
    name: "Shortlisted",
    value: report?.shortlistedCandidates ?? 0,
    fill: "#8b5cf6",
  },
  {
    name: "Accepted",
    value: report?.acceptedCandidates ?? 0,
    fill: "#10b981",
  },
  {
    name: "Rejected",
    value: report?.rejectedCandidates ?? 0,
    fill: "#ef4444",
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
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">        {loadingJobs
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
                onEdit={j => navigate(`/employer/jobs/${j.jobId}/edit`)}
                onViewCandidates={j => navigate('/employer/candidates', { state: { selectedJobId: j.jobId } })}
              />
            ))
          )}
        </div>

       {/* Charts */}
<div className="lg:col-span-2 space-y-5 pt-10">

  {/* Job Status */}
  <div className="card">
    <h2 className="section-title text-base">Job Status</h2>
    <p className="text-xs text-slate-400 mb-1">
      Distribution of your jobs
    </p>

    <ResponsiveContainer width="100%" height={210}>
      <PieChart>
       <Pie
    data={jobStatusData}
    dataKey="value"
    nameKey="name"
    innerRadius={40}
    outerRadius={70}
    label={({ name, value }) => `${name}: ${value}`}
/>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>

    <div className="flex justify-center gap-5 mt-2 text-xs">
      {jobStatusData.map(item => (
        <div key={item.name} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: item.fill }}
          />
          {item.name}
        </div>
      ))}
    </div>
  </div>

  {/* Application Status */}
  <div className="card">
    <h2 className="section-title text-base">Application Status</h2>
    <p className="text-xs text-slate-400 mb-4">
      Candidate application breakdown
    </p>

   <ResponsiveContainer width="100%" height={240}>
  <BarChart
    data={applicationStatusData}
    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis
      dataKey="name"
      tick={{ fontSize: 13 }}
      axisLine={false}
      tickLine={false}
    />

    <YAxis
      allowDecimals={false}
      tick={{ fontSize: 13 }}
      axisLine={false}
      tickLine={false}
    />

    <Tooltip
      contentStyle={{
        fontSize: "15px",
        borderRadius: "8px",
      }}
      labelStyle={{
        fontSize: "15px",
      }}
      itemStyle={{
        fontSize: "15px",
      }}
    />

    <Bar
      dataKey="value"
      radius={[6, 6, 0, 0]}
    >
      {applicationStatusData.map((item, index) => (
        <Cell
          key={index}
          fill={item.fill}
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
  </div>

</div>
      </div>
    </div>
  )
}

function isExpired(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}