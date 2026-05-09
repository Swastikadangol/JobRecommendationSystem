import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

   //  loading state while checking auth
  if (loading) return null
  // not logged in → go to login
  if (!user) return <Navigate to="/login" replace />

  // wrong role → go to login
  if (role && user.role !== role) return <Navigate to="/login" replace />

  return children
}