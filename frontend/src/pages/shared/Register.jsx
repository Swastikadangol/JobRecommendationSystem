
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { authApi } from '../../api'
import { Zap, Eye, EyeOff, ArrowRight, User, Building2, AlertCircle } from 'lucide-react'
 
const ROLES = [
  { label: 'Job Seeker', value: '0', icon: User,      desc: 'Find your next opportunity' },
  { label: 'Employer',   value: '1', icon: Building2, desc: 'Post jobs & find talent'    },
]
 
// Reusable field error message
function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />{msg}
    </p>
  )
}
 
export default function Register() {
  const [role, setRole]   = useState('0')
  const [form, setForm]   = useState({
    username: '', email: '', password: '', confirmPassword: '',
    fullName: '', phone: '',
    companyName: '', contactNumber: '',
  })
  const [showPw, setShowPw]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [errors, setErrors]         = useState({})
  const [serverError, setServerError] = useState('')
 
  const { addToast } = useToast()
  const navigate     = useNavigate()
 
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    if (serverError)   setServerError('')
  }
 
  const handleRoleChange = (val) => {
    setRole(val)
    setErrors({})
    setServerError('')
  }
 
  const validate = () => {
    const e = {}
 
    // Username
    if (!form.username.trim()) {
      e.username = 'Username is required'
    } else if (form.username.trim().length < 3) {
      e.username = 'Username must be at least 3 characters'
    } else if (/\s/.test(form.username)) {
      e.username = 'Username cannot contain spaces'
    }
 
    // Full name
    if (!form.fullName.trim()) {
      e.fullName = role === '0' ? 'Full name is required' : 'Contact name is required'
    }
 
    // Email
    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Enter a valid email address'
    }
 
    // Employer fields
    if (role === '1') {
      if (!form.companyName.trim()) e.companyName = 'Company name is required'
      if (!form.contactNumber.trim()) {
        e.contactNumber = 'Company phone is required'
      } else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.contactNumber.trim())) {
        e.contactNumber = 'Enter a valid phone number'
      }
    }
 
    // Phone (optional for jobseeker but validate format if filled)
    if (role === '0' && form.phone.trim() && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim())) {
      e.phone = 'Enter a valid phone number'
    }
 
    // Password
    if (!form.password) {
      e.password = 'Password is required'
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters'
    } else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      e.password = 'Password must contain letters and numbers'
    }
 
    // Confirm password
    if (!form.confirmPassword) {
      e.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match'
    }
 
    return e
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
 
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
 
    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      const roleMap = { '0': 'JobSeeker', '1': 'Employer' }
      await authApi.register({ ...payload, role: roleMap[role] })
      addToast('Account created! Please sign in.', 'success')
      navigate('/login')
    } catch (err) {
      const raw = err.response?.data
      const msg =
        typeof raw === 'string' ? raw
        : raw?.message          ? raw.message
        : raw?.errors           ? Object.values(raw.errors).flat().join('. ')
        : 'Registration failed. Please try again.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-sm">
 
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-display font-semibold text-xl text-slate-900 dark:text-white">
            TalentMatch
          </span>
        </div>
 
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/60 p-6">
 
          <h1 className="font-display font-semibold text-xl text-slate-900 dark:text-white mb-1">
            Create account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Join thousands finding great jobs
          </p>
 
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => handleRoleChange(r.value)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 ${
                  role === r.value
                    ? 'border-brand-500 dark:border-brand-600 bg-brand-50 dark:bg-brand-950/50'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <r.icon className={`w-4 h-4 mb-1.5 ${
                  role === r.value ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'
                }`} />
                <div className={`text-xs font-semibold ${
                  role === r.value ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {r.label}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>
 
          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
            </div>
          )}
 
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
 
            {/* Username + Full Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Username</label>
                <input
                  type="text" placeholder="johndoe" autoComplete="username"
                  value={form.username}
                  onChange={e => handleChange('username', e.target.value)}
                  className={`input ${errors.username ? 'border-red-400 dark:border-red-600' : ''}`}
                />
                <FieldError msg={errors.username} />
              </div>
              <div>
                <label className="label">{role === '0' ? 'Full Name' : 'Contact'}</label>
                <input
                  type="text" placeholder="John Doe"
                  value={form.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                  className={`input ${errors.fullName ? 'border-red-400 dark:border-red-600' : ''}`}
                />
                <FieldError msg={errors.fullName} />
              </div>
            </div>
 
            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email" placeholder="you@example.com" autoComplete="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                className={`input ${errors.email ? 'border-red-400 dark:border-red-600' : ''}`}
              />
              <FieldError msg={errors.email} />
            </div>
 
            {/* JobSeeker: optional phone */}
            {role === '0' && (
              <div>
                <label className="label">
                  Phone{' '}
                  <span className="normal-case font-normal text-slate-400 dark:text-slate-500">(optional)</span>
                </label>
                <input
                  type="tel" placeholder="+977 98XXXXXXXX"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  className={`input ${errors.phone ? 'border-red-400 dark:border-red-600' : ''}`}
                />
                <FieldError msg={errors.phone} />
              </div>
            )}
 
            {/* Employer: company name + phone */}
            {role === '1' && (
              <>
                <div>
                  <label className="label">Company Name</label>
                  <input
                    type="text" placeholder="Acme Corp"
                    value={form.companyName}
                    onChange={e => handleChange('companyName', e.target.value)}
                    className={`input ${errors.companyName ? 'border-red-400 dark:border-red-600' : ''}`}
                  />
                  <FieldError msg={errors.companyName} />
                </div>
                <div>
                  <label className="label">Company Phone</label>
                  <input
                    type="tel" placeholder="+977 98XXXXXXXX"
                    value={form.contactNumber}
                    onChange={e => handleChange('contactNumber', e.target.value)}
                    className={`input ${errors.contactNumber ? 'border-red-400 dark:border-red-600' : ''}`}
                  />
                  <FieldError msg={errors.contactNumber} />
                </div>
              </>
            )}
 
            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 chars with letters & numbers"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  className={`input pr-10 ${errors.password ? 'border-red-400 dark:border-red-600' : ''}`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError msg={errors.password} />
            </div>
 
            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={e => handleChange('confirmPassword', e.target.value)}
                  className={`input pr-10 ${errors.confirmPassword ? 'border-red-400 dark:border-red-600' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError msg={errors.confirmPassword} />
            </div>
 
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 !mt-5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
 
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-slate-100 dark:border-slate-800" />
            <span className="text-xs text-slate-400 dark:text-slate-600">or</span>
            <div className="flex-1 border-t border-slate-100 dark:border-slate-800" />
          </div>
 
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login"
              className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
 
        <p className="text-center mt-5">
          <Link to="/"
            className="text-xs text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}