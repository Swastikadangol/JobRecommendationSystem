// import { NavLink, useNavigate } from 'react-router-dom'
// import {
//   LayoutDashboard, Building2, PlusCircle,
//   ListChecks, LogOut, X, BriefcaseBusiness,
// } from 'lucide-react'
// import { useAuth } from '../context/AuthContext'

// const links = [
//     {to: '/employer', label: 'Dashboard', icon: LayoutDashboard, end: true},
//     {to: '/employer/profile', label: 'Company', icon: Building2},
//     {to: '/employer/post-job', label: 'Post a Job', icon: PlusCircle},
//     {to: '/employer/my-jobs', label: 'My Jobs', icon: ListChecks},
// ]

// export default function EmpSidebar({open, onClose}){

//     //get user info + logout function
//     const {user, logoutUser} = useAuth()

//     //used to redirect user
//     const navigate = useNavigate()

//     //logout function
//     const logout = () => {
//         logoutUser(),
//         navigate('/login')
//     }

//     return(
//         <aside  className={`
//         fixed z-30 inset-y-0 left-0 w-60 bg-white border-r border-zinc-200
//         flex flex-col transition-transform duration-200 ease-in-out

//         // On large screens sidebar is always visible
//         lg:static lg:translate-x-0

//         // On mobile: show/hide based on "open"
//         ${open ? 'translate-x-0' : '-translate-x-full'}
//       `}>

//         {/* top section 
//         sheik-0 : Sidebar stays fixed width
// Does NOT shrink even on small screens*/}
//         <div className='flex items-center justify-between px-5 h-16 border-b border-zinc-200 shrink-0'>

//             {/* logo */}
//             <div className='flex items-center gap-2'>
//                 <div className='w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center'>
//                     <BriefcaseBusiness size={15} className='text-white'/>
//                 </div>

//                 {/* app name */}
//                 <span className='font-semibold text-zinc-800 tracking-tight'>
//                     JobMatch
//                 </span>
//             </div>

//             {/* Close button (only visible on mobile) */}
//             <button onClick={onClose} className='lg-hidden text-zinc-400 hover: text-zinc-600'>
//                 <X size={18} />
//             </button>
//         </div>

//         {/* user info section */}
//         <div className='px-5 py-3 border-b border-zinc-100'>
//             <p className='text-sm font-medium text-zinc-800 truncate'>
//                 {user?.companyName || user?.userName}
//             </p>

//             {/* role label */}
//             <p className='text-xs text-zinc-400 mt-0.5'>
//                 Employer
//             </p>
//         </div>

//         {/* NAVIGATION LINKS */}
//       <nav className="flex-1 px-3 py-4 space-y-0.5">

//         {/* Loop through sidebar links */}
//         {links.map(({ to, label, icon: Icon, end }) => (
//           <NavLink
//             key={to}
//             to={to}
//             end={end}

//             // close sidebar on mobile when link clicked
//             onClick={onClose}

//             // active vs inactive styling
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
//               ${
//                 isActive
//                   ? 'bg-emerald-50 text-emerald-700' // active link
//                   : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100' // normal link
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

//    {/* LOGOUT SECTION */}
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
//         </aside>
//     )
// }

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/employer',          label: 'Overview',    end: true },
  { to: '/employer/my-jobs',  label: 'Your Jobs' },
  { to: '/employer/post-job', label: 'Post a Job' },
  { to: '/employer/profile',  label: 'Company' },
]

export default function EmpSidebar({ open, onClose }) {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const logout = () => { logoutUser(); navigate('/login') }
  const initials = (user?.companyName || user?.userName || 'C')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside style={{
      width: 220, background: '#0d1117', height: '100%',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 30,
      transition: 'transform 0.25s ease',
    }}
    className={`lg:static ${!open ? '-translate-x-full lg:translate-x-0' : ''}`}
    >
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>J</div>
        <span style={{ color: '#f0ece4', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px', fontFamily: '"DM Serif Display", Georgia, serif' }}>JobMatch</span>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            style={({ isActive }) => ({
              display: 'block', padding: '8px 12px', borderRadius: 7,
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              textDecoration: 'none', transition: 'all 0.15s',
              color: isActive ? '#10b981' : 'rgba(240,236,228,0.45)',
              background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
            })}
          >{label}</NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#f0ece4', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.companyName || user?.userName}</div>
            <div style={{ color: 'rgba(240,236,228,0.3)', fontSize: 11 }}>Employer</div>
          </div>
        </div>
        <button onClick={logout} style={{ width: '100%', padding: '6px', borderRadius: 6, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,236,228,0.35)', fontSize: 12, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.target.style.color='#ef4444'; e.target.style.borderColor='rgba(239,68,68,0.3)' }}
          onMouseLeave={e => { e.target.style.color='rgba(240,236,228,0.35)'; e.target.style.borderColor='rgba(255,255,255,0.08)' }}
        >Sign out</button>
      </div>
    </aside>
  )
}