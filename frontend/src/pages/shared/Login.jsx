import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { authApi } from '../../api'
import { Zap, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'

export default function Login() {
  const [form, setForm]               = useState({ email: '', password: '' })
  const [showPw, setShowPw]           = useState(false)
  const [loading, setLoading]         = useState(false)
  const [errors, setErrors]           = useState({})
  const [serverError, setServerError] = useState('')

  const { login }    = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Enter a valid email address'
    }
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // only clear the field-level error, NOT the server error
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // don't clear serverError here — keep it visible until a new attempt completes

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setServerError('') // clear only right before the new request fires
    try {
      const { data } = await authApi.login(form)
      login(data)
      addToast('Welcome back! 👋', 'success')
      if      (data.role === 0 || data.role === 'JobSeeker') navigate('/dashboard')
      else if (data.role === 1 || data.role === 'Employer')  navigate('/employer/dashboard')
      else                                                    navigate('/admin/dashboard')
    } catch (err) {
      const raw = err.response?.data
      const msg =
        typeof raw === 'string' ? raw
        : raw?.message          ? raw.message
        : raw?.errors           ? Object.values(raw.errors).flat().join('. ')
        : 'Incorrect email or password. Please try again.'
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
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Sign in to your account
          </p>

          {/* Server error — stays until next submit */}
          {serverError && (
            <div className="flex items-start gap-2.5 p-3 mb-5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                autoComplete="email"
                className={`input ${
                  errors.email
                    ? 'border-red-400 dark:border-red-600 focus:border-red-400 dark:focus:border-red-500 focus:ring-red-400/10'
                    : ''
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />{errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  autoComplete="current-password"
                  className={`input pr-10 ${
                    errors.password
                      ? 'border-red-400 dark:border-red-600 focus:border-red-400 dark:focus:border-red-500 focus:ring-red-400/10'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-slate-400 dark:text-slate-500
                             hover:text-slate-600 dark:hover:text-slate-300
                             transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />{errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-slate-100 dark:border-slate-800" />
            <span className="text-xs text-slate-400 dark:text-slate-600">or</span>
            <div className="flex-1 border-t border-slate-100 dark:border-slate-800" />
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register"
              className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
              Create one
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