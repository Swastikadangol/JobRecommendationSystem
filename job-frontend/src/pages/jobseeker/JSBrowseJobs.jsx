// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { getApprovedJobs } from '../../services/jobSeeker' 
// export default function JSBrowseJobs() {
//   const [jobs,    setJobs]    = useState([])
//   const [loading, setLoading] = useState(true)
//   const [search,  setSearch]  = useState('')
//   const navigate = useNavigate()

//  useEffect(() => {
//   getApprovedJobs()   // ← change this (was getAllJobs('Approved'))
//     .then(data => setJobs(Array.isArray(data) ? data : []))
//     .finally(() => setLoading(false))
// }, [])

//   const filtered = jobs.filter(j =>
//     j.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
//     j.companyName?.toLowerCase().includes(search.toLowerCase()) ||
//     j.location?.toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <h2 className="text-xl font-semibold text-zinc-800">Browse Jobs</h2>
//         <input
//           placeholder="Search by title, company, location..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="w-full sm:w-72 px-3 py-2 border border-zinc-200 rounded-lg text-sm
//                      focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {loading && <p className="text-sm text-zinc-400">Loading jobs...</p>}

//       {!loading && filtered.length === 0 && (
//         <p className="text-sm text-zinc-400 text-center py-16">No jobs found.</p>
//       )}

//       <div className="space-y-3">
//         {filtered.map(j => (
//           <div key={j.jobId}
//             className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition-colors">
//             <div className="flex justify-between items-start gap-4">
//               <div className="flex-1 min-w-0">
//                 <div className="font-medium text-zinc-800">{j.jobTitle}</div>
//                 <div className="text-sm text-zinc-500 mt-0.5">{j.companyName} · {j.location}</div>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   <Tag>{j.jobType}</Tag>
//                   <Tag>{j.workMode}</Tag>
//                   {j.salaryRange && <Tag>{j.salaryRange}</Tag>}
//                 </div>
//                 <div className="text-xs text-zinc-400 mt-2">
//                   Deadline: {j.deadline?.slice(0, 10) || '—'}
//                 </div>
//               </div>
//               <button
//                 onClick={() => navigate(`/jobseeker/jobs/${j.jobId}`, { state: { job: j } })}
//                 className="shrink-0 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
//               >
//                 View
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// const Tag = ({ children }) => (
//   <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded-md">{children}</span>
// )

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getRecommendations } from '../../services/jobSeeker'

export default function JSBrowseJobs() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getRecommendations(user?.profileId)
      .then(data => setJobs(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = jobs.filter(j =>
    !search ||
    j.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
    j.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1a1814', margin: '0 0 2px' }}>Browse Jobs</h2>
          <p style={{ color: '#a09890', fontSize: 13, margin: 0 }}>{filtered.length} open positions</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, company..."
          style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid #e8e3da', background: '#fff', fontSize: 13, color: '#1a1814', outline: 'none', width: 220 }} />
      </div>

      {loading && <p style={{ color: '#a09890', fontSize: 14 }}>Loading jobs...</p>}
      {!loading && filtered.length === 0 && <p style={{ color: '#a09890', fontSize: 14, textAlign: 'center', padding: '60px 0' }}>No jobs found.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(j => (
          <div key={j.jobId} style={{ background: '#fff', border: '1px solid #e8e3da', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, transition: 'box-shadow 0.2s', cursor: 'pointer' }}
            onClick={() => navigate(`/jobseeker/jobs/${j.jobId}`, { state: { job: j } })}
            onMouseEnter={e => e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1814', marginBottom: 2 }}>{j.jobTitle}</div>
              <div style={{ fontSize: 13, color: '#6b6459', marginBottom: 8 }}>{j.companyName}{j.location ? ` · ${j.location}` : ''}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[j.jobType, j.workMode].filter(Boolean).map(t => (
                  <span key={t} style={{ padding: '2px 9px', background: '#f7f4ef', border: '1px solid #e8e3da', borderRadius: 20, fontSize: 11, color: '#6b6459' }}>{t}</span>
                ))}
                {j.salaryRange && <span style={{ padding: '2px 9px', background: '#f7f4ef', border: '1px solid #e8e3da', borderRadius: 20, fontSize: 11, color: '#6b6459' }}>{j.salaryRange}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              {j.matchScore != null && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: j.matchScore >= 70 ? '#16a34a' : j.matchScore >= 40 ? '#d97706' : '#a09890' }}>{j.matchScore}%</div>
                  <div style={{ fontSize: 10, color: '#a09890', textTransform: 'uppercase' }}>match</div>
                </div>
              )}
              <div style={{ color: '#a09890', fontSize: 18 }}>→</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}