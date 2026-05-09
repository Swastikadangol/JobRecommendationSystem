// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import {
//   getJSProfile, updateJSProfile,
//   getExperiences, deleteExperience,
// } from '../../services/jobSeeker'
// import { Pencil, Trash2, PlusCircle } from 'lucide-react'

// const EDU    = ['HighSchool', 'Diploma', 'Bachelor', 'Master', 'PhD']
// const JTYPE  = ['FullTime', 'PartTime', 'Internship']
// const WMODE  = ['OnSite', 'Remote', 'Hybrid']

// export default function JSProfile() {
//   const { user } = useAuth()
//   const id = user?.profileId

//   const [profile,     setProfile]     = useState(null)
//   const [experiences, setExperiences] = useState([])
//   const [editing,     setEditing]     = useState(false)
//   const [form,        setForm]        = useState({})
//   const [msg,         setMsg]         = useState('')
//   const [error,       setError]       = useState('')

//   useEffect(() => {
//     getJSProfile(id).then(setProfile)
//     getExperiences(id).then(setExperiences)
//   }, [id])

//   const startEdit = () => {
//     setForm({
//       fullName:          profile.fullName        || '',
//       phone:             profile.phone           || '',
//       skills:            profile.skills          || '',
//       educationLevel:    profile.educationLevel  || '',
//       preferredJobType:  profile.preferredJobType  || '',
//       preferredWorkMode: profile.preferredWorkMode || '',
//     })
//     setEditing(true)
//   }

//   const save = async () => {
//     try {
//       const updated = await updateJSProfile(id, {
//         ...form,
//         educationLevel:    form.educationLevel    || null,
//         preferredJobType:  form.preferredJobType  || null,
//         preferredWorkMode: form.preferredWorkMode || null,
//       })
//       setProfile(updated.profile || { ...profile, ...form })
//       setEditing(false)
//       setMsg('Profile updated!')
//       setTimeout(() => setMsg(''), 3000)
//     } catch (err) {
//       setError(err.message)
//     }
//   }

//   const removeExp = async (expId) => {
//     if (!window.confirm('Delete this experience?')) return
//     try {
//       await deleteExperience(expId)
//       setExperiences(experiences.filter(e => e.experienceId !== expId))
//     } catch (err) {
//       setError(err.message)
//     }
//   }

//   if (!profile) return <p className="text-zinc-500 text-sm">Loading profile...</p>

//   return (
//     <div className="max-w-2xl space-y-8">

//       {/* ── Profile card ── */}
//       <div className="bg-white border border-zinc-200 rounded-xl p-6">
//         <div className="flex items-center justify-between mb-5">
//           <h3 className="font-semibold text-zinc-800">Profile Details</h3>
//           {!editing && (
//             <button onClick={startEdit}
//               className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
//               <Pencil size={14} />Edit
//             </button>
//           )}
//         </div>

//         {msg   && <p className="mb-3 text-sm text-emerald-600">{msg}</p>}
//         {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

//         {!editing ? (
//           <div className="space-y-3">
//             <Row label="Full Name"       value={profile.fullName} />
//             <Row label="Skills"          value={profile.skills          || '—'} />
//             <Row label="Education"       value={profile.educationLevel  || '—'} />
//             <Row label="Preferred Type"  value={profile.preferredJobType  || '—'} />
//             <Row label="Preferred Mode"  value={profile.preferredWorkMode || '—'} />
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <Field label="Full Name"   value={form.fullName}  onChange={e => setForm({...form, fullName: e.target.value})} />
//             <Field label="Phone"       value={form.phone}     onChange={e => setForm({...form, phone: e.target.value})} />
//             <Field label="Skills (comma separated)" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="React,Node.js,SQL" />

//             <Select label="Education Level"     value={form.educationLevel}    onChange={e => setForm({...form, educationLevel: e.target.value})}    options={EDU} />
//             <Select label="Preferred Job Type"  value={form.preferredJobType}  onChange={e => setForm({...form, preferredJobType: e.target.value})}  options={JTYPE} />
//             <Select label="Preferred Work Mode" value={form.preferredWorkMode} onChange={e => setForm({...form, preferredWorkMode: e.target.value})} options={WMODE} />

//             <div className="flex gap-3 pt-1">
//               <button onClick={save}
//                 className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
//                 Save Changes
//               </button>
//               <button onClick={() => setEditing(false)}
//                 className="px-4 py-2 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-50">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── Experience ── */}
//       <div className="bg-white border border-zinc-200 rounded-xl p-6">
//         <div className="flex items-center justify-between mb-5">
//           <h3 className="font-semibold text-zinc-800">Work Experience</h3>
//           <Link to="/jobseeker/experience/new"
//             className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
//             <PlusCircle size={14} />Add
//           </Link>
//         </div>

//         {experiences.length === 0 ? (
//           <p className="text-sm text-zinc-400">No experience added yet.</p>
//         ) : (
//           <div className="space-y-4">
//             {experiences.map(exp => (
//               <div key={exp.experienceId}
//                 className="border border-zinc-100 rounded-lg p-4 hover:border-zinc-200 transition-colors">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <div className="font-medium text-zinc-800 text-sm">{exp.jobTitle}</div>
//                     <div className="text-xs text-zinc-500 mt-0.5">{exp.companyName}</div>
//                     <div className="text-xs text-zinc-400 mt-1">
//                       {exp.startDate?.slice(0, 10)} — {exp.endDate?.slice(0, 10) || 'Present'}
//                     </div>
//                     {exp.description && (
//                       <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{exp.description}</p>
//                     )}
//                   </div>
//                   <div className="flex gap-2 ml-4 shrink-0">
//                     <Link to={`/jobseeker/experience/${exp.experienceId}/edit`}
//                       className="text-zinc-400 hover:text-blue-600 transition-colors">
//                       <Pencil size={14} />
//                     </Link>
//                     <button onClick={() => removeExp(exp.experienceId)}
//                       className="text-zinc-400 hover:text-red-500 transition-colors">
//                       <Trash2 size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// const Row = ({ label, value }) => (
//   <div className="flex gap-4 text-sm">
//     <span className="w-36 shrink-0 text-zinc-400">{label}</span>
//     <span className="text-zinc-700">{value}</span>
//   </div>
// )

// function Field({ label, ...props }) {
//   return (
//     <div>
//       <label className="block text-xs font-medium text-zinc-600 mb-1">{label}</label>
//       <input className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm
//                         focus:outline-none focus:ring-2 focus:ring-blue-500" {...props} />
//     </div>
//   )
// }

// function Select({ label, value, onChange, options }) {
//   return (
//     <div>
//       <label className="block text-xs font-medium text-zinc-600 mb-1">{label}</label>
//       <select value={value} onChange={onChange}
//         className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm
//                    focus:outline-none focus:ring-2 focus:ring-blue-500">
//         <option value="">— select —</option>
//         {options.map(o => <option key={o} value={o}>{o}</option>)}
//       </select>
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getJSProfile, updateJSProfile, getExperiences, deleteExperience } from '../../services/jobSeeker'

const EDU   = ['HighSchool','Diploma','Bachelor','Master','PhD']
const JTYPE = ['FullTime','PartTime','Internship']
const WMODE = ['OnSite','Remote','Hybrid']

export default function JSProfile() {
  const { user } = useAuth()
  const id = user?.profileId
  const [profile, setProfile] = useState(null)
  const [exps, setExps] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getJSProfile(id).then(setProfile)
    getExperiences(id).then(setExps)
  }, [id])

  const save = async () => {
    try {
      const r = await updateJSProfile(id, { ...form, educationLevel: form.educationLevel || null, preferredJobType: form.preferredJobType || null, preferredWorkMode: form.preferredWorkMode || null })
      setProfile(r.profile || { ...profile, ...form })
      setEditing(false); setMsg('Saved!'); setTimeout(() => setMsg(''), 2500)
    } catch (err) { setError(err.message) }
  }

  const removeExp = async (expId) => {
    if (!window.confirm('Delete this experience?')) return
    await deleteExperience(expId)
    setExps(exps.filter(e => e.experienceId !== expId))
  }

  if (!profile) return <p style={{ color: '#a09890', fontSize: 14 }}>Loading...</p>

  return (
    <div style={{ maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Profile card */}
      <div style={{ background: '#fff', border: '1px solid #e8e3da', borderRadius: 16 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0ece4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 17, fontWeight: 400, color: '#1a1814', margin: 0 }}>Profile Details</h3>
          {!editing
            ? <button onClick={() => { setForm({ fullName: profile.fullName||'', phone: profile.phone||'', skills: profile.skills||'', educationLevel: profile.educationLevel||'', preferredJobType: profile.preferredJobType||'', preferredWorkMode: profile.preferredWorkMode||'' }); setEditing(true) }} style={ghostBtn}>Edit</button>
            : null}
        </div>
        <div style={{ padding: '20px 24px' }}>
          {msg && <div style={{ marginBottom: 12, fontSize: 13, color: '#16a34a' }}>✓ {msg}</div>}
          {error && <div style={{ marginBottom: 12, fontSize: 13, color: '#dc2626' }}>{error}</div>}
          {!editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Row label="Full Name"       value={profile.fullName} />
              <Row label="Skills"          value={profile.skills || '—'} />
              <Row label="Education"       value={profile.educationLevel || '—'} />
              <Row label="Preferred Type"  value={profile.preferredJobType || '—'} />
              <Row label="Preferred Mode"  value={profile.preferredWorkMode || '—'} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
              <Field label="Phone"     value={form.phone}    onChange={e => setForm({...form, phone: e.target.value})} />
              <Field label="Skills (comma separated)" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="React, Node.js, SQL" />
              <Select label="Education Level"     value={form.educationLevel}    onChange={e => setForm({...form, educationLevel: e.target.value})}    options={EDU} />
              <Select label="Preferred Job Type"  value={form.preferredJobType}  onChange={e => setForm({...form, preferredJobType: e.target.value})}  options={JTYPE} />
              <Select label="Preferred Work Mode" value={form.preferredWorkMode} onChange={e => setForm({...form, preferredWorkMode: e.target.value})} options={WMODE} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={save} style={primaryBtn}>Save Changes</button>
                <button onClick={() => setEditing(false)} style={ghostBtn}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      <div style={{ background: '#fff', border: '1px solid #e8e3da', borderRadius: 16 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0ece4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 17, fontWeight: 400, color: '#1a1814', margin: 0 }}>Work Experience</h3>
          <Link to="/jobseeker/experience/new" style={{ ...ghostBtn, textDecoration: 'none', display: 'inline-block' }}>+ Add</Link>
        </div>
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {exps.length === 0
            ? <p style={{ color: '#a09890', fontSize: 13, margin: 0 }}>No experience added yet.</p>
            : exps.map(exp => (
              <div key={exp.experienceId} style={{ padding: '14px 16px', background: '#f7f4ef', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1814' }}>{exp.jobTitle}</div>
                    <div style={{ fontSize: 13, color: '#6b6459', marginTop: 2 }}>{exp.companyName}</div>
                    <div style={{ fontSize: 12, color: '#a09890', marginTop: 4 }}>
                      {exp.startDate?.slice(0,10)} — {exp.endDate?.slice(0,10) || 'Present'}
                    </div>
                    {exp.description && <p style={{ fontSize: 12, color: '#6b6459', margin: '8px 0 0', lineHeight: 1.5 }}>{exp.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginLeft: 12, flexShrink: 0 }}>
                    <Link to={`/jobseeker/experience/${exp.experienceId}/edit`} style={{ fontSize: 12, color: '#c9a96e', textDecoration: 'none' }}>Edit</Link>
                    <button onClick={() => removeExp(exp.experienceId)} style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
    <span style={{ width: 140, flexShrink: 0, color: '#a09890', fontSize: 13 }}>{label}</span>
    <span style={{ color: '#1a1814' }}>{value}</span>
  </div>
)

function Field({ label, ...props }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#a09890', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      <input style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e8e3da', background: '#faf9f7', fontSize: 13, color: '#1a1814', outline: 'none' }}
        onFocus={e => e.target.style.borderColor = '#c9a96e'}
        onBlur={e => e.target.style.borderColor = '#e8e3da'}
        {...props}
      />
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#a09890', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      <select value={value} onChange={onChange} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e8e3da', background: '#faf9f7', fontSize: 13, color: '#1a1814', outline: 'none' }}>
        <option value="">— select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

const primaryBtn = { padding: '8px 18px', borderRadius: 8, background: '#1a1814', color: '#f0ece4', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }
const ghostBtn   = { padding: '7px 14px', borderRadius: 8, background: 'transparent', color: '#6b6459', border: '1px solid #e8e3da', cursor: 'pointer', fontSize: 13 }