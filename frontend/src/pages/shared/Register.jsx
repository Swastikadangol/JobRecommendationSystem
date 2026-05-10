import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { authApi } from '../../api'
import {
  Zap,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Building2,
  Moon,
  Sun
} from 'lucide-react'

// Role configuration
const ROLES = [
  {
    label: 'Job Seeker',
    value: '0',
    icon: User,
    desc: 'Find your next opportunity'
  },
  {
    label: 'Employer',
    value: '1',
    icon: Building2,
    desc: 'Post jobs & find talent'
  },
]

export default function Register() {

  // selected role
  const [role, setRole] = useState('0')

  // form state
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    companyName: '',
    contactNumber: '',
  })

  // password visibility
  const [showPw, setShowPw] = useState(false)

  // loading state
  const [loading, setLoading] = useState(false)

  // theme state
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  )

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setDarkMode(document.documentElement.classList.contains('dark'))
  }

  // toast
  const { addToast } = useToast()

  // navigation
  const navigate = useNavigate()

  // helper for inputs
  const f = (k) => ({
    value: form[k],
    onChange: e =>
      setForm({ ...form, [k]: e.target.value })
  })

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {

      await authApi.register({
        ...form,
        role: parseInt(role)
      })

      addToast('Account created! Please sign in.', 'success')

      navigate('/login')

    } catch (err) {

      addToast(err.response?.data || 'Registration failed', 'error')

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">

      <div className="w-full max-w-sm">

       

        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">

          <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-200/50">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>

          <span className="font-display font-semibold text-xl text-slate-900 dark:text-white">
            TalentMatch
          </span>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/60 p-6">

          {/* Heading */}
          <h1 className="font-display font-semibold text-xl text-slate-900 dark:text-white mb-1">
            Create account
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Join thousands finding great jobs
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 mb-5">

            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}

                className={`p-3 rounded-xl border text-left transition-all duration-150 ${
                  role === r.value
                    ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >

                {/* Icon */}
                <r.icon
                  className={`w-4 h-4 mb-1 ${
                    role === r.value
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                />

                {/* Label */}
                <div
                  className={`text-xs font-medium ${
                    role === r.value
                      ? 'text-brand-700 dark:text-brand-300'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {r.label}
                </div>

                {/* Description */}
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  {r.desc}
                </div>

              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Username + Name */}
            <div className="grid grid-cols-2 gap-3">

              {/* Username */}
              <div>
                <label className="label">Username</label>

                <input
                  type="text"
                  placeholder="johndoe"
                  className="input"
                  required
                  {...f('username')}
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="label">
                  {role === '0' ? 'Full Name' : 'Contact Name'}
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  className="input"
                  {...f('fullName')}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>

              <input
                type="email"
                placeholder="you@example.com"
                className="input"
                required
                {...f('email')}
              />
            </div>

            {/* Phone for Job Seeker */}
            {role === '0' && (
              <div>
                <label className="label">Phone (optional)</label>

                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  className="input"
                  {...f('phone')}
                />
              </div>
            )}

            {/* Employer Fields */}
            {role === '1' && (
              <>
                {/* Company Name */}
                <div>
                  <label className="label">Company Name</label>

                  <input
                    type="text"
                    placeholder="Acme Corp"
                    className="input"
                    required
                    {...f('companyName')}
                  />
                </div>

                {/* Company Phone */}
                <div>
                  <label className="label">Company Phone</label>

                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    className="input"
                    required
                    {...f('contactNumber')}
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="label">Password</label>

              <div className="relative">

                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pr-10"
                  required
                  {...f('password')}
                />

                {/* Toggle Password */}
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPw
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 !mt-4"
            >

              {loading ? (
                <span className="flex items-center gap-2">

                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="30 70"
                    />
                  </svg>

                  Creating account…
                </span>
              ) : (
                <>
                  Create account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">

            Already have an account?{' '}

            <Link
              to="/login"
              className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}