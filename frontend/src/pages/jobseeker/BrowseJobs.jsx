import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { jobSeekerApi } from '../../api'
import JobCard from '../../components/shared/JobCard'
import FilterBar from '../../components/shared/FilterBar'
import { CardSkeleton } from '../../components/shared/Skeleton'
import { Briefcase, Sparkles } from 'lucide-react'
import { parseSkills, isJobExpired } from '../../utils/helpers'

const DEFAULT_FILTERS = { search: '', jobType: '', workMode: '', location: '' }

function relevanceScore(job, userSkills) {
  if (!userSkills || userSkills.length === 0) return 0
  const jobSkills = parseSkills(job.requiredSkills).map(s => s.toLowerCase())
  return userSkills.filter(s => jobSkills.includes(s.toLowerCase())).length
}

export default function BrowseJobs() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  useEffect(() => {
    if (!user?.profileId) return
    Promise.all([
      jobSeekerApi.getApprovedJobs(user.profileId),
      jobSeekerApi.getProfile(user.profileId),
    ])
      .then(([jobsRes, profileRes]) => {
        setJobs(jobsRes.data || [])
        setProfile(profileRes.data)
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [user?.profileId])

  const userSkills = useMemo(() => parseSkills(profile?.skills), [profile])

  const filtered = useMemo(() => {
    let list = [...jobs]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(j =>
        j.jobTitle?.toLowerCase().includes(q) ||
        j.requiredSkills?.toLowerCase().includes(q) ||
        j.companyName?.toLowerCase().includes(q) ||
        j.jobDescription?.toLowerCase().includes(q)
      )
    }
    if (filters.jobType !== '') list = list.filter(j => String(j.jobType) === filters.jobType || j.jobType === parseInt(filters.jobType))
    if (filters.workMode !== '') list = list.filter(j => String(j.workMode) === filters.workMode || j.workMode === parseInt(filters.workMode))
    if (filters.location) list = list.filter(j => j.location?.toLowerCase().includes(filters.location.toLowerCase()))

    // Within each group: relevance (skill match) first, then most recent.
    list.sort((a, b) => {
      const aExpired = isJobExpired(a.deadline)
      const bExpired = isJobExpired(b.deadline)
      if (aExpired !== bExpired) return aExpired ? 1 : -1// active first, expired last

      const sa = relevanceScore(a, userSkills)
      const sb = relevanceScore(b, userSkills)
      if (sb !== sa) return sb - sa

      return new Date(b.postedAt || 0) - new Date(a.postedAt || 0)
    })

    return list
  }, [jobs, filters, userSkills])

  const activeJobs = filtered.filter(j => !isJobExpired(j.deadline))
  const relevantCount = activeJobs.filter(j => relevanceScore(j, userSkills) > 0).length

  return (
    <div className="animate-fadeIn space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-5 h-5 text-brand-600" />
          <h1 className="font-display text-2xl font-semibold text-ink">Browse Jobs</h1>
        </div>
        <p className="text-sm text-ink-muted">All available positions — your skill matches appear first.</p>
      </div>

      {!loading && relevantCount > 0 && userSkills.length > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            <span className="font-semibold">{relevantCount} jobs</span> match your skills — showing them first
          </p>
        </div>
      )}

      <div className="card">
        <FilterBar
          role="JobSeeker"
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          totalCount={filtered.length}
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(9).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-14 border-dashed border-2 border-surface-200">
          <Briefcase className="w-10 h-10 text-ink-light mx-auto mb-3" />
          <p className="font-display font-semibold text-ink mb-1">No jobs found</p>
          <p className="text-sm text-ink-muted">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-7">
          {filtered.map(job => (
            <JobCard key={job.jobId} job={job} role="JobSeeker" showMatch={true} />
          ))}
        </div>
      )}
    </div>
  )
}