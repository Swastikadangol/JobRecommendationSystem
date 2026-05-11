import { useNavigate } from 'react-router-dom'
import { TrendingUp, ArrowRight, Building2, Calendar, Ban } from 'lucide-react'
import { statusBadge, timeAgo, isJobExpired } from '../../utils/helpers'

// compact=true  → used in Dashboard recent apps (smaller, no date row at top)
// compact=false → used in Applications page (full card)
export default function ApplicationCard({ app, compact = false }) {
  const navigate        = useNavigate()
  const { label, cls }  = statusBadge(app.applicationStatus)
  const expired         = isJobExpired(app.deadline)

  return (
    <div
      className="card-hover animate-fadeIn"
      onClick={() => navigate(`/jobs/${app.jobId}`)}
    >
      <div className="flex items-start justify-between gap-3">

        {/* Left: icon + info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Company icon */}
         <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5
                bg-brand-50 dark:bg-brand-500/10
                border border-brand-100 dark:border-brand-800/60">
  <Building2 className="w-4 h-4 text-brand-500 dark:text-brand-400 flex-shrink-0" />
</div>

          <div className="min-w-0">
            {/* Title + status badge */}
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                {app.jobTitle}
              </h3>
              <span className={cls}>{label}</span>
              {expired && (
                <span className="badge badge-red">
                  <Ban className="w-3 h-3" /> Expired
                </span>
              )}
            </div>

            {/* Company name */}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.companyName}
            </p>

            {/* Date — shown in full card only */}
            {!compact && (
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                <Calendar className="w-3 h-3" />
                Applied {timeAgo(app.appliedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Right: match score + arrow */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {app.matchScore !== undefined && (
            <div className="text-right hidden sm:block">
              <div className="font-display font-bold text-brand-600 dark:text-brand-400 text-base leading-none">
                {Math.round(app.matchScore)}%
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-0.5 justify-end mt-0.5">
                <TrendingUp className="w-3 h-3" /> match
              </div>
            </div>
          )}
          <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 transition-colors" />
        </div>

      </div>

      {/* Date row for compact mode */}
      {compact && (
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Applied {timeAgo(app.appliedAt)}
          </span>
        </div>
      )}
    </div>
  )
}