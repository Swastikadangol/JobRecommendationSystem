import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// // Job Seeker
import JSLayout from './layouts/JSLayout'
import JSDashboard from './pages/jobseeker/JSDashboard'
import JSProfile from './pages/jobseeker/JSProfile'
import JSExperienceForm from './pages/jobseeker/JSExperienceForm'
import JSRecommendations from './pages/jobseeker/JSRecommendations'
import JSBrowseJobs from './pages/jobseeker/JSBrowseJobs'
import JSJobDetail from './pages/jobseeker/JSJobDetail'
import JSApplications from './pages/jobseeker/JSApplications'

// // Employer
// import EmpLayout from './layouts/EmpLayout'
// import EmpDashboard from './pages/employer/EmpDashboard'
// import EmpProfile from './pages/employer/EmpProfile'
// import EmpPostJob from './pages/employer/EmpPostJob'
// import EmpMyJobs from './pages/employer/EmpMyJobs'
// import EmpEditJob from './pages/employer/EmpEditJob'
// import EmpApplicants from './pages/employer/EmpApplicants'

// // Admin
// import AdminLayout from './layouts/AdminLayout'
// import AdminDashboard from './pages/admin/AdminDashboard'
// import AdminUsers from './pages/admin/AdminUsers'
// import AdminJobs from './pages/admin/AdminJobs'
// import AdminPendingJobs from './pages/admin/AdminPendingJobs'

const router = createBrowserRouter([
  // ─── PUBLIC ───────────────────────────────────
  { path: '/login',    element: <Login /> },
  { path: '/register', element: <Register /> },

  // ─── JOB SEEKER ───────────────────────────────
  {
    path: '/jobseeker',
    element: (
      <ProtectedRoute role="JobSeeker">
        <JSLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                        element: <JSDashboard /> },
      { path: 'profile',                    element: <JSProfile /> },
      { path: 'experience/new',             element: <JSExperienceForm /> },
      { path: 'experience/:expId/edit',     element: <JSExperienceForm /> },
      { path: 'recommendations',            element: <JSRecommendations /> },
      { path: 'jobs',                       element: <JSBrowseJobs /> },
      { path: 'jobs/:jobId',                element: <JSJobDetail /> },
      { path: 'applications',               element: <JSApplications /> },
    ],
  },

  // ─── EMPLOYER ─────────────────────────────────
  // {
  //   path: '/employer',
  //   element: (
  //     <ProtectedRoute role="Employer">
  //       <EmpLayout />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     { index: true,                             element: <EmpDashboard /> },
  //     { path: 'profile',                         element: <EmpProfile /> },
  //     { path: 'post-job',                        element: <EmpPostJob /> },
  //     { path: 'my-jobs',                         element: <EmpMyJobs /> },
  //     { path: 'my-jobs/:jobId/edit',             element: <EmpEditJob /> },
  //     { path: 'my-jobs/:jobId/applicants',       element: <EmpApplicants /> },
  //   ],
  // },

  // // ─── ADMIN ────────────────────────────────────
  // {
  //   path: '/admin',
  //   element: (
  //     <ProtectedRoute role="Admin">
  //       <AdminLayout />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     { index: true,           element: <AdminDashboard /> },
  //     { path: 'users',         element: <AdminUsers /> },
  //     { path: 'jobs',          element: <AdminJobs /> },
  //     { path: 'pending-jobs',  element: <AdminPendingJobs /> },
  //   ],
  // },

  // ─── FALLBACK ─────────────────────────────────
  { path: '/',  element: <Navigate to="/login" replace /> },
  { path: '*',  element: <Navigate to="/login" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}