import { useNavigate } from 'react-router-dom'

import {
  TrendingUp,
  ArrowRight,
  Building2,
  Calendar,
  Ban
} from 'lucide-react'

import {
  statusBadge,
  timeAgo,
  isJobExpired
} from '../../utils/helpers'

/**
 * ─────────────────────────────────────────────
 * APPLICATION CARD COMPONENT
 * ─────────────────────────────────────────────
 * Displays a job application made by the user
 *
 * Features:
 * - Job title + company
 * - Application status badge
 * - Match score
 * - Expired job indicator
 * - Applied date
 * - Click navigation to job details page
 *
 * Props:
 * - app → application data object
 * - compact → smaller layout version
 */ 

export default function ApplicationCard({app, compact = false}){
    //react router naviagtion hook
    const navigate = useNavigate()

    /**
   * Get badge label + class based on application status
   * Example:
   * Applied → blue badge
   * Rejected → red badge
   */
  const {label, cls} = statusBadge(app.applicationStatus);

  //check if the job deadline has passed
  const expired = isJobExpired(app.deadline)

  return (

    /**
     * Main card container
     * Clicking card navigates to job details page
     */
    <div
      className="card hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
      onClick={() => navigate(`/jobs/${app.jobId}`)}
    >

      <div className="flex items-start justify-between gap-3">

        {/* ─────────────────────────────
            LEFT SECTION
            Job info + status
        ───────────────────────────── */}
        <div className="flex items-start gap-3 flex-1 min-w-0">

          {/* Company / job icon */}
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Building2 className="w-4 h-4 text-brand-400" />
          </div>

          <div className="min-w-0">

            {/* Job title + badges */}
            <div className="flex items-center gap-2 flex-wrap mb-0.5">

              {/* Job title */}
              <h3 className="font-display font-semibold text-ink text-sm leading-snug truncate">
                {app.jobTitle}
              </h3>

              {/* Application status badge */}
              <span className={cls}>
                {label}
              </span>

              {/* Expired job badge */}
              {expired && (
                <span className="badge badge-red flex items-center gap-1">
                  <Ban className="w-3 h-3" />
                  Expired
                </span>
              )}
            </div>

            {/* Company name */}
            <p className="text-xs text-ink-muted">
              {app.companyName}
            </p>

            {/* Applied date (hidden in compact mode) */}
            {!compact && (
              <div className="flex items-center gap-3 mt-1.5">

                <span className="flex items-center gap-1 text-xs text-ink-light">
                  <Calendar className="w-3 h-3" />

                  {/* Relative applied time */}
                  Applied {timeAgo(app.appliedAt)}
                </span>

              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────
            RIGHT SECTION
            Match score + arrow
        ───────────────────────────── */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {/* Match score */}
          {app.matchScore !== undefined && (

            <div className="text-right hidden sm:block">

              {/* Match percentage */}
              <div className="font-display font-bold text-brand-600 text-base">
                {Math.round(app.matchScore)}%
              </div>

              {/* Match label */}
              <div className="text-xs text-ink-light flex items-center gap-1 justify-end">
                <TrendingUp className="w-3 h-3" />
                match
              </div>

            </div>
          )}

          {/* Arrow icon */}
          <ArrowRight className="w-4 h-4 text-ink-light group-hover:text-brand-500 transition-colors" />
        </div>
      </div>

      {/* ─────────────────────────────
          COMPACT MODE FOOTER
      ─────────────────────────────
          Smaller applied date section
          shown only in compact layout
      */}
      {compact && (
        <div className="mt-2 pt-2 border-t border-surface-100">

          <span className="text-xs text-ink-light">
            Applied {timeAgo(app.appliedAt)}
          </span>

        </div>
      )}
    </div>
  )
}