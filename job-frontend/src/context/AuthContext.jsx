import { createContext, useContext, useState } from 'react'

// 1. Create context (global storage)
const AuthContext = createContext(null)

// 2. Provider component (WRAPS your app)
export function AuthProvider({ children }) {

  // Store logged-in user
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user")

    // FIX: use "saved" not "savedUser"
    return saved ? JSON.parse(saved) : null
  })

  // LOGIN function
  const loginUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data))
    localStorage.setItem("token", data.token)

    setUser(data)
  }

  // LOGOUT function
  const logoutUser = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook (to use auth easily)
export function useAuth() {
  return useContext(AuthContext)
}