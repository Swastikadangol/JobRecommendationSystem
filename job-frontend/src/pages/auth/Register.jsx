// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { register } from '../../services/auth'
// import { BriefcaseBusiness } from 'lucide-react'

// function Field({ label, ...props }) {
//   return (
//     <div>
//       <label className="block text-xs font-medium text-zinc-600 mb-1">{label}</label>
//       <input
//         className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm
//                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         {...props}
//       />
//     </div>
//   )
// }

// export default function Register() {
//   const navigate = useNavigate()
//   const [form, setForm] = useState({
//     username: '', email: '', password: '', role: 'JobSeeker',
//     fullName: '', phone: '', companyName: '', contactNumber: '',
//   })
//   const [error,   setError]   = useState('')
//   const [loading, setLoading] = useState(false)

//   const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

//   const handle = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     try {
//       await register({
//         username:      form.username,
//         email:         form.email,
//         password:      form.password,
//         role:          form.role,
//         fullName:      form.role === 'JobSeeker' ? form.fullName      : undefined,
//         phone:         form.role === 'JobSeeker' ? form.phone         : undefined,
//         companyName:   form.role === 'Employer'  ? form.companyName   : undefined,
//         contactNumber: form.role === 'Employer'  ? form.contactNumber : undefined,
//       })
//       navigate('/login')
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
//       <div className="w-full max-w-lg">

//         {/* Logo */}
//         <div className="flex items-center justify-center gap-2 mb-5">
//           <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
//             <BriefcaseBusiness size={17} className="text-white" />
//           </div>
//           <span className="text-lg font-bold text-zinc-800">JobMatch</span>
//         </div>

//         <div className="bg-white rounded-2xl border border-zinc-200 p-6">
//           <h2 className="text-base font-semibold text-zinc-800 mb-0.5">Create account</h2>
//           <p className="text-xs text-zinc-400 mb-4">Fill in your details to get started</p>

//           {error && (
//             <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handle}>
//             {/* Row 1 — username + email side by side */}
//             <div className="grid grid-cols-2 gap-10 mb-4">
//               <Field label="Username"  value={form.username} onChange={set('username')} required placeholder="johndoe" />
//               <Field label="Email" type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" />
//             </div>

//             {/* Row 2 — password + role side by side */}
//             <div className="grid grid-cols-2 gap-10 mb-4">
//               <Field label="Password" type="password" value={form.password} onChange={set('password')} required placeholder="••••••••" />
//               <div>
//                 <label className="block text-xs font-medium text-zinc-600 mb-1">Register as</label>
//                 <select
//                   value={form.role}
//                   onChange={set('role')}
//                   className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm
//                              focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="JobSeeker">Job Seeker</option>
//                   <option value="Employer">Employer</option>
//                 </select>
//               </div>
//             </div>

//             {/* Job Seeker extra fields — side by side */}
//             {form.role === 'JobSeeker' && (
//               <div className="grid grid-cols-2 gap-10 mb-4">
//                 <Field label="Full Name" value={form.fullName} onChange={set('fullName')} placeholder="John Doe" />
//                 <Field label="Phone"     value={form.phone}    onChange={set('phone')}    placeholder="+977 98XXXXXXXX" />
//               </div>
//             )}

//             {/* Employer extra fields — side by side */}
//             {form.role === 'Employer' && (
//               <div className="grid grid-cols-2 gap-10 mb-4">
//                 <Field label="Company Name"   value={form.companyName}   onChange={set('companyName')}   required placeholder="Acme Corp" />
//                 <Field label="Contact Number" value={form.contactNumber} onChange={set('contactNumber')} required placeholder="+977 98XXXXXXXX" />
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2.5 mt-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60
//                          text-white text-sm font-medium rounded-lg transition-colors"
//             >
//               {loading ? 'Creating account...' : 'Create account'}
//             </button>
//           </form>

//           <p className="mt-4 text-center text-xs text-zinc-500">
//             Already have an account?{' '}
//             <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../services/auth'

function Field({ label, ...props }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(240,236,228,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      <input style={{
        width: '100%', padding: '9px 12px', borderRadius: 8,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        color: '#f0ece4', fontSize: 13, outline: 'none',
      }}
        onFocus={e => e.target.style.borderColor = 'rgba(201,169,110,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        {...props}
      />
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'JobSeeker', fullName: '', phone: '', companyName: '', contactNumber: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm({ ...form, [k]: e.target.value })

  const handle = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      await register({
        username: form.username, email: form.email, password: form.password, role: form.role,
        fullName: form.role === 'JobSeeker' ? form.fullName : undefined,
        phone: form.role === 'JobSeeker' ? form.phone : undefined,
        companyName: form.role === 'Employer' ? form.companyName : undefined,
        contactNumber: form.role === 'Employer' ? form.contactNumber : undefined,
      })
      navigate('/login')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const selStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0ece4', fontSize: 13, outline: 'none',
  }
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(240,236,228,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #c9a96e, #e8c98a)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#0f1117', fontFamily: 'Georgia, serif', marginBottom: 12 }}>J</div>
          <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 20, color: '#f0ece4' }}>Create account</div>
          <div style={{ fontSize: 13, color: 'rgba(240,236,228,0.4)', marginTop: 3 }}>Join JobMatch today</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          {error && <div style={{ marginBottom: 14, padding: '9px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 13, color: '#f87171' }}>{error}</div>}

          <form onSubmit={handle}>
            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <Field label="Username" value={form.username} onChange={set('username')} required placeholder="johndoe" />
              <Field label="Email" type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" />
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <Field label="Password" type="password" value={form.password} onChange={set('password')} required placeholder="••••••••" />
              <div>
                <label style={labelStyle}>Register as</label>
                <select value={form.role} onChange={set('role')} style={selStyle}>
                  <option value="JobSeeker">Job Seeker</option>
                  <option value="Employer">Employer</option>
                </select>
              </div>
            </div>

            {/* Row 3 — conditional */}
            {form.role === 'JobSeeker' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <Field label="Full Name" value={form.fullName} onChange={set('fullName')} placeholder="John Doe" />
                <Field label="Phone" value={form.phone} onChange={set('phone')} placeholder="+977 98XXXXXXXX" />
              </div>
            )}
            {form.role === 'Employer' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <Field label="Company Name" value={form.companyName} onChange={set('companyName')} required placeholder="Acme Corp" />
                <Field label="Contact Number" value={form.contactNumber} onChange={set('contactNumber')} required placeholder="+977 98XXXXXXXX" />
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', marginTop: 4, padding: '11px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: loading ? 'rgba(201,169,110,0.5)' : 'linear-gradient(135deg, #c9a96e, #e8c98a)',
              color: '#0f1117', fontSize: 14, fontWeight: 600,
            }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'rgba(240,236,228,0.35)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}