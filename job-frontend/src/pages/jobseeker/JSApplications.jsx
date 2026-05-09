// import { useEffect, useState } from 'react'
// import { useAuth } from '../../context/AuthContext'
// import { getMyApplications } from '../../services/jobSeeker'

// const STATUS_STYLE = {
//   Applied:     'bg-blue-50 text-blue-700',
//   Reviewed:    'bg-amber-50 text-amber-700',
//   Shortlisted: 'bg-emerald-50 text-emerald-700',
//   Rejected:    'bg-red-50 text-red-600',
//   Accepted:    'bg-green-50 text-green-700',
// }

// export default function JSApplications() {
//   const { user } = useAuth()
//   const [apps,    setApps]    = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     getMyApplications(user?.profileId)
//       .then(r => setApps(r.data || r || []))
//       .finally(() => setLoading(false))
//   }, [])

//   return (
//     <div>
//       <h2 className="text-xl font-semibold text-zinc-800 mb-6">My Applications</h2>

//       {loading && <p className="text-sm text-zinc-400">Loading...</p>}

//       {!loading && apps.length === 0 && (
//         <div className="text-center py-16 text-zinc-400">
//           <p className="text-sm">No applications yet.</p>
//           <p className="text-xs mt-1">Browse jobs and start applying!</p>
//         </div>
//       )}

//       <div className="space-y-3">
//         {apps.map(a => (
//           <div key={a.applicationId}
//             className="bg-white border border-zinc-200 rounded-xl p-5">
//             <div className="flex justify-between items-start gap-4">
//               <div>
//                 <div className="font-medium text-zinc-800">{a.jobTitle}</div>
//                 <div className="text-sm text-zinc-500 mt-0.5">{a.companyName}</div>
//                 <div className="text-xs text-zinc-400 mt-1">
//                   Applied: {new Date(a.appliedAt).toLocaleDateString()}
//                 </div>
//                 {a.matchScore != null && (
//                   <div className="text-xs text-zinc-400 mt-0.5">Match score: {a.matchScore}%</div>
//                 )}
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0
//                                ${STATUS_STYLE[a.applicationStatus] || 'bg-zinc-100 text-zinc-600'}`}>
//                 {a.applicationStatus}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyApplications } from '../../services/jobSeeker'

const STATUS = {
  Applied:     { bg: 'rgba(59,130,246,0.08)', color: '#2563eb', border: 'rgba(59,130,246,0.2)' },
  Reviewed:    { bg: 'rgba(217,119,6,0.08)',  color: '#d97706', border: 'rgba(217,119,6,0.2)' },
  Shortlisted: { bg: 'rgba(22,163,74,0.08)',  color: '#16a34a', border: 'rgba(22,163,74,0.2)' },
  Rejected:    { bg: 'rgba(220,38,38,0.08)',  color: '#dc2626', border: 'rgba(220,38,38,0.2)' },
  Accepted:    { bg: 'rgba(5,150,105,0.08)',  color: '#059669', border: 'rgba(5,150,105,0.2)' },
}

export default function JSApplications() {
  const { user } = useAuth()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyApplications(user?.profileId)
      .then(r => setApps(r.data || r || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1a1814', margin: '0 0 2px' }}>My Applications</h2>
        <p style={{ color: '#a09890', fontSize: 13, margin: 0 }}>{apps.length} total · cannot be withdrawn once submitted</p>
      </div>

      {loading && <p style={{ color: '#a09890', fontSize: 14 }}>Loading...</p>}
      {!loading && apps.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a09890' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14, color: '#6b6459' }}>No applications yet. Start applying!</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {apps.map(a => {
          const s = STATUS[a.applicationStatus] || { bg: '#f7f4ef', color: '#6b6459', border: '#e8e3da' }
          return (
            <div key={a.applicationId} style={{ background: '#fff', border: '1px solid #e8e3da', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1814', marginBottom: 3 }}>{a.jobTitle}</div>
                  <div style={{ fontSize: 13, color: '#6b6459', marginBottom: 8 }}>{a.companyName}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#a09890' }}>
                    <span>Applied {new Date(a.appliedAt).toLocaleDateString()}</span>
                    {a.matchScore != null && <span>Match: {a.matchScore}%</span>}
                  </div>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {a.applicationStatus}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}