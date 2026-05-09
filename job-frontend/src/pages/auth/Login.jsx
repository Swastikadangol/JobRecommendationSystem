// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { login } from '../../services/auth'
// import { useAuth } from '../../context/AuthContext'
// import { BriefcaseBusiness } from 'lucide-react'

// export default function Login() {

//     //get function to store user
//     const { loginUser } = useAuth()

//     //navigate
//     const navigate = useNavigate()

//     //form state 
//     const [form, setForm] = useState({
//         email: '',
//         password: ''
//     })

//     //error message state
//     const [error, setError] = useState('');

//     //loading state : for button disable + text change
//     const [loading, setLoading] = useState(false);


//     // Helper function to update form fields
//     const set = (key) => (e) =>
//         setForm({ ...form, [key]: e.target.value })

//     //handle form submit
//     const handle = async (e) => {
//         //stop page reload
//         e.preventDefault()

//         //show loading state
//         setLoading(true)

//         //clea old errors
//         setError('');

//         try {
//             //call backend api for login
//             const data = await login(form);

//             //save user
//             loginUser(data)

//             if (data.role == 'JobSeeker') {
//                 navigate('/jobseeker')
//             } else if (data.role == 'Employer') {
//                 navigate('/employer')
//             } else {
//                 navigate('/admin')
//             }
//         } catch (err) {
//             //show error msg if login fails
//             setError(err.message)
//         } finally {
//             //stop loading no matter success or fail
//             setLoading(false)
//         }
//     }

//     return (
//         <div className='min-h-screen bg-zinc-50 flex items-center justify-center px-4'>
//             <div className='w-full max-w-sm'>
//                 {/* Logo section */}
//                 <div className='flex item-center justify-center gap-2 mb-8'>
//                     <div className='w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center'>
//                         <BriefcaseBusiness size={20} className="text-white" />
//                     </div>
//                     <span className="text-xl font-bold text-zinc-800">
//                         JobMatch
//                     </span>
//                 </div>
//                 {/* Login card */}
//                 <div className='bg-white rounded-2xl border border-zinc-200 p-8'>
//                     <h2 className='text-lg font-semibold text-zinc-800 mb-1'>
//                         Sign In
//                     </h2>
//                     <p className="text-sm text-zinc-500 mb-6">
//                         Welcome back
//                     </p>

//                     {/* Error message */}
//                     {error && (
//                         <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//                             {error}
//                         </div>
//                     )}

//                     <form onSubmit={handle} className='space-y-4'>
//                         <div>
//                             <label className="block text-sm font-medium text-zinc-700 mb-1.5">
//                                 Email
//                             </label>

//                             <input
//                                 type="email"
//                                 value={form.email}
//                                 onChange={set('email')}
//                                 required
//                                 placeholder="you@example.com"
//                                 className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm
//                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-zinc-700 mb-1.5">
//                                 Password
//                             </label>

//                             <input
//                                 type="password"
//                                 value={form.password}
//                                 onChange={set('password')}
//                                 required
//                                 placeholder="••••••••"
//                                 className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm
//                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60
//                          text-white text-sm font-medium rounded-lg transition-colors"
//                         >
//                             {loading ? 'Signing in...' : 'Sign in'}
//                         </button>
//                     </form>
//                     <p className="mt-5 text-center text-sm text-zinc-500">
//                         No account?{' '}
//                         <Link
//                             to="/register"
//                             className="text-blue-600 hover:underline font-medium"
//                         >
//                             Register
//                         </Link>
//                     </p>

//                 </div>

//             </div>
//         </div>
//     )
// }

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../services/auth'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await login(form)
      loginUser(data)
      if (data.role === 'JobSeeker') navigate('/jobseeker')
      else if (data.role === 'Employer') navigate('/employer')
      else navigate('/admin')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #c9a96e, #e8c98a)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#0f1117', fontFamily: 'Georgia, serif', marginBottom: 14 }}>J</div>
          <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 22, color: '#f0ece4', fontWeight: 400 }}>JobMatch</div>
          <div style={{ fontSize: 13, color: 'rgba(240,236,228,0.4)', marginTop: 4 }}>Sign in to your account</div>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 13, color: '#f87171' }}>
              {error}
            </div>
          )}
          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required />
            <Field label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required />
            <button type="submit" disabled={loading} style={{
              marginTop: 4, padding: '11px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: loading ? 'rgba(201,169,110,0.5)' : 'linear-gradient(135deg, #c9a96e, #e8c98a)',
              color: '#0f1117', fontSize: 14, fontWeight: 600, transition: 'opacity 0.15s',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'rgba(240,236,228,0.35)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 500 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(240,236,228,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      <input style={{
        width: '100%', padding: '10px 12px', borderRadius: 8,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        color: '#f0ece4', fontSize: 14, outline: 'none', transition: 'border-color 0.15s',
      }}
        onFocus={e => e.target.style.borderColor = 'rgba(201,169,110,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        {...props}
      />
    </div>
  )
}