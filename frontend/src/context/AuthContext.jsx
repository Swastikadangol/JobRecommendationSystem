// import React, { createContext, useContext, useState, useEffect } from 'react'
// import { authAPI } from '../api'

// //create a react context to share auth data globally
// const Ctx = createContext(null);

// //helper function : decode JWT token
// //JET format : header.payload.signature we only use payload
// function parseJwt(token){
//     try{
//         //split token and get payload part
//         //atob = ASCII to Binary
//         return JSON.parse(atob(token.split('.')[1]))
//     }catch{
//         //incvalid token
//         return null;
//     }
// }

// export function AuthProvider({ children }) {
//     //current logged-in user
//     const [user, setUser] = useState(null);

//     //page loading state while checking localstorage auth
//     const [loading, setLoading] = useState(true);

//     /**
//   * Runs once when app loads
//   * - checks if user exists in localStorage
//   * - validates token(JWT) expiry
//   * jm_user: jobmatch_user
//   */

//     useEffect(() => {
//         //get saved user from localstorage
//         const raw = localStorage.getItem('jm_user')
//         if (raw) {
//             try {
//                 //convert string into object
//                 const user = JSON.parse(raw);

//                 //decode JWT to check expiry time
//                 //example : {
//                 //     userId: 5,
//                 //         email: "test@gmail.com",
//                 //             exp: 1746600000
//                 // }
//                 const payload = parseJwt(user.token);

//                 //if token is still valid check token expiry
//                 // exp is in seconds → convert to milliseconds
//                 //if expiry time is greater than date now
//                 if (payload && payload.exp * 1000 > Date.now()) {

//                     // Restore logged-in user
//                     setUser(user)

//                 } else {

//                     // Remove expired login auth data
//                     localStorage.removeItem('jm_user')
//                     localStorage.removeItem('token')
//                 }
//             } catch {
//                 // Ignore broken JSON/token errors
//             }
//         }

//         //auth check completed
//         setLoading(false);
//     }, []);

//     //LOGIN FUNCTION

//     const login = async (email, password) => {
//         //send login request to backend API
//         const response = await authAPI.login({
//             Email: email,
//             Password: password
//         })

//         //get user data from response
//         const user = response.data;

//         //save token in localstorage
//         localStorage.setItem('token', user.token);

//         //save user object in localstorage
//         localStorage.setItem('jm_user', JSON.stringify(user));

//         //update react state
//         setUser(user);

//         return user;
//     }

//     //REGISTER

//     const register = async (fromData) => {

//         //create account
//         await authAPI.register(formData);

//         //auto login after register
//         return login(
//             formData.Email,
//             formData.Password
//         )
//     }

//     //LOGOUT
//     const logout = () => {

//         //remove saved auth data
//         localStorage.removeItem('token');
//         localStorage.removeItem('jm_user');

//         //clear state
//         setUser(null);

//     }

//     //UPDATE USER

//     const UpdateUser = (patch) => {

//         //merge old+ new data
//         const updated = {
//             ...user,
//             ...patch
//         }

//         //save updated user
//         localStorage.setItem(
//             'jm_user',
//             JSON.stringify(updated)
//         )

//         //updated stste
//         setUser(updated);
//     }

//     //provide auth data to whole app
//     return (
//         <Ctx.Provider
//             value={{
//                 user,
//                 loading,
//                 login,
//                 register,
//                 logout,
//                 updateUser
//             }}
//         >
//             {children}
//         </Ctx.Provider>
//     )
// }

// //costom hok
// export const useAuth = () => useContext(Ctx)

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    localStorage.setItem('token', userData.token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)