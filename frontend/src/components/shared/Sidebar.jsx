import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { initials, avatarColor } from '../../utils/helpers'
import {
  LayoutDashboard, Briefcase, Star, FileText, User, LogOut,
  Zap, Building2, Users, ShieldCheck, CirclePlus, UserCheck,
  CircleAlert, Menu, X, BarChart2
} from 'lucide-react'


const NAV_BY_ROLE = {
  JobSeeker: [
    { to: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard'       },
    { to: '/browse',           icon: Briefcase,       label: 'Browse Jobs'     },
    { to: '/recommendations',  icon: Star,            label: 'Recommendations' },
    { to: '/applications',     icon: FileText,        label: 'My Applications' },
    { to: '/profile',          icon: User,            label: 'My Profile'      },
  ],
  Employer: [
    { to: '/employer/dashboard',  icon: LayoutDashboard, label: 'Dashboard'      },
    { to: '/employer/post-job',   icon: CirclePlus,      label: 'Post a Job'     },
    { to: '/employer/jobs',       icon: Briefcase,       label: 'My Jobs'        },
    { to: '/employer/candidates', icon: UserCheck,       label: 'Candidates'     },
    { to: '/employer/profile',    icon: Building2,       label: 'Company Profile'},
  ],
  Admin: [
    { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
    { to: '/admin/jobs',         icon: Briefcase,       label: 'Manage Jobs'  },
    { to: '/admin/users',        icon: Users,           label: 'Manage Users' },
    { to: '/admin/applications', icon: FileText,        label: 'Applications' },
    { to: '/admin/reports',      icon: BarChart2,       label: 'Reports'      },
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-xs p-6 text-center">
        <CircleAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-semibold mb-1">Sign out?</h3>
        <p className="text-sm text-slate-500 mb-5">You'll need to sign in again.</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 px-3 py-2 rounded-lg border">Cancel</button>
          <button onClick={onConfirm}
            className="flex-1 px-3 py-2 rounded-lg bg-red-500 text-white flex items-center justify-center gap-2">
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
  const [open,       setOpen]       = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [similarJobs, setSimilarJobs] = useState([])

  const roleKey  = getRoleKey(user?.role)
  const navItems = NAV_BY_ROLE[roleKey] || NAV_BY_ROLE.JobSeeker
  const name     = user?.fullName || user?.companyName || user?.userName || 'User'

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b flex items-center px-4 z-40">
        <button onClick={() => setOpen(true)}><Menu className="w-6 h-6" /></button>
        <span className="ml-3 font-semibold">TalentMatch</span>
      </div>

      {open && (
        <div onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden" />
      )}

      <aside className={`
        fixed md:translate-x-0 top-0 left-0 z-50 w-60 h-full
        bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
        transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:flex flex-col
      `}>

        {/* Logo */}
        <div className="px-5 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">TalentMatch</span>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-4 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg">
            {roleKey === 'Admin'     && <ShieldCheck className="w-3 h-3" />}
            {roleKey === 'Employer'  && <Building2   className="w-3 h-3" />}
            {roleKey === 'JobSeeker' && <User         className="w-3 h-3" />}
            {roleKey === 'Admin' ? 'Administrator' : roleKey === 'Employer' ? 'Employer' : 'Job Seeker'}
          </span>
        </div>

        <div className="mx-4 mb-2 border-t border-slate-100 dark:border-slate-800" />

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto py-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 p-2 rounded-xl group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor(name)}`}>
              {initials(name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
            </div>
            <button onClick={() => setShowLogout(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {showLogout && (
        <LogoutModal onCancel={() => setShowLogout(false)} onConfirm={handleLogout} />
      )}
    </>
  )
}