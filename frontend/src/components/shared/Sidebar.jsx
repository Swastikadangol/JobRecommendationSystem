import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { initials, avatarColor } from '../../utils/helpers'
import {
  LayoutDashboard, Briefcase, Star, FileText, User,
  LogOut, Zap, Building2, Users, ShieldCheck, PlusSquare,
  UserCheck, BarChart2, X, AlertTriangle
} from 'lucide-react'

const NAV_BY_ROLE = {
  JobSeeker: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/browse', icon: Briefcase, label: 'Browse Jobs' },
    { to: '/recommendations', icon: Star, label: 'Recommendations' },
    { to: '/applications', icon: FileText, label: 'My Applications' },
    { to: '/profile', icon: User, label: 'My Profile' },
  ],
  Employer: [
    { to: '/employer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employer/post-job', icon: PlusSquare, label: 'Post a Job' },
    { to: '/employer/jobs', icon: Briefcase, label: 'My Jobs' },
    { to: '/employer/candidates', icon: UserCheck, label: 'Candidates' },
    { to: '/employer/profile', icon: Building2, label: 'Company Profile' },
  ],
  Admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Manage Jobs' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/employers', icon: Building2, label: 'Employers' },
  ],
}

// Map numeric role → string key
function getRoleKey(role) {
  if (role === 0 || role === 'JobSeeker') return 'JobSeeker'
  if (role === 1 || role === 'Employer') return 'Employer'
  if (role === 2 || role === 'Admin') return 'Admin'
  return 'JobSeeker'
}

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-xs animate-fadeIn">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="font-display font-semibold text-ink text-lg mb-1">Sign out?</h3>
          <p className="text-sm text-ink-muted mb-6">You'll need to sign in again to access your account.</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="btn-outline flex-1 justify-center"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const roleKey = getRoleKey(user?.role)
  const navItems = NAV_BY_ROLE[roleKey] || NAV_BY_ROLE.JobSeeker

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const name = user?.fullName || user?.userName || 'User'
  const initStr = initials(name)
  const colorCls = avatarColor(name)

  const roleLabel = { JobSeeker: 'Job Seeker', Employer: 'Employer', Admin: 'Administrator' }[roleKey]

  return (
    <>
      <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-surface-200 flex flex-col z-30">
        {/* Logo */}
        <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-200">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display font-semibold text-ink text-lg tracking-tight">TalentMatch</span>
        </div>

        {/* Role pill */}
        <div className="px-4 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 text-xs font-medium text-ink-muted">
            {roleKey === 'Admin' && <ShieldCheck className="w-3 h-3" />}
            {roleKey === 'Employer' && <Building2 className="w-3 h-3" />}
            {roleKey === 'JobSeeker' && <User className="w-3 h-3" />}
            {roleLabel}
          </span>
        </div>

        <div className="mx-4 border-b border-surface-100 mb-2" />

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto py-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="p-3 border-t border-surface-100">
          <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-50 transition-colors group">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${colorCls}`}>
              {initStr}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate leading-tight">{name}</p>
              <p className="text-xs text-ink-light truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              title="Sign out"
              className="p-1.5 rounded-lg text-ink-light hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  )
}