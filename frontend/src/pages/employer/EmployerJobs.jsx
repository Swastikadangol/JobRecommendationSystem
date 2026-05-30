import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { employerApi } from '../../api'
import JobCard from '../../components/shared/JobCard'
import FilterBar from '../../components/shared/FilterBar'
import { CardSkeleton } from '../../components/shared/Skeleton'
import { useToast } from '../../context/ToastContext'
import { Briefcase, CirclePlus, CircleAlert, X, LogOut } from 'lucide-react'

const DEFAULT_FILTERS = { search: '', jobType: '', isActive: '' }

/* ── Delete confirm modal ───────────────────────────────── */
function DeleteModal({ job, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-modal dark:shadow-dark-modal w-full max-w-xs animate-fadeIn">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <CircleAlert className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-lg mb-1">
            Delete this job?
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium text-slate-700 dark:text-slate-300">"{job.jobTitle}"</span>
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This will remove all associated applications and cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-outline flex-1 justify-center">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <X className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────────── */
export default function EmployerJobs() {
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const { addToast } = useToast()

  const [jobs,    setJobs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [deleting, setDeleting] = useState(null) // job pending delete confirm

  useEffect(() => {
    if (!user?.profileId) return
    employerApi.getMyJobs(user.profileId)
      .then(r => setJobs(r.data || []))
      .catch(() => addToast('Failed to load jobs', 'error'))
      .finally(() => setLoading(false))
  }, [user?.profileId])

  const handleEdit           = (job) => navigate(`/employer/jobs/${job.jobId}/edit`)
  const handleViewCandidates = (job) => navigate(`/employer/jobs/${job.jobId}/applicants`)
  const handleClose          = (job) => setDeleting(job)

  const confirmDelete = async () => {
    try {
      await employerApi.deleteJob(deleting.jobId)
      setJobs(prev => prev.filter(j => j.jobId !== deleting.jobId))
      addToast('Job deleted successfully', 'success')
    } catch (_err) {
      addToast('Failed to delete job', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = useMemo(() => {
    let list = [...jobs]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(j =>
        j.jobTitle?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.jobDescription?.toLowerCase().includes(q)
      )
    }
    if (filters.jobType !== '')
      list = list.filter(j =>
        String(j.jobType) === filters.jobType ||
        j.jobType === parseInt(filters.jobType)
      )
    if (filters.isActive !== '')
      list = list.filter(j =>
        filters.isActive === 'true'
          ? j.isActive !== false && !isExpired(j.deadline)
          : j.isActive === false  || isExpired(j.deadline)
      )
    return list.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0))
  }, [jobs, filters])

  return (
    <div className="animate-fadeIn space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-brand-600" />
            <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
              My Jobs
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your listings and view applicants.
          </p>
        </div>
        <Link to="/employer/post-job" className="btn-primary hidden sm:inline-flex">
          <CirclePlus className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      {/* ── Filter bar ── */}
      <div className="card">
        <FilterBar
          role="Employer"
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          totalCount={filtered.length}
        />
      </div>

      {/* ── Job grid ── */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-14 border-dashed border-2 border-slate-200 dark:border-slate-700">
          <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-display font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {filters.search || filters.jobType || filters.isActive
              ? 'No jobs match your filters'
              : 'No jobs posted yet'}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
            {filters.search || filters.jobType || filters.isActive
              ? 'Try adjusting your filters'
              : 'Create your first listing to start hiring'}
          </p>
          {!filters.search && !filters.jobType && !filters.isActive && (
            <Link to="/employer/post-job" className="btn-primary inline-flex">
              <CirclePlus className="w-4 h-4" /> Post a Job
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(job => (
            <JobCard
              key={job.jobId}
              job={job}
              role="Employer"
              onEdit={handleEdit}
              onClose={handleClose}
              onViewCandidates={handleViewCandidates}
            />
          ))}
        </div>
      )}

      {/* ── Delete modal ── */}
      {deleting && (
        <DeleteModal
          job={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

function isExpired(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}
