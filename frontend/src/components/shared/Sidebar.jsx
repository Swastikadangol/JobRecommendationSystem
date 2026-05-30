import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { initials, avatarColor } from '../../utils/helpers'
import {
  LayoutDashboard, Briefcase, Star, FileText, User, LogOut,
  Zap, Building2, Users, ShieldCheck, CirclePlus, UserCheck,
  CircleAlert, Menu, X
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
    { to: '/employer/post-job', icon: CirclePlus, label: 'Post a Job' },
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

function getRoleKey(role) {
  if (role === 0 || role === 'JobSeeker') return 'JobSeeker'
  if (role === 1 || role === 'Employer') return 'Employer'
  if (role === 2 || role === 'Admin') return 'Admin'
  return 'JobSeeker'
}

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-xs p-6 text-center">
        <CircleAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-semibold mb-1">Sign out?</h3>
        <p className="text-sm text-slate-500 mb-5">
          You’ll need to sign in again.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 px-3 py-2 rounded-lg border">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-3 py-2 rounded-lg bg-red-500 text-white flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  const roleKey = getRoleKey(user?.role)
  const navItems = NAV_BY_ROLE[roleKey] || NAV_BY_ROLE.JobSeeker

  const name = user?.fullName || user?.userName || 'User'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b flex items-center px-4 z-40">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <span className="ml-3 font-semibold">TalentMatch</span>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:translate-x-0 top-0 left-0 z-50 w-60 h-full
          bg-white dark:bg-slate-900 border-r
          transform transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:flex flex-col
        `}
      >
        {/* Close button (mobile) */}
        

        {/* Logo */}
        <div className="px-5 pt-4 pb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">TalentMatch</span>
          <div className="md:hidden flex justify-end p-3">
          <button onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        </div>

        {/* Role badge */}
        <div className="px-4 mb-3">
          <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {roleKey}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(name)}`}>
            {initials(name)}
          </div>

          <div className="flex-1 text-sm truncate">
            <p className="font-medium truncate">{name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>

          <button onClick={() => setShowLogout(true)}>
            <LogOut className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </aside>

      {/* Logout modal */}
      {showLogout && (
        <LogoutModal
          onCancel={() => setShowLogout(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  )
}