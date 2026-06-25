import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/shared/Sidebar'
import ThemeToggle from './components/shared/ThemeToggle'

// ── Shared pages ──
import Landing      from './pages/shared/Landing'
import Login        from './pages/shared/Login'
import Register     from './pages/shared/Register'

// ── Job Seeker pages ──
import Dashboard       from './pages/jobseeker/Dashboard'
import BrowseJobs      from './pages/jobseeker/BrowseJobs'
import Recommendations from './pages/jobseeker/Recommendations'
import Applications    from './pages/jobseeker/Applications'
import Profile         from './pages/jobseeker/Profile'
import JobDetail       from './pages/jobseeker/JobDetail'

// ── Employer pages ──
import EmployerDashboard  from './pages/employer/EmployerDashboard'
import EmployerJobs       from './pages/employer/EmployerJobs'
import EmployerPostJob    from './pages/employer/EmployerPostJob'
import EmployerEditJob    from './pages/employer/EmployerEditJob'
import EmployerApplicants from './pages/employer/EmployerApplicants'
import EmployerCandidates from './pages/employer/EmployerCandidates'
import EmployerProfile    from './pages/employer/EmployerProfile'



//admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminJobs      from './pages/admin/AdminJobs'
import AdminUsers     from './pages/admin/AdminUsers'
import AdminEmployers     from './pages/admin/AdminEmployers'
import AdminApplications from './pages/Admin/AdminApplications'
import AdminReports from './pages/Admin/AdminReports'

function AuthLogoutListener() {
  const navigate   = useNavigate()
  const { logout } = useAuth()
  useEffect(() => {
    const handler = () => { logout(); navigate('/login', { replace: true }) }
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [logout, navigate])
  return null
}

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1 md:ml-60 pt-14 md:pt-0 p-6 lg:p-8 overflow-auto">
        <div className="w-full max-w-full px-4 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}



function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) {
    const r = user.role
    if (r === 0 || r === 'JobSeeker') return <Navigate to="/dashboard"         replace />
    if (r === 1 || r === 'Employer')  return <Navigate to="/employer/dashboard" replace />
    return                                   <Navigate to="/admin/dashboard"    replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AuthLogoutListener />
            <Routes>

              {/* ── Public ── */}
              <Route path="/"         element={<PublicOnly><Landing  /></PublicOnly>} />
              <Route path="/login"    element={<PublicOnly><Login    /></PublicOnly>} />
              <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

              {/* ── Protected ── */}
              <Route element={<RequireAuth><AppLayout /></RequireAuth>}>

                {/* Job Seeker */}
                <Route path="/dashboard"       element={<Dashboard      />} />
                <Route path="/browse"          element={<BrowseJobs     />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/applications"    element={<Applications   />} />
                <Route path="/profile"         element={<Profile        />} />
                <Route path="/jobs/:id"        element={<JobDetail      />} />

                {/* Employer */}
                <Route path="/employer/dashboard"              element={<EmployerDashboard  />} />
                <Route path="/employer/jobs"                   element={<EmployerJobs       />} />
                <Route path="/employer/post-job"               element={<EmployerPostJob    />} />
                <Route path="/employer/jobs/:jobId/edit"       element={<EmployerEditJob    />} />
                <Route path="/employer/jobs/:jobId/applicants" element={<EmployerApplicants />} />
                <Route path="/employer/candidates"             element={<EmployerCandidates />} />
                <Route path="/employer/profile"                element={<EmployerProfile    />} />

                {/* Admin placeholder */}
                {/* Admin */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/jobs"      element={<AdminJobs      />} />
                <Route path="/admin/users"     element={<AdminUsers     />} />
                <Route path="/admin/employers" element={<AdminEmployers />} />
                <Route path="/admin/applications" element={<AdminApplications />} />
                <Route path="/admin/reports"      element={<AdminReports      />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
            <ThemeToggle />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}