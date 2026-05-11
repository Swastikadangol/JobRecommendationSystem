import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { initials, avatarColor } from '../../utils/helpers'
import {
  LayoutDashboard, Briefcase, Star, FileText, User, LogOut,
  Zap, Building2, Users, ShieldCheck, PlusSquare, UserCheck, AlertTriangle
} from 'lucide-react'

const NAV_BY_ROLE = { 
  JobSeeker: [
    { to: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/browse',          icon: Briefcase,       label: 'Browse Jobs' },
    { to: '/recommendations', icon: Star,            label: 'Recommendations' },
    { to: '/applications',    icon: FileText,        label: 'My Applications' },
    { to: '/profile',         icon: User,            label: 'My Profile' },
  ],
  Employer: [
    { to: '/employer/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employer/post-job',   icon: PlusSquare,      label: 'Post a Job' },
    { to: '/employer/jobs',       icon: Briefcase,       label: 'My Jobs' },
    { to: '/employer/candidates', icon: UserCheck,       label: 'Candidates' },
    { to: '/employer/profile',    icon: Building2,       label: 'Company Profile' },
  ],
  Admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/jobs',      icon: Briefcase,       label: 'Manage Jobs' },
    { to: '/admin/users',     icon: Users,           label: 'Manage Users' },
    { to: '/admin/employers', icon: Building2,       label: 'Employers' },
  ],
}

function getRoleKey(role) {
  if (role === 0 || role === 'JobSeeker') return 'JobSeeker'
  if (role === 1 || role === 'Employer')  return 'Employer'
  if (role === 2 || role === 'Admin')     return 'Admin'
  return 'JobSeeker'
}

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-modal dark:shadow-dark-modal w-full max-w-xs animate-fadeIn">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-lg mb-1">Sign out?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">You'll need to sign in again to access your account.</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-outline flex-1 justify-center">Cancel</button>
            <button onClick={onConfirm} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
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
  const roleKey  = getRoleKey(user?.role)
  const navItems = NAV_BY_ROLE[roleKey] || NAV_BY_ROLE.JobSeeker
  const roleLabel = { JobSeeker: 'Job Seeker', Employer: 'Employer', Admin: 'Administrator' }[roleKey]
  const name = user?.fullName || user?.userName || 'User'
  const handleLogout = () => { logout(); navigate('/landing') }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 w-60 flex flex-col z-30 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
        <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center"><Zap className="w-4 h-4 text-white fill-white" /></div>
          <span className="font-display font-semibold text-slate-900 dark:text-slate-100 text-lg tracking-tight">TalentMatch</span>
        </div>
        <div className="px-4 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            {roleKey === 'Admin' && <ShieldCheck className="w-3 h-3" />}
            {roleKey === 'Employer' && <Building2 className="w-3 h-3" />}
            {roleKey === 'JobSeeker' && <User className="w-3 h-3" />}
            {roleLabel}
          </span>
        </div>
        <div className="mx-4 mb-2 border-t border-slate-100 dark:border-slate-800" />
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto py-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}>
              <Icon className="w-4 h-4 flex-shrink-0" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 p-2 rounded-xl group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor(name)}`}>{initials(name)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
            </div>
            <button onClick={() => setShowLogoutModal(true)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
      {showLogoutModal && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />}
    </>
  )
}