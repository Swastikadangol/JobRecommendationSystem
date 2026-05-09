// Import React hooks
import { useEffect, useState } from 'react'

// Router hooks for URL params and navigation
import { useParams, useNavigate } from 'react-router-dom'

// Auth context (logged-in user info)
import { useAuth } from '../../context/AuthContext'

// Toast notifications
import { useToast } from '../../context/ToastContext'

// API calls
import { jobSeekerApi } from '../../api'

// Helper utilities
import {
  parseSkills,        // Convert skills string → array
  jobTypeLabel,       // Convert job type code → label
  workModeLabel,      // Convert work mode code → label
  educationLabel,     // Convert education level code → label
  formatDate,         // Format date for display
  daysUntil,          // Days remaining until deadline
  isJobExpired           // Check if job deadline passed
} from '../../utils/helpers'

// Icons
import {
  ArrowLeft, MapPin, Clock, Briefcase, GraduationCap, Calendar,
  DollarSign, Building2, CheckCircle, Send, AlertTriangle, Ban
} from 'lucide-react'

export default function JobDetail() {

  // Get job ID from URL (/job/:id)
  const { id } = useParams()

  // Logged-in user info
  const { user } = useAuth()

  // Toast notifications
  const { addToast } = useToast()

  // Navigation helper
  const navigate = useNavigate()

  // Job state
  const [job, setJob] = useState(null)

  // Loading state for job fetch
  const [loading, setLoading] = useState(true)

  // Apply button loading state
  const [applying, setApplying] = useState(false)

  // Whether user already applied
  const [applied, setApplied] = useState(false)

  // ------------------------------
  // Fetch job + application status
  // ------------------------------
  useEffect(() => {

    // Fetch all approved jobs
    jobSeekerApi.getApprovedJobs()
      .then(r => {

        // Find current job by ID
        const found = (r.data || [])
          .find(j => j.jobId === parseInt(id))

        setJob(found || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    // Check if user already applied
    if (user?.profileId) {

      jobSeekerApi.getApplications(user.profileId)
        .then(r => {

          const apps = r.data?.data || []

          // If any application matches this job
          setApplied(
            apps.some(a => a.jobId === parseInt(id))
          )
        })
        .catch(() => {})
    }

  }, [id, user?.profileId])

  // ------------------------------
  // Apply for job
  // ------------------------------
  const handleApply = async () => {

    // Must be logged in
    if (!user?.profileId) {
      addToast('Please login to apply', 'error')
      return
    }

    // Prevent applying to expired job
    if (expired) {
      addToast(
        'This job has expired and is no longer accepting applications',
        'error'
      )
      return
    }

    setApplying(true)

    try {

      // Apply API call
      const res = await jobSeekerApi.apply({
        jobSeekerId: user.profileId,
        jobId: parseInt(id)
      })

      setApplied(true)

      // Show match score
      addToast(
        `Applied! Your match score: ${Math.round(res.data.matchScore)}%`,
        'success'
      )

    } catch (err) {

      addToast(
        err.response?.data?.message || 'Could not apply',
        'error'
      )

    } finally {
      setApplying(false)
    }
  }

  // ------------------------------
  // Loading UI
  // ------------------------------
  if (loading) {
    return (
      <div className="animate-fadeIn space-y-4 max-w-3xl mx-auto">
        <div className="skeleton h-5 w-24 rounded" />
        <div className="card space-y-4">
          <div className="skeleton h-12 w-12 rounded-xl" />
          <div className="skeleton h-8 w-2/3 rounded" />
          <div className="skeleton h-4 w-1/3 rounded" />
        </div>
      </div>
    )
  }

  // ------------------------------
  // Job not found UI
  // ------------------------------
  if (!job) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-muted mb-4">Job not found.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go back
        </button>
      </div>
    )
  }

  // ------------------------------
  // Derived values
  // ------------------------------
  const skills = parseSkills(job.requiredSkills)

  const deadline = daysUntil(job.deadline)

  const expired = isJobExpired(job.deadline)

  const urgentSoon =
    !expired && deadline !== null && deadline <= 5

  // ------------------------------
  // MAIN UI
  // ------------------------------
  return (
    <div className="animate-fadeIn max-w-3xl mx-auto space-y-5">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to jobs
      </button>

      {/* ================= HERO CARD ================= */}
      <div className="card">

        {/* Expired banner */}
        {expired && (
          <div className="flex items-center gap-2.5 px-4 py-3 mb-4 rounded-xl bg-red-50 border border-red-100">
            <Ban className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600 font-medium">
              This job has expired and is no longer accepting applications.
            </p>
          </div>
        )}

        {/* Job header */}
        <div className="flex items-start justify-between gap-4 mb-4">

          {/* Title + company */}
          <div className="flex items-start gap-4">

            <div className="w-14 h-14 rounded-2xl bg-brand-50 border flex items-center justify-center">
              <Building2 className="w-6 h-6 text-brand-500" />
            </div>

            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                {job.jobTitle}
              </h1>
              <p className="text-ink-muted">
                {job.companyName || 'Company'}
              </p>
            </div>
          </div>

          {/* Urgency badge */}
          {urgentSoon && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border text-xs text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              {deadline === 0 ? 'Closes today' : `${deadline}d left`}
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-5">

          <span className="badge badge-purple">
            {jobTypeLabel(job.jobType)}
          </span>

          <span className="badge badge-green">
            {workModeLabel(job.workMode)}
          </span>

          {job.location && (
            <span className="text-xs text-ink-muted flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
          )}
        </div>

        {/* Apply button */}
        <button
          onClick={handleApply}
          disabled={applied || applying || expired}
          className="btn-primary"
        >
          {applying
            ? 'Applying...'
            : applied
              ? 'Applied'
              : expired
                ? 'Expired'
                : 'Apply now'}
        </button>
      </div>

      {/* Skills section */}
      {skills.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-3">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="px-3 py-1 bg-brand-50 rounded-xl text-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}