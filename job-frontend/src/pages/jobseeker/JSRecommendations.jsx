// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { getRecommendations, applyToJob, getMyApplications } from '../../services/jobSeeker'

// export default function JSRecommendations() {
//   const { user }   = useAuth()
//   const id         = user?.profileId
//   const navigate   = useNavigate()

//   const [jobs,    setJobs]    = useState([])
//   const [applied, setApplied] = useState(new Set())
//   const [filters, setFilters] = useState({ jobType: '', workMode: '' })
//   const [loading, setLoading] = useState(true)
//   const [msg,     setMsg]     = useState('')

//   useEffect(() => {
//     // load already-applied job IDs so we can disable those apply buttons
//     getMyApplications(id).then(r => {
//       const ids = (r.data || []).map(a => a.jobId)
//       setApplied(new Set(ids))
//     })
//     load()
//   }, [])

//   const load = async () => {
//     setLoading(true)
//     try {
//       const data = await getRecommendations(id, filters)
//       setJobs(data)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const apply = async (jobId) => {
//     try {
//       const res = await applyToJob({ jobSeekerId: id, jobId })
//       setApplied(prev => new Set([...prev, jobId]))
//       setMsg(`Applied! Match score: ${res.matchScore}%`)
//       setTimeout(() => setMsg(''), 4000)
//     } catch (err) {
//       setMsg(err.message)
//       setTimeout(() => setMsg(''), 4000)
//     }
//   }

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <h2 className="text-xl font-semibold text-zinc-800">Recommended Jobs</h2>
//         <div className="flex gap-2 flex-wrap">
//           <select
//             value={filters.jobType}
//             onChange={e => setFilters({ ...filters, jobType: e.target.value })}
//             className="px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All types</option>
//             <option value="FullTime">Full Time</option>
//             <option value="PartTime">Part Time</option>
//             <option value="Internship">Internship</option>
//           </select>
//           <select
//             value={filters.workMode}
//             onChange={e => setFilters({ ...filters, workMode: e.target.value })}
//             className="px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All modes</option>
//             <option value="OnSite">On Site</option>
//             <option value="Remote">Remote</option>
//             <option value="Hybrid">Hybrid</option>
//           </select>
//           <button onClick={load}
//             className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
//             Filter
//           </button>
//         </div>
//       </div>

//       {msg && (
//         <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
//           {msg}
//         </div>
//       )}

//       {loading && <p className="text-sm text-zinc-400">Loading recommendations...</p>}

//       {!loading && jobs.length === 0 && (
//         <div className="text-center py-16 text-zinc-400">
//           <p className="text-sm">No recommendations yet.</p>
//           <p className="text-xs mt-1">Update your skills in your profile to get matched.</p>
//         </div>
//       )}

//       <div className="space-y-3">
//         {jobs.map(j => (
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
//                 <div className="text-xs text-zinc-400 mt-2">Required: {j.requiredSkills}</div>
//               </div>
//               {/* Match score badge */}
//               <div className="text-right shrink-0">
//                 <div className={`text-2xl font-bold ${
//                   j.matchScore >= 70 ? 'text-emerald-600'
//                   : j.matchScore >= 40 ? 'text-amber-500'
//                   : 'text-zinc-400'
//                 }`}>{j.matchScore}%</div>
//                 <div className="text-xs text-zinc-400">match</div>
//               </div>
//             </div>
//             <div className="flex gap-2 mt-4">
//               <button
//                 onClick={() => navigate(`/jobseeker/jobs/${j.jobId}`, { state: { job: j } })}
//                 className="px-4 py-1.5 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-50"
//               >
//                 View
//               </button>
//               <button
//                 onClick={() => apply(j.jobId)}
//                 disabled={applied.has(j.jobId)}
//                 className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700
//                            disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {applied.has(j.jobId) ? 'Applied' : 'Apply'}
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
import { getRecommendations, applyToJob, getMyApplications } from '../../services/jobSeeker'

const matchColor = s => s >= 70 ? '#16a34a' : s >= 40 ? '#d97706' : '#6b6459'

export default function JSRecommendations() {
  const { user } = useAuth()
  const id = user?.profileId
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [applied, setApplied] = useState(new Set())
  const [filters, setFilters] = useState({ jobType: '', workMode: '' })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getMyApplications(id).then(r => setApplied(new Set((r.data || []).map(a => a.jobId))))
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try { setJobs(await getRecommendations(id, filters)) }
    finally { setLoading(false) }
  }

  const apply = async (jobId) => {
    try {
      const res = await applyToJob({ jobSeekerId: id, jobId })
      setApplied(prev => new Set([...prev, jobId]))
      setMsg(`Applied! Match: ${res.matchScore}%`)
      setTimeout(() => setMsg(''), 3000)
    } catch (err) { setMsg(err.message); setTimeout(() => setMsg(''), 3000) }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1a1814', margin: '0 0 2px' }}>Recommended Jobs</h2>
          <p style={{ color: '#a09890', fontSize: 13, margin: 0 }}>Ranked by match score · {jobs.length} results</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Select value={filters.jobType} onChange={e => setFilters({...filters, jobType: e.target.value})} options={[['','All types'],['FullTime','Full Time'],['PartTime','Part Time'],['Internship','Internship']]} />
          <Select value={filters.workMode} onChange={e => setFilters({...filters, workMode: e.target.value})} options={[['','All modes'],['OnSite','On Site'],['Remote','Remote'],['Hybrid','Hybrid']]} />
          <button onClick={load} style={{ padding: '7px 16px', borderRadius: 8, background: '#1a1814', color: '#f0ece4', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Filter</button>
        </div>
      </div>

      {msg && <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 8, fontSize: 13, color: '#16a34a' }}>{msg}</div>}
      {loading && <p style={{ color: '#a09890', fontSize: 14 }}>Finding matches...</p>}
      {!loading && jobs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a09890' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: '#6b6459', marginBottom: 6 }}>No matches yet</div>
          <div style={{ fontSize: 13 }}>Add skills to your profile to start getting recommendations.</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {jobs.map(j => (
          <div key={j.jobId} style={{ background: '#fff', border: '1px solid #e8e3da', borderRadius: 14, padding: '18px 20px', transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow='0 2px 16px rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1814', marginBottom: 3 }}>{j.jobTitle}</div>
                <div style={{ fontSize: 13, color: '#6b6459', marginBottom: 10 }}>{j.companyName}{j.location ? ` · ${j.location}` : ''}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {[j.jobType, j.workMode, j.salaryRange].filter(Boolean).map(t => (
                    <span key={t} style={{ padding: '3px 10px', background: '#f7f4ef', border: '1px solid #e8e3da', borderRadius: 20, fontSize: 12, color: '#6b6459' }}>{t}</span>
                  ))}
                </div>
                {j.requiredSkills && (
                  <div style={{ fontSize: 12, color: '#a09890' }}>Skills: {j.requiredSkills}</div>
                )}
              </div>

              {/* Match score */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: matchColor(j.matchScore), lineHeight: 1 }}>{j.matchScore}<span style={{ fontSize: 13 }}>%</span></div>
                <div style={{ fontSize: 10, color: '#a09890', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Match</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid #f0ece4' }}>
              <button onClick={() => navigate(`/jobseeker/jobs/${j.jobId}`, { state: { job: j } })}
                style={{ padding: '7px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #e8e3da', color: '#6b6459', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                View Details
              </button>
              <button onClick={() => apply(j.jobId)} disabled={applied.has(j.jobId)}
                style={{ padding: '7px 18px', borderRadius: 8, border: 'none', cursor: applied.has(j.jobId) ? 'default' : 'pointer', fontSize: 13, fontWeight: 600,
                  background: applied.has(j.jobId) ? '#f0ece4' : '#1a1814',
                  color: applied.has(j.jobId) ? '#a09890' : '#f0ece4',
                }}>
                {applied.has(j.jobId) ? '✓ Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={onChange} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e8e3da', background: '#fff', fontSize: 13, color: '#6b6459', cursor: 'pointer' }}>
    {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
  </select>
)