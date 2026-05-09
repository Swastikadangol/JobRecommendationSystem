import req from "./api"
// POST /api/auth/login          body: { email, password }
export const login = (data) => req('POST', '/auth/login', data)
 
// POST /api/auth/register       body: { username, email, password, role, fullName?, phone?, companyName?, contactNumber? }
export const register = (data) => req('POST', '/auth/register', data)