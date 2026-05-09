import req from "./api"
// GET  /api/admin/stats
export const getStats = () => req('GET', '/admin/stats')
 
// GET  /api/admin/users
export const getAllUsers = () => req('GET', '/admin/users')
 
// GET  /api/admin/users/jobseekers
export const getJobSeekers = () => req('GET', '/admin/users/jobseekers')
 
// GET  /api/admin/users/employers
export const getEmployers = () => req('GET', '/admin/users/employers')
 
// PUT  /api/admin/users/{userId}/toggle
export const toggleUserStatus = (userId) => req('PUT', `/admin/users/${userId}/toggle`)
 
// DELETE /api/admin/users/{userId}
export const deleteUser = (userId) => req('DELETE', `/admin/users/${userId}`)
 
// GET  /api/admin/jobs?status=Pending
export const getAllJobs = (status) =>
  req('GET', `/admin/jobs${status ? '?status=' + status : ''}`)
 
// PUT  /api/admin/jobs/{jobId}/approve
export const approveJob = (jobId) => req('PUT', `/admin/jobs/${jobId}/approve`)
 
// PUT  /api/admin/jobs/{jobId}/reject
export const rejectJob = (jobId) => req('PUT', `/admin/jobs/${jobId}/reject`)