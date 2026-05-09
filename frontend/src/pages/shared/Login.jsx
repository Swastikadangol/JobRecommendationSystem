import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { authApi } from '../../api'
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react'

// Login page component (handles user authentication)
export default function Login() {

  // form state for email and password
  const [form, setForm] = useState({ email: '', password: '' })

  // toggle password visibility
  const [showPw, setShowPw] = useState(false)

  // loading state during API request
  const [loading, setLoading] = useState(false)

  // auth context login function (stores user globally)
  const { login } = useAuth()

  // toast notification system
  const { addToast } = useToast()

  // navigation hook (redirect after login)
  const navigate = useNavigate()

  // handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault() // prevent page reload
    setLoading(true) // start loading state

    try {
      // call backend login API
      const { data } = await authApi.login(form)

      // save user in auth context + localStorage
      login(data)

      // success toast message
      addToast('Welcome back! 👋', 'success')

      // redirect based on user role
      if (data.role === 0 || data.role === 'JobSeeker')
        navigate('/dashboard')
      else if (data.role === 1 || data.role === 'Employer')
        navigate('/employer/dashboard')
      else
        navigate('/admin/dashboard')

    } catch (err) {

      // error toast message (API fallback handling)
      addToast(err.response?.data || 'Invalid credentials', 'error')

    } finally {
      setLoading(false) // stop loading state
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-surface-100 flex items-center justify-center p-4">

      <div className="w-full max-w-sm">

        {/* ── Logo Section ── */}
        <div className="flex items-center gap-2.5 justify-center mb-8">

          {/* app logo icon container */}
          <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-200">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>

          {/* app name */}
          <span className="font-display font-semibold text-xl text-ink">
            TalentMatch
          </span>
        </div>

        {/* ── Login Card ── */}
        <div className="card shadow-modal">

          {/* heading */}
          <h1 className="font-display font-semibold text-xl text-ink mb-1">
            Welcome back
          </h1>

          {/* sub text */}
          <p className="text-sm text-ink-muted mb-6">
            Sign in to your account
          </p>

          {/* login form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* email field */}
            <div>
              <label className="label">Email</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}

                // update email state
                onChange={e =>
                  setForm({ ...form, email: e.target.value })
                }

                className="input"
                required
              />
            </div>

            {/* password field */}
            <div>
              <label className="label">Password</label>

              <div className="relative">

                <input
                  type={showPw ? 'text' : 'password'} // toggle visibility
                  placeholder="••••••••"
                  value={form.password}

                  // update password state
                  onChange={e =>
                    setForm({ ...form, password: e.target.value })
                  }

                  className="input pr-10"
                  required
                />

                {/* show/hide password button */}
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
              className="btn-primary w-full justify-center py-2.5"
            >

              {/* loading state UI */}
              {loading ? (
                <span className="flex items-center gap-2">

                  {/* spinner icon */}
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

                  Signing in…
                </span>
              ) : (
                // default button state
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* register link */}
          <p className="text-center text-sm text-ink-muted mt-5">
            Don't have an account?{' '}

            <Link
              to="/register"
              className="text-brand-600 font-medium hover:text-brand-700"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}