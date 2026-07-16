import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jobSeekerApi } from '../../api'
import JobCard from '../../components/shared/JobCard'
import ApplicationCard from '../../components/shared/ApplicationCard'
import { CardSkeleton, StatSkeleton, AppCardSkeleton } from '../../components/shared/Skeleton'
import { Briefcase, FileText, Star, ArrowRight, Sparkles } from 'lucide-react'
import { isJobExpired } from '../../utils/helpers'

export default function Dashboard() {
  const { user } = useAuth()
  const profileId = user?.profileId
  const firstName = (user?.fullName || user?.userName || 'there').split(' ')[0]

  const [recs, setRecs] = useState([])
  const [apps, setApps] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(true)
  const [loadingApps, setLoadingApps] = useState(true)

  useEffect(() => {
    if (!profileId) return

    jobSeekerApi.getRecommendations(profileId)
      .then(r => setRecs(r.data || []))
      .catch(() => {})
      .finally(() => setLoadingRecs(false))

    jobSeekerApi.getApplications(profileId)
      .then(r => setApps(r.data?.data || []))
      .catch(() => {})
      .finally(() => setLoadingApps(false))
  }, [profileId])

  // -----------------------------
  // REAL THIS-WEEK LOGIC
  // -----------------------------
  const isThisWeek = (dateStr) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffDays = (now - date) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  const appsThisWeek = apps.filter(app => isThisWeek(app.appliedAt)).length

  // -----------------------------
  // PROFILE STRENGTH (dynamic)
  // -----------------------------
  const profileStrength = Math.min(
    100,
    (recs.length * 10) +
    (apps.length * 5) +
    (user?.skills?.length || 0) * 5
  )

  // -----------------------------
  // BEST MATCH IMPROVEMENT
  // -----------------------------
  const matchImprovement = recs.length
    ? Math.round((Math.max(...recs.map(r => r.matchScore)) || 0) / 10)
    : 0

  // -----------------------------
  // DATA
  // -----------------------------
  const topRecs = [...recs]
    .filter(j => j.matchScore > 0 && !isJobExpired(j.deadline))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)

  const recentApps = [...apps]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 4)

  // -----------------------------
  // STATS (UPGRADED)
  // -----------------------------
 const stats = [
  {
    label: 'Applications',
    value: apps.length,
    icon: FileText,
    color: 'text-brand-600 dark:text-brand-400',
    bg: 'bg-brand-50 dark:bg-brand-500/10',
    sub: `${apps.length} total • ${appsThisWeek > 0 ? `+${appsThisWeek} this week` : 'No activity this week'}`
  },
  {
    label: 'Best Matches',
    value: recs.filter(r => r.matchScore > 70).length,
    icon: Star,
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    sub: recs.length
      ? `↑ +${matchImprovement}% match quality`
      : 'Improve profile for better matches'
  },
  {
    label: 'Profile Strength',
    value: `${profileStrength}%`,
    icon: Briefcase,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-500/10',
    sub:
      profileStrength < 60
        ? 'Add skills to improve'
        : profileStrength < 80
          ? 'Looking good'
          : 'Strong profile'
  }
]
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening'

  return (
    <div className="animate-fadeIn space-y-6">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {greeting}, {firstName} ✦
          </h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Here's what's happening with your job search today.
          </p>
        </div>

        <Link to="/browse" className="btn-primary hidden sm:inline-flex">
          Browse jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* STATS - FULL WIDTH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {loadingApps || loadingRecs
          ? Array(3).fill(0).map((_, i) => <StatSkeleton key={i} />)
          : stats.map(s => (
            <div key={s.label} className="card w-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-ink-muted font-medium uppercase tracking-wide">
                  {s.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>

              <div className="font-display text-3xl font-bold text-ink">
                {s.value}
              </div>

              {/* Progress bar ONLY for Profile Strength */}
              {s.label === 'Profile Strength' && (
                <div className="w-full h-2 bg-surface-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${profileStrength}%` }}
                  />
                </div>
              )}

              <p className="text-xs text-ink-light mt-1">
                {s.sub}
              </p>
            </div>
          ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* TOP MATCHES */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="section-title">Top Matches</h2>
            </div>

            <Link
              to="/recommendations"
              className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingRecs ? (
            Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : topRecs.length === 0 ? (
            <div className="card text-center py-10 border-dashed border-2 border-surface-200">
              <Sparkles className="w-8 h-8 text-ink-light mx-auto mb-3" />
              <p className="font-display font-semibold text-ink mb-1">
                No matches yet
              </p>
              <p className="text-xs text-ink-light mb-4">
                Complete your profile to receive personalized job recommendations.
              </p>
              <Link to="/profile" className="btn-primary inline-flex">
                Complete Profile
              </Link>
            </div>
          ) : (
            topRecs.map(job => (
              <JobCard
                key={job.jobId}
                job={job}
                role="JobSeeker"
                showMatch
              />
            ))
          )}
        </div>

        {/* APPLICATIONS */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Recent Applications</h2>

            <Link
              to="/applications"
              className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium"
            >
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingApps ? (
            Array(3).fill(0).map((_, i) => <AppCardSkeleton key={i} />)
          ) : recentApps.length === 0 ? (
            <div className="card text-center py-8 border-dashed border-2 border-surface-200">
              <FileText className="w-7 h-7 text-ink-light mx-auto mb-2" />
              <p className="text-sm text-ink-muted mb-3">
                No applications yet
              </p>
              <Link to="/browse" className="btn-primary inline-flex text-xs">
                Find Jobs
              </Link>
            </div>
          ) : (
            <>
              {recentApps.map(app => (
                <ApplicationCard
                  key={app.applicationId}
                  app={app}
                  compact
                />
              ))}

              {apps.length > 4 && (
                <Link
                  to="/applications"
                  className="block text-center text-xs text-ink-muted hover:text-brand-600 py-2"
                >
                  + {apps.length - 4} more applications →
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}