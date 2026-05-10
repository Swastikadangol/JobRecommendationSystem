import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/shared/Sidebar'
import ThemeToggle from './components/shared/ThemeToggle'

import Landing     from './pages/shared/Landing'
import Login       from './pages/shared/Login'
import Register    from './pages/shared/Register'
import Dashboard   from './pages/jobseeker/Dashboard'
import BrowseJobs  from './pages/jobseeker/BrowseJobs'
import Recommendations from './pages/jobseeker/Recommendations'
import Applications from './pages/jobseeker/Applications'
import Profile     from './pages/jobseeker/Profile'
import JobDetail   from './pages/jobseeker/JobDetail'

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto"><Outlet /></div>
      </main>
      <ThemeToggle />
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
    if (r === 0 || r === 'JobSeeker') return <Navigate to="/dashboard" replace />
    if (r === 1 || r === 'Employer')  return <Navigate to="/employer/dashboard" replace />
    return <Navigate to="/admin/dashboard" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
              <Route path="/login"    element={<PublicOnly><Login /></PublicOnly>} />
              <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

              <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
                <Route path="/dashboard"       element={<Dashboard />} />
                <Route path="/browse"          element={<BrowseJobs />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/applications"    element={<Applications />} />
                <Route path="/profile"         element={<Profile />} />
                <Route path="/jobs/:id"        element={<JobDetail />} />
                <Route path="/employer/*" element={<div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500">Employer portal — coming soon</div>} />
                <Route path="/admin/*"    element={<div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500">Admin portal — coming soon</div>} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {/* ThemeToggle also shown on public pages (landing, login, register) */}
            <ThemeToggle />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}