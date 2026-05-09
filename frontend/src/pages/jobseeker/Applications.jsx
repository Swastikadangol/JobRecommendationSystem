// Import React hooks
import { useEffect, useState } from 'react'

// Import navigation hook
import { useNavigate } from 'react-router-dom'

// Import auth context
import { useAuth } from '../../context/AuthContext'

// API functions
import { jobSeekerApi } from '../../api'

// Reusable components
import ApplicationCard from '../../components/shared/ApplicationCard'
import { AppCardSkeleton } from '../../components/shared/Skeleton'

// Icons
import { FileText, CheckCircle, Users } from 'lucide-react'

// Tabs for filtering applications by status
const STATUS_TABS = [

  // Show all applications
  { label: 'All', value: null },

  // Status = Applied
  { label: 'Applied', value: 0 },

  // Status = Reviewed
  { label: 'Reviewed', value: 1 },

  // Status = Shortlisted
  { label: 'Shortlisted', value: 2 },

  // Status = Rejected
  { label: 'Rejected', value: 3 },

  // Status = Accepted
  { label: 'Accepted', value: 4 },
]

export default function Applications() {

  // Get logged-in user
  const { user } = useAuth()

  // Navigation function
  const navigate = useNavigate()

  // Store all applications
  const [apps, setApps] = useState([])

  // Loading state
  const [loading, setLoading] = useState(true)

  // Currently selected tab
  const [activeTab, setActiveTab] = useState(null)

  // Fetch applications when component loads
  useEffect(() => {

    // Stop if profileId not available
    if (!user?.profileId) return

    // Call API
    jobSeekerApi.getApplications(user.profileId)

      // Save applications into state
      .then(r => setApps(r.data?.data || []))

      // Ignore errors
      .catch(() => {})

      // Stop loading
      .finally(() => setLoading(false))

  }, [user?.profileId])

  // Sort applications by latest applied date
  const sorted = [...apps].sort(
    (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
  )

  // Filter applications based on active tab
  const filtered = activeTab === null

    // If "All" tab selected
    ? sorted

    // Otherwise filter by status
    : sorted.filter(a =>

        // Match numeric status
        a.applicationStatus === activeTab ||

        // Match string status
        a.applicationStatus ===
        STATUS_TABS.find(t => t.value === activeTab)?.label
      )

  // Function to count applications for each tab
  const count = (val) => {

    // All applications count
    if (val === null) return apps.length

    // Filter applications by status
    return apps.filter(a =>

      // Match numeric status
      a.applicationStatus === val ||

      // Match string status
      a.applicationStatus ===
      STATUS_TABS.find(t => t.value === val)?.label

    ).length
  }

  return (

    // Main page container
    <div className="animate-fadeIn space-y-5">

      {/* Header section */}
      <div>

        <div className="flex items-center gap-2 mb-1">

          {/* Header icon */}
          <FileText className="w-5 h-5 text-brand-600" />

          {/* Page title */}
          <h1 className="font-display text-2xl font-semibold text-ink">
            My Applications
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-ink-muted">
          Track all your job applications and their status.
        </p>
      </div>

      {/* Statistics cards */}
      {!loading && apps.length > 0 && (

        <div className="grid grid-cols-3 gap-3">

          {/* Total applications */}
          <div className="card flex items-center gap-3">

            {/* Icon box */}
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">

              <FileText className="w-4 h-4 text-brand-500" />
            </div>

            <div>

              {/* Total count */}
              <div className="font-display text-2xl font-bold text-ink">
                {apps.length}
              </div>

              <div className="text-xs text-ink-muted">
                Total applied
              </div>
            </div>
          </div>

          {/* Shortlisted count */}
          <div className="card flex items-center gap-3">

            {/* Icon box */}
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">

              <Users className="w-4 h-4 text-purple-500" />
            </div>

            <div>

              {/* Count shortlisted */}
              <div className="font-display text-2xl font-bold text-purple-600">

                {
                  apps.filter(a =>
                    a.applicationStatus === 2 ||
                    a.applicationStatus === 'Shortlisted'
                  ).length
                }
              </div>

              <div className="text-xs text-ink-muted">
                Shortlisted
              </div>
            </div>
          </div>

          {/* Accepted count */}
          <div className="card flex items-center gap-3">

            {/* Icon box */}
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">

              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>

            <div>

              {/* Count accepted */}
              <div className="font-display text-2xl font-bold text-emerald-600">

                {
                  apps.filter(a =>
                    a.applicationStatus === 4 ||
                    a.applicationStatus === 'Accepted'
                  ).length
                }
              </div>

              <div className="text-xs text-ink-muted">
                Accepted
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex gap-1.5 flex-wrap">

        {/* Loop through all tabs */}
        {STATUS_TABS.map(tab => {

          // Count applications for this tab
          const c = count(tab.value)

          // Check if current tab is active
          const active = activeTab === tab.value

          return (

            <button
              key={tab.label}

              // Change active tab on click
              onClick={() => setActiveTab(tab.value)}

              // Dynamic styling
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-surface-200 text-ink-muted hover:border-brand-300 hover:text-brand-600'
              }`}
            >

              {/* Tab label */}
              {tab.label}

              {/* Show count badge if count > 0 */}
              {c > 0 && (

                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    active
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-100 text-ink-muted'
                  }`}
                >

                  {/* Count value */}
                  {c}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Main content section */}
      {loading ? (

        // Loading skeleton cards
        <div className="grid sm:grid-cols-2 gap-3">

          {Array(4).fill(0).map((_, i) => (
            <AppCardSkeleton key={i} />
          ))}
        </div>

      ) : filtered.length === 0 ? (

        // Empty state
        <div className="card text-center py-14 border-dashed border-2 border-surface-200">

          {/* Empty state icon */}
          <FileText className="w-10 h-10 text-ink-light mx-auto mb-3" />

          {/* Title */}
          <p className="font-display font-semibold text-ink mb-1">

            {
              apps.length === 0
                ? 'No applications yet'
                : 'No applications in this category'
            }
          </p>

          {/* Subtitle */}
          <p className="text-sm text-ink-muted mb-4">

            {
              apps.length === 0
                ? 'Start applying to jobs that match your profile'
                : ''
            }
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

        // Show application cards
        <div className="grid sm:grid-cols-2 gap-3">

          {/* Render all filtered applications */}
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