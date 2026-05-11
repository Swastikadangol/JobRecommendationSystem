import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* Authentication context */
import { useAuth } from '../../context/AuthContext'

/* API methods */
import { jobSeekerApi } from '../../api'

/* Reusable components */
import ApplicationCard from '../../components/shared/ApplicationCard'
import { AppCardSkeleton } from '../../components/shared/Skeleton'

/* Icons */
import { FileText, CheckCircle, Users } from 'lucide-react'

/* ─────────────────────────────────────────────
   Application status tabs
───────────────────────────────────────────── */
const STATUS_TABS = [
  { label: 'All',         value: null },
  { label: 'Applied',     value: 0 },
  { label: 'Reviewed',    value: 1 },
  { label: 'Shortlisted', value: 2 },
  { label: 'Rejected',    value: 3 },
  { label: 'Accepted',    value: 4 },
]

/* ─────────────────────────────────────────────
   Applications Page
───────────────────────────────────────────── */
export default function Applications() {

  /* Current logged-in user */
  const { user } = useAuth()

  /* React router navigation */
  const navigate = useNavigate()

  /* Store all applications */
  const [apps, setApps] = useState([])

  /* Loading state */
  const [loading, setLoading] = useState(true)

  /* Current active filter tab */
  const [activeTab, setActiveTab] = useState(null)

  /* ─────────────────────────────────────────
     Fetch applications on component mount
  ───────────────────────────────────────── */
  useEffect(() => {

    // Stop if profileId does not exist
    if (!user?.profileId) return

    // Fetch applications
    jobSeekerApi.getApplications(user.profileId)

      // Save response data
      .then(r => setApps(r.data?.data || []))

      // Ignore errors silently
      .catch(() => {})

      // Stop loading
      .finally(() => setLoading(false))

  }, [user?.profileId])

  /* ─────────────────────────────────────────
     Sort applications by latest applied date
  ───────────────────────────────────────── */
  const sorted = [...apps].sort(
    (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
  )

  /* ─────────────────────────────────────────
     Filter applications by selected tab
  ───────────────────────────────────────── */
  const filtered =
    activeTab === null
      ? sorted
      : sorted.filter(a =>
          a.applicationStatus === activeTab ||
          a.applicationStatus ===
            STATUS_TABS.find(t => t.value === activeTab)?.label
        )

  /* ─────────────────────────────────────────
     Count applications for each tab
  ───────────────────────────────────────── */
  const count = (val) => {

    // Total count
    if (val === null) return apps.length

    // Count by status
    return apps.filter(a =>
      a.applicationStatus === val ||
      a.applicationStatus ===
        STATUS_TABS.find(t => t.value === val)?.label
    ).length
  }

  return (
    <div className="animate-fadeIn space-y-5">

      {/* ─────────────────────────────────────
          Page Header
      ───────────────────────────────────── */}
      <div>

        {/* Title row */}
        <div className="flex items-center gap-2 mb-1">

          {/* Header icon */}
          <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />

          {/* Heading */}
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
            My Applications
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track all your job applications and their status.
        </p>
      </div>

      {/* ─────────────────────────────────────
          Statistics Cards
      ───────────────────────────────────── */}
      {!loading && apps.length > 0 && (

        <div className="grid grid-cols-3 gap-3">

          {/* ── Total Applications ── */}
          <div className="card flex items-center gap-3">

            {/* Icon box */}
           <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                bg-brand-50 dark:bg-brand-500/10
                border border-brand-100 dark:border-brand-800/60
                transition-colors">
  <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
</div>

            {/* Content */}
            <div>

              {/* Count */}
              <div className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
                {apps.length}
              </div>

              {/* Label */}
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Total applied
              </div>
            </div>
          </div>

          {/* ── Shortlisted Applications ── */}
          <div className="card flex items-center gap-3">

            {/* Icon box */}
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 flex items-center justify-center flex-shrink-0">

              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>

            {/* Content */}
            <div>

              {/* Count */}
              <div className="font-display text-2xl font-bold text-purple-600 dark:text-purple-400">
                {
                  apps.filter(
                    a =>
                      a.applicationStatus === 2 ||
                      a.applicationStatus === 'Shortlisted'
                  ).length
                }
              </div>

              {/* Label */}
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Shortlisted
              </div>
            </div>
          </div>

          {/* ── Accepted Applications ── */}
          <div className="card flex items-center gap-3">

            {/* Icon box */}
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center flex-shrink-0">

              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            {/* Content */}
            <div>

              {/* Count */}
              <div className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {
                  apps.filter(
                    a =>
                      a.applicationStatus === 4 ||
                      a.applicationStatus === 'Accepted'
                  ).length
                }
              </div>

              {/* Label */}
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Accepted
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────
          Status Filter Tabs
      ───────────────────────────────────── */}
      <div className="flex gap-1.5 flex-wrap">

        {STATUS_TABS.map(tab => {

          // Count for current tab
          const c = count(tab.value)

          // Check if active
          const active = activeTab === tab.value

          return (
            <button
              key={tab.label}

              // Change active tab
              onClick={() => setActiveTab(tab.value)}

              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-400 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >

              {/* Tab label */}
              {tab.label}

              {/* Tab count badge */}
              {c > 0 && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    active
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                  }`}
                >
                  {c}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ─────────────────────────────────────
          Main Content Area
      ───────────────────────────────────── */}

      {/* Loading state */}
      {loading ? (

        <div className="grid sm:grid-cols-2 gap-3">

          {/* Skeleton cards */}
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <AppCardSkeleton key={i} />
            ))}
        </div>

      ) : filtered.length === 0 ? (

        /* Empty state */
        <div className="card text-center py-14 border-2 border-dashed border-slate-200 dark:border-slate-700">

          {/* Empty icon */}
          <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />

          {/* Main message */}
          <p className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-1">

            {apps.length === 0
              ? 'No applications yet'
              : 'No applications in this category'}
          </p>

          {/* Secondary text */}
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">

            {apps.length === 0
              ? 'Start applying to jobs that match your profile'
              : ''}
          </p>

          {/* Browse jobs button */}
          {apps.length === 0 && (
            <button
              onClick={() => navigate('/browse')}
              className="btn-primary inline-flex"
            >
              Browse jobs
            </button>
          )}
        </div>

      ) : (

        /* Applications grid */
        <div className="grid sm:grid-cols-2 gap-3">

          {filtered.map(app => (

            <ApplicationCard
              key={app.applicationId}
              app={app}
            />
          ))}
        </div>
      )}

    </div>
  )
}