// import { Outlet } from 'react-router-dom'
// import { useState } from 'react'
// import EmpSidebar from './EmpSidebar'
// import TopBar from './TopBar'

// export default function EmpLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   return (
//     <div className="flex h-screen bg-zinc-50 overflow-hidden">
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-20 bg-black/30 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//       <EmpSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
//         <TopBar onMenuClick={() => setSidebarOpen(true)} />
//         <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/admin',              label: 'Dashboard',    end: true },
  { to: '/admin/users',        label: 'All Users' },
  { to: '/admin/jobs',         label: 'All Jobs' },
  { to: '/admin/pending-jobs', label: 'Pending Jobs' },
]

export default function AdminSidebar({ open, onClose }) {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const logout = () => { logoutUser(); navigate('/login') }
  const initials = (user?.userName || 'A').slice(0, 2).toUpperCase()

  return (
    <aside style={{
      width: 220, background: '#0f1117', height: '100%',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 30,
      transition: 'transform 0.25s ease',
    }}
    className={`lg:static ${!open ? '-translate-x-full lg:translate-x-0' : ''}`}
    >
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>J</div>
        <span style={{ color: '#f0ece4', fontWeight: 700, fontSize: 15, fontFamily: '"DM Serif Display", Georgia, serif' }}>JobMatch</span>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            style={({ isActive }) => ({
              display: 'block', padding: '8px 12px', borderRadius: 7,
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              textDecoration: 'none', transition: 'all 0.15s',
              color: isActive ? '#a78bfa' : 'rgba(240,236,228,0.45)',
              background: isActive ? 'rgba(139,92,246,0.1)' : 'transparent',
            })}
          >{label}</NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>
          <div>
            <div style={{ color: '#f0ece4', fontSize: 12, fontWeight: 600 }}>{user?.userName}</div>
            <div style={{ color: 'rgba(240,236,228,0.3)', fontSize: 11 }}>Administrator</div>
          </div>
        </div>
        <button onClick={logout} style={{ width: '100%', padding: '6px', borderRadius: 6, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,236,228,0.35)', fontSize: 12 }}
          onMouseEnter={e => { e.target.style.color='#ef4444' }}
          onMouseLeave={e => { e.target.style.color='rgba(240,236,228,0.35)' }}
        >Sign out</button>
      </div>
    </aside>
  )
}