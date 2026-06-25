import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { adminApi } from '../../api'
import { useToast } from '../../context/ToastContext'
import { AppCardSkeleton } from '../../components/shared/Skeleton'
import UserDetailModal from './AdminUserDetail'
import {
  Users, Search, X, ShieldOff, Trash2,
  CircleCheck, Mail, Calendar, Eye,
  Building2, Briefcase
} from 'lucide-react'

const ROLE_TABS = [
  { label: 'All',         value: 'all'       },
  { label: 'Job Seekers', value: 'jobseeker' },
  { label: 'Employers',   value: 'employer'  },
]

const AVATAR_COLORS = [
  'from-violet-500 to-violet-600',
  'from-sky-500 to-sky-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
  'from-indigo-500 to-indigo-600',
]
const avatarGrad = (name = '') =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]

/* ── Delete Modal ───────────────────────────────────────── */
function DeleteModal({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-xs p-6 text-center animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-lg mb-1">
          Delete user?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium text-slate-700 dark:text-slate-300">{user.userName}</span>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          All associated data will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-outline flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────────── */
export default function AdminUsers() {
  const { addToast }               = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const [users,    setUsers]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [toggling, setToggling] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [viewing,  setViewing]  = useState(null)

  const roleTab = searchParams.get('role') || 'all'

  const fetchUsers = async (role) => {
    setLoading(true)
    try {
      const r = role === 'jobseeker'
        ? await adminApi.getJobSeekers()
        : role === 'employer'
          ? await adminApi.getEmployers()
          : await adminApi.getUsers()
      setUsers(r.data || [])
    } catch (_err) {
      addToast('Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers(roleTab) }, [roleTab])

  const toggle = async (userId) => {
    setToggling(userId)
    try {
      await adminApi.toggleUser(userId)
      setUsers(prev => prev.map(u =>
        u.userId === userId
          ? { ...u, status: u.status === 0 || u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      ))
      addToast('User status updated', 'success')
    } catch (_err) { addToast('Failed to toggle user', 'error') }
    finally { setToggling(null) }
  }

  const confirmDelete = async () => {
    try {
      await adminApi.deleteUser(deleting.userId)
      setUsers(prev => prev.filter(u => u.userId !== deleting.userId))
      addToast('User deleted', 'success')
    } catch (_err) { addToast('Failed to delete user', 'error') }
    finally { setDeleting(null) }
  }

  const filtered = useMemo(() => {
    if (!search) return users
    const q = search.toLowerCase()
    return users.filter(u =>
      u.userName?.toLowerCase().includes(q)    ||
      u.email?.toLowerCase().includes(q)       ||
      u.fullName?.toLowerCase().includes(q)    ||
      u.companyName?.toLowerCase().includes(q)
    )
  }, [users, search])

  const isActive      = (u) => u.status === 0 || u.status === 'Active'
  const activeCount   = users.filter(isActive).length
  const inactiveCount = users.length - activeCount

  return (
    <div className="animate-fadeIn space-y-5">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-brand-600" />
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Manage Users
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View user details, activate, deactivate or remove accounts.
        </p>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:'Total',    value:users.length,   color:'text-brand-600 dark:text-brand-400',    bg:'bg-brand-50 dark:bg-brand-500/10'   },
            { label:'Active',   value:activeCount,    color:'text-emerald-600 dark:text-emerald-400', bg:'bg-emerald-50 dark:bg-emerald-500/10'},
            { label:'Inactive', value:inactiveCount,  color:'text-slate-500 dark:text-slate-400',     bg:'bg-slate-100 dark:bg-slate-800'      },
          ].map(s => (
            <div key={s.label} className="card text-center py-3">
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-1.5">
            {ROLE_TABS.map(t => (
              <button key={t.value}
                onClick={() => { setSearchParams(t.value !== 'all' ? { role: t.value } : {}); setSearch('') }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  roleTab === t.value
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search name or email…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm w-full" />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="text-xs text-slate-400 flex-shrink-0">
            {filtered.length} user{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* User list */}
      {loading ? (
        <div className="space-y-3">
          {Array(6).fill(0).map((_, i) => <AppCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-14 border-dashed border-2 border-slate-200 dark:border-slate-700">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-display font-semibold text-slate-700 dark:text-slate-300 mb-1">No users found</p>
          <p className="text-sm text-slate-400">Try adjusting your search</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(u => {
            const active      = isActive(u)
            const grad        = avatarGrad(u.userName || '')
            const displayName = u.fullName || u.companyName || u.userName || '?'
            const initial     = displayName[0].toUpperCase()
            const isJobSeeker = u.role === 0 || u.role === 'JobSeeker'
            const isEmployer  = u.role === 1 || u.role === 'Employer'
            const roleLabel   = isJobSeeker ? 'Job Seeker' : isEmployer ? 'Employer' : 'Admin'

            return (
              <div key={u.userId} className="card">
                <div className="flex items-center gap-4 flex-wrap">

                  {/* Gradient avatar */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm ${!active ? 'opacity-50 grayscale' : ''}`}>
                    {initial}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {displayName}
                      </span>
                      {u.userName !== displayName && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">@{u.userName}</span>
                      )}
                      {/* Status badge */}
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        active
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }`}>
                        {active ? 'Active' : 'Inactive'}
                      </span>
                      {/* Role badge */}
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        isJobSeeker
                          ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
                          : isEmployer
                            ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {roleLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                        <Mail className="w-3 h-3" /> {u.email}
                      </span>
                      {u.createdAt && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(u.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                        </span>
                      )}
                      {u.totalApps > 0 && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <Briefcase className="w-3 h-3" /> {u.totalApps} applications
                        </span>
                      )}
                      {u.totalJobs > 0 && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <Building2 className="w-3 h-3" /> {u.totalJobs} jobs posted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* VIEW button — prominent */}
                    <button
                      onClick={() => setViewing(u.userId)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/40 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>

                    {/* Toggle */}
                    <button
                      disabled={toggling === u.userId}
                      onClick={() => toggle(u.userId)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        active
                          ? 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          : 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                      }`}>
                      {toggling === u.userId ? (
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/>
                        </svg>
                      ) : active ? (
                        <><ShieldOff className="w-3.5 h-3.5" /> Deactivate</>
                      ) : (
                        <><CircleCheck className="w-3.5 h-3.5" /> Activate</>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleting(u)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {viewing  && <UserDetailModal userId={viewing} onClose={() => setViewing(null)} />}
      {deleting && <DeleteModal user={deleting} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />}
    </div>
  )
}