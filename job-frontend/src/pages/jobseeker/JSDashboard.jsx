// // Import Link for navigation between pages
// import { Link } from 'react-router-dom'

// // Import custom authentication context to access logged-in user data
// import { useAuth } from '../../context/AuthContext'

// // Import icons from lucide-react
// import { Sparkles, Briefcase, FileText, User, PlusCircle } from 'lucide-react'


// // Dashboard card data
// // Each object represents one dashboard feature card
// const cards = [
//   {
//     to: '/jobseeker/recommendations',   // Route path
//     icon: Sparkles,                     // Icon component
//     color: 'text-blue-600 bg-blue-50',  // Tailwind color classes
//     title: 'Recommendations',           // Card title
//     desc: 'Jobs matched to your skills' // Card description
//   },
//   {
//     to: '/jobseeker/jobs',
//     icon: Briefcase,
//     color: 'text-emerald-600 bg-emerald-50',
//     title: 'Browse Jobs',
//     desc: 'Explore all available positions'
//   },
//   {
//     to: '/jobseeker/applications',
//     icon: FileText,
//     color: 'text-violet-600 bg-violet-50',
//     title: 'My Applications',
//     desc: 'Track your submitted applications'
//   },
//   {
//     to: '/jobseeker/profile',
//     icon: User,
//     color: 'text-amber-600 bg-amber-50',
//     title: 'My Profile',
//     desc: 'Update skills and preferences'
//   },
//   {
//     to: '/jobseeker/experience/new',
//     icon: PlusCircle,
//     color: 'text-rose-600 bg-rose-50',
//     title: 'Add Experience',
//     desc: 'Add a new work experience'
//   },
// ]


// // Main Dashboard Component
// export default function JSDashboard() {

//   // Get current logged-in user from AuthContext
//   const { user } = useAuth()

//   return (
//     <div>

//       {/* Welcome message */}
//       <h2 className="text-xl font-semibold text-zinc-800 mb-1">
//         {/* Show fullName if available, otherwise userName */}
//         Welcome back, {user?.fullName || user?.userName}!
//       </h2>

//       {/* Subtitle */}
//       <p className="text-sm text-zinc-500 mb-8">
//         What would you like to do today?
//       </p>


//       {/* Dashboard cards grid layout */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

//         {/* Loop through cards array */}
//         {cards.map(({ to, icon: Icon, color, title, desc }) => (

//           // Link makes whole card clickable
//           <Link
//             key={to} // Unique key for React
//             to={to}  // Navigate to this route
//             className="bg-white border border-zinc-200 rounded-xl p-5
//                        hover:border-zinc-300 hover:shadow-sm transition-all"
//           >

//             {/* Icon container */}
//             <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
//               <Icon size={20} />
//             </div>

//             {/* Card title */}
//             <div className="font-medium text-zinc-800 text-sm">
//               {title}
//             </div>

//             {/* Card description */}
//             <div className="text-xs text-zinc-500 mt-1">
//               {desc}
//             </div>

//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }

import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function JSDashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const cards = [
    { to: '/jobseeker/recommendations', label: 'Matches', desc: 'Jobs matched to your skills', accent: '#c9a96e' },
    { to: '/jobseeker/jobs',            label: 'Browse Jobs', desc: 'Explore all open positions', accent: '#10b981' },
    { to: '/jobseeker/applications',    label: 'Applications', desc: 'Track your applications', accent: '#6366f1' },
    { to: '/jobseeker/profile',         label: 'Profile', desc: 'Update skills & preferences', accent: '#f59e0b' },
  ]

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 28, fontWeight: 400, color: '#1a1814', margin: '0 0 6px' }}>
          {greeting}, {user?.fullName?.split(' ')[0] || user?.userName} ✦
        </h2>
        <p style={{ color: '#a09890', fontSize: 14, margin: 0 }}>
          Here's what's happening with your job search today.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <Link key={c.to} to={c.to} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', border: '1px solid #e8e3da', borderRadius: 14,
              padding: '20px 22px', transition: 'all 0.2s', cursor: 'pointer',
              borderTop: `3px solid ${c.accent}`,
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontWeight: 600, color: '#1a1814', fontSize: 15, marginBottom: 4 }}>{c.label}</div>
              <div style={{ color: '#a09890', fontSize: 13 }}>{c.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick tip */}
      <div style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 600, color: '#1a1814', fontSize: 14, marginBottom: 3 }}>💡 Improve your match score</div>
          <div style={{ color: '#6b6459', fontSize: 13 }}>Add your skills and work experience to get better job recommendations.</div>
        </div>
        <Link to="/jobseeker/profile" style={{ textDecoration: 'none', whiteSpace: 'nowrap', padding: '8px 16px', background: '#c9a96e', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
          Update Profile
        </Link>
      </div>
    </div>
  )
}