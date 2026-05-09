// // import menu icon
// import { Menu } from 'lucide-react'

// // get current URL path
// import { useLocation } from 'react-router-dom'

// // map URL → title
// const titles = {
//   '/jobseeker': 'Dashboard',
//   '/jobseeker/profile': 'My Profile',
//   '/jobseeker/jobs': 'Browse Jobs',
//   '/jobseeker/applications': 'My Applications',

//   '/employer': 'Dashboard',
//   '/employer/profile': 'Company Profile',
//   '/employer/my-jobs': 'My Jobs',

//   '/admin': 'Dashboard',
//   '/admin/users': 'All Users',
//   '/admin/jobs': 'All Jobs',
// }

// export default function TopBar({ onMenuClick }) {

//   // get current path like "/admin/users"
//   const { pathname } = useLocation()

//   // find title from object
//   //title = titles["/admin/users"]
//   //title = "All Users"
//   let title = titles[pathname]

//   // if not found → check manually
//   if (!title) {
//     if (pathname.includes('applicants')) {
//       title = 'Applicants'
//     } else if (pathname.includes('edit')) {
//       title = 'Edit'
//     } else {
//       title = 'JobMatch' // default title
//     }
//   }

//   return (
//     <header className="h-16 bg-white border-b flex items-center px-4 gap-4">

//       {/* mobile menu button */}
//       <button onClick={onMenuClick} className="lg:hidden">
//         <Menu size={20} />
//       </button>

//       {/* page title */}
//       <h1 className="text-lg font-semibold">
//         {title}
//       </h1>

//     </header>
//   )
// }

import { useLocation } from 'react-router-dom'

const titles = {
  '/jobseeker': 'Overview', '/jobseeker/profile': 'Profile',
  '/jobseeker/recommendations': 'Matches', '/jobseeker/jobs': 'Browse Jobs',
  '/jobseeker/applications': 'Applications', '/jobseeker/experience/new': 'Add Experience',
  '/employer': 'Overview', '/employer/profile': 'Company Profile',
  '/employer/post-job': 'Post a Job', '/employer/my-jobs': 'Your Jobs',
  '/admin': 'Dashboard', '/admin/users': 'All Users',
  '/admin/jobs': 'All Jobs', '/admin/pending-jobs': 'Pending Jobs',
}

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation()
  const title = titles[pathname]
    ?? (pathname.includes('applicants') ? 'Applicants'
      : pathname.includes('edit') ? 'Edit Job'
      : pathname.includes('experience') ? 'Edit Experience'
      : 'JobMatch')

  return (
    <header style={{
      height: 56, background: '#f7f4ef',
      borderBottom: '1px solid #e8e3da',
      display: 'flex', alignItems: 'center',
      padding: '0 28px', gap: 16, flexShrink: 0,
    }}>
      <button onClick={onMenuClick} className="lg:hidden"
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#6b6459', padding: 4 }}>
        ☰
      </button>
      <h1 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1a1814', margin: 0 }}>
        {title}
      </h1>
    </header>
  )
}