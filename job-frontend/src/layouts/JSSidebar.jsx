// // Import navigation tools from react-router
// import { NavLink, useNavigate } from 'react-router-dom'

// // Import icons from lucide-react
// import {
//   LayoutDashboard, User, Sparkles,
//   Briefcase, FileText, LogOut, X, BriefcaseBusiness,
// } from 'lucide-react'

// // Import auth context (to get user info + logout function)
// import { useAuth } from '../context/AuthContext'

// // Sidebar links (menu items)
// const links = [
//   { to: '/jobseeker', label: 'Dashboard', icon: LayoutDashboard, end: true },
//   { to: '/jobseeker/profile', label: 'My Profile', icon: User },
//   { to: '/jobseeker/recommendations', label: 'Recommendations', icon: Sparkles },
//   { to: '/jobseeker/jobs', label: 'Browse Jobs', icon: Briefcase },
//   { to: '/jobseeker/applications', label: 'My Applications', icon: FileText },
// ]

// export default function JSSidebar({ open, onClose }) {

//   // Get current user and logout function from context
//   const { user, logoutUser } = useAuth()

//   // useNavigate → used to redirect user
//   const navigate = useNavigate()

//   // Logout function
//   const logout = () => {
//     logoutUser()          // clear user + token
//     navigate('/login')    // redirect to login page
//   }

//   return (
//     <aside className={`
//       // Sidebar container styles
//       fixed z-30 inset-y-0 left-0 w-60 bg-white border-r border-zinc-200

//       // layout
//       flex flex-col

//       // animation (slide in/out)
//       transition-transform duration-200 ease-in-out

//       // on large screens → always visible
//       lg:static lg:translate-x-0

//       // on small screens → show/hide based on "open"
//       ${open ? 'translate-x-0' : '-translate-x-full'}
//     `}>

//       {/* LOGO SECTION  */}
//       <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-200 shrink-0">
        
//         {/* Logo + App Name */}
//         <div className="flex items-center gap-2">
//           <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
//             <BriefcaseBusiness size={15} className="text-white" />
//           </div>
//           <span className="font-semibold text-zinc-800 tracking-tight">
//             JobMatch
//           </span>
//         </div>

//         {/* Close button (only for mobile) */}
//         <button onClick={onClose} className="lg:hidden text-zinc-400 hover:text-zinc-600">
//           <X size={18} />
//         </button>
//       </div>

//       {/*USER INFO */}
//       <div className="px-5 py-3 border-b border-zinc-100">
        
//         {/* Show user's name */}
//         <p className="text-sm font-medium text-zinc-800 truncate">
//           {user?.fullName || user?.userName}
//         </p>

//         {/* Role label */}
//         <p className="text-xs text-zinc-400 mt-0.5">
//           Job Seeker
//         </p>
//       </div>

//       {/*NAVIGATION LINKS */}
//       <nav className="flex-1 px-3 py-4 space-y-0.5">

//         {/* Loop through links array */}
//         {links.map(({ to, label, icon: Icon, end }) => (

//           <NavLink
//             key={to}
//             to={to}
//             end={end}

//             // Close sidebar on mobile after click
//             onClick={onClose}

//             // Apply active/inactive styles
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
//               ${isActive
//                 ? 'bg-blue-50 text-blue-700'   // active link style
//                 : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100' // normal style
//               }`
//             }
//           >
//             {/* Icon */}
//             <Icon size={17} />

//             {/* Label text */}
//             {label}
//           </NavLink>
//         ))}
//       </nav>

//       {/*  LOGOUT BUTTON */}
//       <div className="px-3 py-4 border-t border-zinc-200 shrink-0">
//         <button
//           onClick={logout}
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
//                      text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
//         >
//           <LogOut size={17} />
//           Logout
//         </button>
//       </div>

//     </aside>
//   )
// }

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/jobseeker',                 label: 'Overview',     end: true },
  { to: '/jobseeker/recommendations', label: 'Matches' },
  { to: '/jobseeker/jobs',            label: 'Browse Jobs' },
  { to: '/jobseeker/applications',    label: 'Applications' },
  { to: '/jobseeker/profile',         label: 'Profile' },
]

const S = {
  aside: {
    width: 220, background: '#0f1117',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', height: '100%',
  },
  logo: {
    padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 10,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  logoIcon: {
    width: 30, height: 30, borderRadius: 8,
    background: 'linear-gradient(135deg, #c9a96e 0%, #e8c98a 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 800, color: '#0f1117', fontFamily: 'Georgia, serif',
    flexShrink: 0,
  },
  logoText: {
    color: '#f0ece4', fontWeight: 700, fontSize: 15,
    letterSpacing: '-0.3px', fontFamily: '"DM Serif Display", Georgia, serif',
  },
  nav: { flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 },
  user: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '14px 12px',
  },
  avatar: {
    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #c9a96e, #e8c98a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: '#0f1117',
  },
}

export default function JSSidebar({ open, onClose }) {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const logout = () => { logoutUser(); navigate('/login') }
  const initials = (user?.fullName || user?.userName || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside style={{
      ...S.aside,
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 30,
      transform: open ? 'translateX(0)' : undefined,
      transition: 'transform 0.25s ease',
    }}
    className={`lg:static ${!open ? '-translate-x-full lg:translate-x-0' : ''}`}
    >
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoIcon}>J</div>
        <span style={S.logoText}>JobMatch</span>
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        {links.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            style={({ isActive }) => ({
              display: 'block', padding: '8px 12px', borderRadius: 7,
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              textDecoration: 'none', transition: 'all 0.15s',
              color: isActive ? '#c9a96e' : 'rgba(240,236,228,0.45)',
              background: isActive ? 'rgba(201,169,110,0.1)' : 'transparent',
              letterSpacing: '0.02em',
            })}
          >{label}</NavLink>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <NavLink to="/jobseeker/experience/new" onClick={onClose}
            style={{ display: 'block', padding: '7px 12px', borderRadius: 7,
              fontSize: 12, textDecoration: 'none',
              color: 'rgba(201,169,110,0.6)',
              border: '1px dashed rgba(201,169,110,0.25)',
              textAlign: 'center', marginTop: 8,
            }}>
            + Add Experience
          </NavLink>
        </div>
      </nav>

      {/* User */}
      <div style={S.user}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={S.avatar}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#f0ece4', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName || user?.userName}
            </div>
            <div style={{ color: 'rgba(240,236,228,0.3)', fontSize: 11 }}>Job Seeker</div>
          </div>
        </div>
        <button onClick={logout} style={{
          width: '100%', padding: '6px', borderRadius: 6, cursor: 'pointer',
          background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(240,236,228,0.35)', fontSize: 12, transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.target.style.color='#ef4444'; e.target.style.borderColor='rgba(239,68,68,0.3)' }}
          onMouseLeave={e => { e.target.style.color='rgba(240,236,228,0.35)'; e.target.style.borderColor='rgba(255,255,255,0.08)' }}
        >Sign out</button>
      </div>
    </aside>
  )
}