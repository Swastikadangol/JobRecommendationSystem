import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jobSeekerApi } from '../../api'
import JobCard from '../../components/shared/JobCard'
import FilterBar from '../../components/shared/FilterBar'
import { CardSkeleton } from '../../components/shared/Skeleton'
import { Sparkles, TrendingUp } from 'lucide-react'
import {  isJobExpired } from '../../utils/helpers'

const DEFAULT_FILTERS = { search: '', jobType: '', workMode: '', location: '' }

export default function Recommendations() {
  const { user } = useAuth()
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  useEffect(() => {
    if (!user?.profileId) return
    setLoading(true)
    jobSeekerApi.getRecommendations(user.profileId)
      .then(r => setRecs(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.profileId])

  // Only jobs with matchScore > 0, sorted descending
  const validRecs = useMemo(() =>
    recs.filter(j => j.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore),
    [recs]
  )

  const filtered = useMemo(() => {
    let list = [...validRecs]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(j =>
        j.jobTitle?.toLowerCase().includes(q) ||
        j.requiredSkills?.toLowerCase().includes(q) ||
        j.companyName?.toLowerCase().includes(q)
      )
    }
    if (filters.jobType !== '') list = list.filter(j => String(j.jobType) === filters.jobType || j.jobType === parseInt(filters.jobType))
    if (filters.workMode !== '') list = list.filter(j => String(j.workMode) === filters.workMode || j.workMode === parseInt(filters.workMode))
    if (filters.location) list = list.filter(j => j.location?.toLowerCase().includes(filters.location.toLowerCase()))
    return list
  }, [validRecs, filters])

  // Score buckets (excluding expired for clarity)
  const active = validRecs.filter(r => !isJobExpired(r.deadline))
  const excellent = active.filter(r => r.matchScore >= 80).length
  const good = active.filter(r => r.matchScore >= 50 && r.matchScore < 80).length
  const fair = active.filter(r => r.matchScore < 50 && r.matchScore > 0).length

  return (
    <div className="animate-fadeIn space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h1 className="font-display text-2xl font-semibold text-ink">Recommendations</h1>
        </div>
        <p className="text-sm text-ink-muted">Jobs matched to your skills — sorted by best fit first.</p>
      </div>

      {/* Score buckets */}
      {!loading && validRecs.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center py-4">
            <div className="font-display text-2xl font-bold text-emerald-600">{excellent}</div>
            <div className="text-xs text-ink-muted mt-0.5">Excellent</div>
            <div className="text-xs text-emerald-500 font-medium mt-0.5">≥ 80%</div>
          </div>
          <div className="card text-center py-4">
            <div className="font-display text-2xl font-bold text-brand-600">{good}</div>
            <div className="text-xs text-ink-muted mt-0.5">Good</div>
            <div className="text-xs text-brand-500 font-medium mt-0.5">50 – 79%</div>
          </div>
          <div className="card text-center py-4">
            <div className="font-display text-2xl font-bold text-amber-500">{fair}</div>
            <div className="text-xs text-ink-muted mt-0.5">Fair</div>
            <div className="text-xs text-amber-500 font-medium mt-0.5">1 – 49%</div>
          </div>
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
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 border-dashed border-2 border-surface-200">
          {validRecs.length === 0 ? (
            <>
              <TrendingUp className="w-10 h-10 text-ink-light mx-auto mb-3" />
              <h3 className="font-display font-semibold text-ink mb-2">No recommendations yet</h3>
              <p className="text-sm text-ink-muted mb-4">Add your skills and experience to get personalized job matches</p>
              <Link to="/profile" className="btn-primary inline-flex">Complete profile</Link>
            </>
          ) : (
            <>
              <Sparkles className="w-10 h-10 text-ink-light mx-auto mb-3" />
              <p className="font-display font-semibold text-ink mb-1">No matches for these filters</p>
              <p className="text-sm text-ink-muted">Try removing some filters</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(job => <JobCard key={job.jobId} job={job} role="JobSeeker" showMatch />)}
        </div>
      )}
    </div>
  )
}