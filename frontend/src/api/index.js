import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7227'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — skip auth endpoints (login returns 401 on wrong password)
api.interceptors.response.use(
  res => res,
  err => {
    const isAuthEndpoint = err.config?.url?.includes('/api/auth/')
    if (err.response?.status === 401 && !isAuthEndpoint) {
      console.log("401 from endpoint:", err.config?.url)
      console.log("Full error:", err)
      localStorage.clear()
      window.dispatchEvent(new Event('auth:logout'))
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ───── AUTH ─────
export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
}

// ───── JOB SEEKER ─────
export const jobSeekerApi = {
  getProfile: (id) => api.get(`/api/jobseeker/profile/${id}`),
  updateProfile: (id, data) => api.put(`/api/jobseeker/profile/${id}`, data),
  getExperiences: (id) => api.get(`/api/jobseeker/profile/${id}/experiences`),
  addExperience: (id, data) => api.post(`/api/jobseeker/profile/${id}/experience`, data),
  updateExperience: (expId, data) => api.put(`/api/jobseeker/experience/${expId}`, data),
  deleteExperience: (expId) => api.delete(`/api/jobseeker/experience/${expId}`),
  getApprovedJobs: (id, params) =>
    api.get(`/api/jobseeker/jobs/${id}`, { params }), getRecommendations: (id, params) => api.get(`/api/jobseeker/recommendations/${id}`, { params }),
  apply: (data) => api.post('/api/jobseeker/apply', data),
  getApplications: (id) => api.get(`/api/jobseeker/applications/${id}`),
}

// ───── EMPLOYER ─────
export const employerApi = {
  getProfile: (id) => api.get(`/api/employer/profile/${id}`),
  updateProfile: (id, data) => api.put(`/api/employer/profile/${id}`, data),
  postJob: (id, data) => api.post(`/api/employer/postjobs/${id}`, data),
  getMyJobs: (id) => api.get(`/api/employer/myjobs/${id}`),
  updateJob: (jobId, data) => api.put(`/api/employer/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/api/employer/jobs/${jobId}`),
  getApplicants: (jobId) => api.get(`/api/employer/jobs/${jobId}/applicants`),
  updateAppStatus: (appId, status) => api.put(
    `/api/employer/applications/${appId}/status`,
    JSON.stringify(status),
    { headers: { 'Content-Type': 'application/json' } }
  ),
}

// ───── ADMIN ─────
export const adminApi = {
  // Stats
  getStats: () => api.get('/api/admin/stats'),

  // Users
  getUsers: () => api.get('/api/admin/users'),
  getJobSeekers: () => api.get('/api/admin/users/jobseekers'),
  getEmployers: () => api.get('/api/admin/users/employers'),
  getUserDetail: (id) => api.get(`/api/admin/users/${id}`),
  toggleUser: (id) => api.put(`/api/admin/users/${id}/toggle`),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),

  // Jobs
  getJobs: (params) => api.get('/api/admin/jobs', { params }),
  getJobDetail: (id) => api.get(`/api/admin/jobs/${id}`),
  approveJob: (id) => api.put(`/api/admin/jobs/${id}/approve`),
  rejectJob: (id) => api.put(`/api/admin/jobs/${id}/reject`),
  deleteJob: (id) => api.delete(`/api/admin/jobs/${id}`),

  // Applications
  getApplications: () => api.get('/api/admin/applications'),
}

export default api