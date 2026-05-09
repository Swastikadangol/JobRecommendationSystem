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

import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import EmpSidebar from './EmpSidebar'
import TopBar from './TopBar'

export default function EmpLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f7f4ef' }}>
      {open && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 20 }} onClick={() => setOpen(false)} className="lg:hidden" />}
      <div className="hidden lg:block" style={{ width: 220, flexShrink: 0 }}>
        <EmpSidebar open={true} onClose={() => {}} />
      </div>
      <EmpSidebar open={open} onClose={() => setOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar onMenuClick={() => setOpen(true)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}