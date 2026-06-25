import { useEffect, useState, useMemo } from 'react'
import { adminApi } from '../../api'
import { useToast } from '../../context/ToastContext'
import { AppCardSkeleton } from '../../components/shared/Skeleton'
import {
  Building2, Search, X, ShieldOff,
  Trash2, CircleCheck, Mail, Calendar
} from 'lucide-react'

function DeleteModal({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-xs animate-fadeIn">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-lg mb-1">Delete employer?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium text-slate-700 dark:text-slate-300">{user.userName}</span>
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This will remove the account and all associated job listings.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-outline flex-1 justify-center">Cancel</button>
            <button onClick={onConfirm}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminEmployers() {
  const { addToast } = useToast()

  const [employers, setEmployers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [toggling,  setToggling]  = useState(null)
  const [deleting,  setDeleting]  = useState(null)

  useEffect(() => {
    adminApi.getEmployers()
      .then(r => setEmployers(r.data || []))
      .catch(_err => addToast('Failed to load employers', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (userId) => {
    setToggling(userId)
    try {
      await adminApi.toggleUser(userId)
      setEmployers(prev => prev.map(u =>
        u.userId === userId
          ? { ...u, status: u.status === 0 || u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      ))
      addToast('Employer status updated', 'success')
    } catch (_err) {
      addToast('Failed to toggle employer', 'error')
    } finally {
      setToggling(null)
    }
  }

  const confirmDelete = async () => {
    try {
      await adminApi.deleteUser(deleting.userId)
      setEmployers(prev => prev.filter(u => u.userId !== deleting.userId))
      addToast('Employer deleted', 'success')
    } catch (_err) {
      addToast('Failed to delete employer', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = useMemo(() => {
    if (!search) return employers
    const q = search.toLowerCase()
    return employers.filter(u =>
      u.userName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  }, [employers, search])

  const isActive = (u) => u.status === 0 || u.status === 'Active'
  const activeCount   = employers.filter(isActive).length
  const inactiveCount = employers.length - activeCount

  return (
    <div className="animate-fadeIn space-y-5">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-brand-600" />
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Employers
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage all registered employer accounts on the platform.
        </p>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total',    value: employers.length, color: 'text-brand-600 dark:text-brand-400',   bg: 'bg-brand-50 dark:bg-brand-500/10'   },
            { label: 'Active',   value: activeCount,      color: 'text-emerald-600 dark:text-emerald-400',bg: 'bg-emerald-50 dark:bg-emerald-500/10'},
            { label: 'Inactive', value: inactiveCount,    color: 'text-slate-500 dark:text-slate-400',    bg: 'bg-slate-100 dark:bg-slate-800'      },
          ].map(s => (
            <div key={s.label} className="card text-center py-3">
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search employer name or email…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm w-full" />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <AppCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-14 border-dashed border-2 border-slate-200 dark:border-slate-700">
          <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-display font-semibold text-slate-700 dark:text-slate-300 mb-1">No employers found</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Try adjusting your search</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(u => {
            const active   = isActive(u)
            const initials = (u.userName || '?').slice(0, 2).toUpperCase()
            return (
              <div key={u.userId} className="card flex items-center gap-4 flex-wrap">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  active
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}>
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {u.userName}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      active
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}>
                      {active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <Mail className="w-3 h-3" /> {u.email}
                    </span>
                    {u.createdAt && (
                      <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    disabled={toggling === u.userId}
                    onClick={() => toggle(u.userId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      active
                        ? 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        : 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                    }`}>
                    {toggling === u.userId
                      ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/></svg>
                      : active
                        ? <><ShieldOff className="w-3.5 h-3.5" /> Deactivate</>
                        : <><CircleCheck className="w-3.5 h-3.5" /> Activate</>
                    }
                  </button>
                  <button onClick={() => setDeleting(u)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {deleting && (
        <DeleteModal
          user={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}