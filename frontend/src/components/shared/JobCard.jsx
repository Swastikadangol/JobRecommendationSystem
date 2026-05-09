import { useNavigate } from 'react-router-dom'
import {
  MapPin, Clock, Briefcase, TrendingUp,
  Users, Edit2, XCircle, CheckCircle, Ban, AlertTriangle
} from 'lucide-react'

import {
  jobTypeLabel,
  workModeLabel,
  parseSkills,
  timeAgo,
  matchColor,
  isJobExpired,
  daysUntil
} from '../../utils/helpers'

//color mappings for badge
//work mode display color
const workModeColors = {
  Remote : 'badge-green',
  1: 'badge-green',

  Hybrid: 'badge-blue',
  2: 'badge-blue',

  OnSite: 'badge-gray',
  0: 'badge-gray',
}

// Job type display colors
const jobTypeColors = {
  FullTime: 'badge-purple',
  0: 'badge-purple',

  PartTime: 'badge-yellow',
  1: 'badge-yellow',

  Internship: 'badge-blue',
  2: 'badge-blue',
}

// Job status colors (Admin panel)
const jobStatusColors = {
  0: 'badge-yellow',   // Pending
  1: 'badge-green',    // Approved
  2: 'badge-red',      // Rejected
  3: 'badge-gray',     // Closed

  Pending: 'badge-yellow',
  Approved: 'badge-green',
  Rejected: 'badge-red',
  Closed: 'badge-gray',
}


// Job status labels (Admin panel text)
const jobStatusLabels = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Closed',

  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Closed: 'Closed',
}

//job seeker card

function JobSeekerCard({job, showMatch}){
  //navigation
  const navigate = useNavigate()

  //convert comma-seperated skills into array
  const skills = parseSkills(job.requiredSkills)

  //check if job deadline is passed
  const expired = isJobExpired(job.deadline)

  //calculate remaining days
  const days = daysUntil(job.deadline)

  //mark urgent jobs(closing soon)
  const urgentsoon = !expired && days !== null && days<=5

    return (
    <div
      className={`card-hover animate-fadeIn relative ${expired ? 'opacity-75' : ''}`}
      onClick={() => navigate(`/jobs/${job.jobId}`)}
    >
      {/* Expired badge (top-right corner) */}
      {expired && (
        <div className="absolute top-3 right-3 z-10">
          <span className="badge badge-red flex items-center gap-1">
            <Ban className="w-3 h-3" /> Expired
          </span>
        </div>
      )}

      {/* Job title + company section */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">

          {/* Job icon */}
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-brand-500" />
          </div>

          {/* Title + company */}
          <div className="min-w-0 pr-2">
            <h3 className="font-display font-semibold text-ink truncate">
              {job.jobTitle}
            </h3>
            <p className="text-sm text-ink-muted truncate">
              {job.companyName || 'Company'}
            </p>
          </div>
        </div>

        {/* Match score (large view if enabled) */}
        {showMatch && job.matchScore !== undefined && !expired && (
          <div className="text-right">
            <div className={`font-bold text-xl ${matchColor(job.matchScore)}`}>
              {Math.round(job.matchScore)}%
            </div>
            <div className="text-xs text-ink-light flex items-center gap-1 justify-end">
              <TrendingUp className="w-3 h-3" /> match
            </div>
          </div>
        )}

        {/* Match score (small view for browse page) */}
        {!showMatch && job.matchScore !== undefined && job.matchScore > 0 && !expired && (
          <span className={`text-xs font-semibold ${matchColor(job.matchScore)}`}>
            {Math.round(job.matchScore)}% match
          </span>
        )}
      </div>

      {/* Job meta info */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`badge ${jobTypeColors[job.jobType]}`}>
          {jobTypeLabel(job.jobType)}
        </span>

        <span className={`badge ${workModeColors[job.workMode]}`}>
          {workModeLabel(job.workMode)}
        </span>

        {job.location && (
          <span className="text-xs text-ink-light flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
        )}

        {job.salaryRange && (
          <span className="text-xs text-ink-light">
            💰 {job.salaryRange}
          </span>
        )}
      </div>

      {/* Skills list */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {skills.slice(0, 5).map(skill => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Footer: posted time + deadline info */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-100">

        {/* Posted time */}
        <span className="text-xs text-ink-light flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(job.postedAt)}
        </span>

        {/* Deadline status */}
        {expired ? (
          <span className="text-xs text-red-400 font-medium">
            Closed
          </span>
        ) : urgentSoon ? (
          <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {days === 0 ? 'Closes today' : `${days}d left`}
          </span>
        ) : (
          job.deadline && (
            <span className="text-xs text-ink-light">
              Closes {new Date(job.deadline).toLocaleDateString()}
            </span>
          )
        )}
      </div>
    </div>
  )
}

//employer card 
function EmployerCard({ job, onEdit, onClose, onViewCandidates }) {
  const expired = isExpired(job.deadline)

  // Active = not expired + not manually closed
  const isActive = job.isActive !== false && !expired

  return (
    <div className="card animate-fadeIn">

      {/* Job header */}
      <div className="flex items-start justify-between mb-3">

        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-brand-500" />
          </div>

          <div>
            <h3 className="font-semibold">{job.jobTitle}</h3>
            <p className="text-xs text-ink-light">
              Posted {timeAgo(job.postedAt)}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`badge ${isActive ? 'badge-green' : 'badge-gray'}`}>
          {expired ? 'Expired' : isActive ? 'Active' : 'Closed'}
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div>
          <div className="font-bold">{job.applicantCount ?? 0}</div>
          <div className="text-xs text-ink-muted">Applicants</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onEdit && <button onClick={() => onEdit(job)}>Edit</button>}
        {onViewCandidates && <button onClick={() => onViewCandidates(job)}>Candidates</button>}
        {onClose && !expired && <button onClick={() => onClose(job)}>Close</button>}
      </div>
    </div>
  )
}

export default function JobCard(props) {
  const { job, role = 'JobSeeker' } = props

  // Render based on user role
  if (role === 'Employer') return <EmployerCard {...props} />
  if (role === 'Admin') return <AdminCard {...props} />

  return <JobSeekerCard {...props} />
}