// import { useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { applyToJob } from '../../services/jobSeeker'
// import { ArrowLeft } from 'lucide-react'

// export default function JSJobDetail() {
//   const { state }  = useLocation()
//   const { user }   = useAuth()
//   const navigate   = useNavigate()
//   const job        = state?.job

//   const [applied,  setApplied]  = useState(false)
//   const [msg,      setMsg]      = useState('')
//   const [loading,  setLoading]  = useState(false)

//   if (!job) return (
//     <div className="text-center py-20">
//       <p className="text-zinc-400 text-sm mb-4">Job not found.</p>
//       <button onClick={() => navigate(-1)} className="text-blue-600 text-sm hover:underline">
//         Go back
//       </button>
//     </div>
//   )

//   const apply = async () => {
//     setLoading(true)
//     try {
//       const res = await applyToJob({ jobSeekerId: user.profileId, jobId: job.jobId })
//       setApplied(true)
//       setMsg(`Successfully applied! Your match score: ${res.matchScore}%`)
//     } catch (err) {
//       setMsg(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-2xl">
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 mb-6"
//       >
//         <ArrowLeft size={15} /> Back
//       </button>

//       <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
//         <div>
//           <h2 className="text-xl font-semibold text-zinc-800">{job.jobTitle}</h2>
//           <p className="text-zinc-500 mt-1">{job.companyName} · {job.location}</p>
//           <div className="flex flex-wrap gap-2 mt-3">
//             <Tag>{job.jobType}</Tag>
//             <Tag>{job.workMode}</Tag>
//             {job.salaryRange && <Tag>{job.salaryRange}</Tag>}
//           </div>
//         </div>

//         <Divider />

//         <Section title="Description">
//           <p className="text-sm text-zinc-600 leading-relaxed">
//             {job.jobDescription || 'No description provided.'}
//           </p>
//         </Section>

//         <Section title="Required Skills">
//           <p className="text-sm text-zinc-600">{job.requiredSkills}</p>
//         </Section>

//         <Section title="Requirements">
//           <div className="text-sm text-zinc-600 space-y-1">
//             {job.minimumEducationLevel && (
//               <p>Education: <span className="font-medium">{job.minimumEducationLevel}</span></p>
//             )}
//             {job.minYearsExperience != null && (
//               <p>Experience: <span className="font-medium">{job.minYearsExperience}+ years</span></p>
//             )}
//           </div>
//         </Section>

//         <Section title="Deadline">
//           <p className="text-sm text-zinc-600">{job.deadline?.slice(0, 10) || '—'}</p>
//         </Section>

//         <Divider />

//         {msg && (
//           <div className={`px-4 py-3 rounded-lg text-sm ${
//             applied
//               ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
//               : 'bg-red-50 border border-red-200 text-red-600'
//           }`}>
//             {msg}
//           </div>
//         )}

//         <button
//           onClick={apply}
//           disabled={applied || loading}
//           className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg
//                      hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {loading ? 'Applying...' : applied ? '✓ Applied' : 'Apply Now'}
//         </button>
//       </div>
//     </div>
//   )
// }

// const Tag     = ({ children }) => (
//   <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-md">{children}</span>
// )
// const Divider = () => <hr className="border-zinc-100" />
// const Section = ({ title, children }) => (
//   <div>
//     <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">{title}</h4>
//     {children}
//   </div>
// )

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { applyToJob } from '../../services/jobSeeker'

export default function JSJobDetail() {
  const { state } = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const job = state?.job
  const [applied, setApplied] = useState(false)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  if (!job) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ color: '#a09890', marginBottom: 12 }}>Job not found.</div>
      <button onClick={() => navigate(-1)} style={{ color: '#c9a96e', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>← Go back</button>
    </div>
  )

  const apply = async () => {
    setLoading(true)
    try {
      const res = await applyToJob({ jobSeekerId: user.profileId, jobId: job.jobId })
      setApplied(true)
      setMsg(`Application submitted! Your match score: ${res.matchScore}%`)
    } catch (err) { setMsg(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a09890', fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
        ← Back
      </button>

      <div style={{ background: '#fff', border: '1px solid #e8e3da', borderRadius: 16, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0ece4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1a1814', margin: '0 0 6px' }}>{job.jobTitle}</h2>
              <div style={{ fontSize: 14, color: '#6b6459' }}>{job.companyName}{job.location ? ` · ${job.location}` : ''}</div>
            </div>
            {job.matchScore != null && (
              <div style={{ textAlign: 'center', background: '#f7f4ef', borderRadius: 10, padding: '10px 16px' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: job.matchScore >= 70 ? '#16a34a' : '#d97706' }}>{job.matchScore}%</div>
                <div style={{ fontSize: 10, color: '#a09890', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Match</div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {[job.jobType, job.workMode, job.salaryRange].filter(Boolean).map(t => (
              <span key={t} style={{ padding: '4px 12px', background: '#f7f4ef', border: '1px solid #e8e3da', borderRadius: 20, fontSize: 12, color: '#6b6459' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {job.jobDescription && (
            <Section title="Description">
              <p style={{ fontSize: 14, color: '#6b6459', lineHeight: 1.7, margin: 0 }}>{job.jobDescription}</p>
            </Section>
          )}
          <Section title="Required Skills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {job.requiredSkills?.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                <span key={s} style={{ padding: '4px 12px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: 20, fontSize: 12, color: '#8a6d3b' }}>{s}</span>
              ))}
            </div>
          </Section>
          {(job.minimumEducationLevel || job.minYearsExperience != null) && (
            <Section title="Requirements">
              <div style={{ fontSize: 14, color: '#6b6459', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {job.minimumEducationLevel && <div>Education: <strong style={{ color: '#1a1814' }}>{job.minimumEducationLevel}</strong></div>}
                {job.minYearsExperience != null && <div>Experience: <strong style={{ color: '#1a1814' }}>{job.minYearsExperience}+ years</strong></div>}
              </div>
            </Section>
          )}
          {job.deadline && (
            <Section title="Deadline">
              <div style={{ fontSize: 14, color: '#6b6459' }}>{job.deadline.slice(0, 10)}</div>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '18px 28px', borderTop: '1px solid #f0ece4', background: '#faf9f7' }}>
          {msg && (
            <div style={{ marginBottom: 12, padding: '10px 14px', background: applied ? 'rgba(22,163,74,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${applied ? 'rgba(22,163,74,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8, fontSize: 13, color: applied ? '#16a34a' : '#ef4444' }}>{msg}</div>
          )}
          <button onClick={apply} disabled={applied || loading} style={{
            width: '100%', padding: '12px', borderRadius: 10, border: 'none', cursor: applied ? 'default' : 'pointer',
            background: applied ? '#f0ece4' : '#1a1814',
            color: applied ? '#a09890' : '#f0ece4',
            fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
          }}>
            {loading ? 'Applying...' : applied ? '✓ Application Submitted' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

const Section = ({ title, children }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 600, color: '#a09890', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{title}</div>
    {children}
  </div>
)