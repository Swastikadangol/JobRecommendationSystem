import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { authApi } from '../../api'
import { Zap, Eye, EyeOff, ArrowRight, User, Building2 } from 'lucide-react'

// Role configuration (used to switch between Job Seeker and Employer registration)
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

// Register page component (handles user signup)
export default function Register() {

  // selected role (0 = Job Seeker, 1 = Employer)
  const [role, setRole] = useState('0')

  // form state for all input fields
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    companyName: '',
    contactNumber: '',
  })

  // toggle password visibility
  const [showPw, setShowPw] = useState(false)

  // loading state for API request
  const [loading, setLoading] = useState(false)

  // toast notification system
  const { addToast } = useToast()

  // navigation hook after successful registration
  const navigate = useNavigate()

  // helper function to reduce repetitive input handling
  const f = (k) => ({
    value: form[k],
    onChange: e =>
      setForm({ ...form, [k]: e.target.value })
  })

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault() // prevent page reload
    setLoading(true) // enable loading state

    try {
      // send registration request to backend
      await authApi.register({
        ...form,
        role: parseInt(role) // convert role string → number
      })

      // success toast message
      addToast('Account created! Please sign in.', 'success')

      // redirect to login page
      navigate('/login')

    } catch (err) {

      // error toast message (API fallback)
      addToast(err.response?.data || 'Registration failed', 'error')

    } finally {
      setLoading(false) // stop loading state
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-surface-100 flex items-center justify-center p-4">

      <div className="w-full max-w-sm">

        {/* ── Logo Section ── */}
        <div className="flex items-center gap-2.5 justify-center mb-8">

          {/* app logo icon */}
          <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-200">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>

          {/* app name */}
          <span className="font-display font-semibold text-xl text-ink">
            TalentMatch
          </span>
        </div>

        {/* ── Register Card ── */}
        <div className="card shadow-modal">

          {/* heading */}
          <h1 className="font-display font-semibold text-xl text-ink mb-1">
            Create account
          </h1>

          {/* sub text */}
          <p className="text-sm text-ink-muted mb-5">
            Join thousands finding great jobs
          </p>

          {/* ── Role Selector Section ── */}
          <div className="grid grid-cols-2 gap-2 mb-5">

            {/* map roles into selectable cards */}
            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}

                className={`p-3 rounded-xl border text-left transition-all duration-150 ${
                  role === r.value
                    ? 'border-brand-400 bg-brand-50' // active role style
                    : 'border-surface-200 hover:border-surface-300' // inactive style
                }`}
              >

                {/* role icon */}
                <r.icon
                  className={`w-4 h-4 mb-1 ${
                    role === r.value ? 'text-brand-600' : 'text-ink-light'
                  }`}
                />

                {/* role label */}
                <div
                  className={`text-xs font-medium ${
                    role === r.value ? 'text-brand-700' : 'text-ink'
                  }`}
                >
                  {r.label}
                </div>

                {/* role description */}
                <div className="text-xs text-ink-light">
                  {r.desc}
                </div>
              </button>
            ))}
          </div>

          {/* ── Registration Form ── */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* username + name row */}
            <div className="grid grid-cols-2 gap-3">

              {/* username field */}
              <div>
                <label className="label">Username</label>
                <input
                  type="text"
                  placeholder="johndoe"
                  className="input"
                  required
                  {...f('username')} // bind value + onChange
                />
              </div>

              {/* full name / contact name */}
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

            {/* email field */}
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

            {/* phone field (only for Job Seeker) */}
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

            {/* company fields (only for Employer) */}
            {role === '1' && (
              <>
                {/* company name */}
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

                {/* company contact */}
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

            {/* password field */}
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

                {/* toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink"
                >
                  {showPw
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 !mt-4"
            >

              {/* loading state UI */}
              {loading ? (
                <span className="flex items-center gap-2">

                  {/* spinner */}
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
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
                // default button state
                <>
                  Create account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* login redirect link */}
          <p className="text-center text-sm text-ink-muted mt-5">
            Already have an account?{' '}

            <Link
              to="/login"
              className="text-brand-600 font-medium hover:text-brand-700"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}