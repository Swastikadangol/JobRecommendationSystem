// import axios from 'axios'

// const api = axios.create({ baseURL: '/api' })

// api.interceptors.request.use(cfg => {
//   const token = localStorage.getItem('token')
//   if (token) cfg.headers.Authorization = `Bearer ${token}`
//   return cfg
// })

// // ─── Auth ─────────────────────────────────────────────────
// // POST /api/auth/login     {Email, Password}
// // POST /api/auth/register  {Username, Email, Password, Role, FullName?, Phone?, CompanyName?, ContactNumber?}
// // Login response: {userId, profileId, userName, email, role, fullName?, companyName?, token}
// export const authAPI = {
//   login:    (b) => api.post('/auth/login', b),
//   register: (b) => api.post('/auth/register', b),
// }

// // ─── JobSeeker ────────────────────────────────────────────
// // GET  /api/jobseeker/jobs?jobType=&workMode=
// // GET  /api/jobseeker/recommendations/{profileId}?jobType=&workMode=
// // POST /api/jobseeker/apply  {JobId, JobSeekerId}
// // GET  /api/jobseeker/applications/{profileId}  → {message, data:[{applicationId,jobId,jobTitle,companyName,applicationStatus,appliedAt,matchScore}]}
// // GET  /api/jobseeker/profile/{id}              → {jobSeekerId,fullName,skills,educationLevel}
// // PUT  /api/jobseeker/profile/{id}              {FullName,Phone,Skills,EducationLevel,PreferredJobType,PreferredWorkMode}
// // GET  /api/jobseeker/profile/{id}/experiences  → ExperienceResponseDto[]
// // POST /api/jobseeker/profile/{id}/experience   {JobTitle,CompanyName,StartDate,EndDate?,Description?}
// // PUT  /api/jobseeker/experience/{expId}        {JobTitle,CompanyName,StartDate,EndDate?,Description?}
// // DELETE /api/jobseeker/experience/{expId}
// export const seekerAPI = {
//   getJobs:          (params)     => api.get('/jobseeker/jobs', { params }),
//   getRecommendations:(id, params) => api.get(`/jobseeker/recommendations/${id}`, { params }),
//   apply:            (body)       => api.post('/jobseeker/apply', body),
//   getApplications:  (id)         => api.get(`/jobseeker/applications/${id}`),
//   getProfile:       (id)         => api.get(`/jobseeker/profile/${id}`),
//   updateProfile:    (id, body)   => api.put(`/jobseeker/profile/${id}`, body),
//   getExperiences:   (id)         => api.get(`/jobseeker/profile/${id}/experiences`),
//   addExperience:    (id, body)   => api.post(`/jobseeker/profile/${id}/experience`, body),
//   updateExperience: (expId, body)=> api.put(`/jobseeker/experience/${expId}`, body),
//   deleteExperience: (expId)      => api.delete(`/jobseeker/experience/${expId}`),
// }

// // ─── Employer ─────────────────────────────────────────────
// // GET  /api/employer/profile/{id}              → {employerId,userId,companyName,companyNumber,email}
// // PUT  /api/employer/profile/{id}              {CompanyName, ContactNumber}
// // POST /api/employer/postjobs/{id}             JobDto
// // GET  /api/employer/myjobs/{id}               → JobResponseDto[]
// // PUT  /api/employer/jobs/{jobId}              JobDto
// // DELETE /api/employer/jobs/{jobId}
// // GET  /api/employer/jobs/{jobId}/applicants   → ApplicationResponseDto[]
// // PUT  /api/employer/applications/{appId}/status  "Reviewed"|"Shortlisted"|"Rejected"|"Accepted"
// export const employerAPI = {
//   getProfile:      (id)          => api.get(`/employer/profile/${id}`),
//   updateProfile:   (id, body)    => api.put(`/employer/profile/${id}`, body),
//   postJob:         (id, body)    => api.post(`/employer/postjobs/${id}`, body),
//   getMyJobs:       (id)          => api.get(`/employer/myjobs/${id}`),
//   updateJob:       (jobId, body) => api.put(`/employer/jobs/${jobId}`, body),
//   deleteJob:       (jobId)       => api.delete(`/employer/jobs/${jobId}`),
//   getApplicants:   (jobId)       => api.get(`/employer/jobs/${jobId}/applicants`),
//   updateAppStatus: (appId, status) => api.put(
//     `/employer/applications/${appId}/status`,
//     JSON.stringify(status),
//     { headers: { 'Content-Type': 'application/json' } }
//   ),
// }

// // ─── Admin ────────────────────────────────────────────────
// // GET  /api/admin/stats
// // GET  /api/admin/users
// // GET  /api/admin/users/jobseekers
// // GET  /api/admin/users/employers
// // PUT  /api/admin/users/{userId}/toggle
// // DELETE /api/admin/users/{userId}
// // GET  /api/admin/jobs?status=Pending|Approved|Rejected
// // PUT  /api/admin/jobs/{jobId}/approve
// // PUT  /api/admin/jobs/{jobId}/reject
// export const adminAPI = {
//   getStats:      ()       => api.get('/admin/stats'),
//   getUsers:      ()       => api.get('/admin/users'),
//   getJobSeekers: ()       => api.get('/admin/users/jobseekers'),
//   getEmployers:  ()       => api.get('/admin/users/employers'),
//   toggleUser:    (id)     => api.put(`/admin/users/${id}/toggle`),
//   deleteUser:    (id)     => api.delete(`/admin/users/${id}`),
//   getJobs:       (status) => api.get('/admin/jobs', { params: status ? { status } : {} }),
//   approveJob:    (id)     => api.put(`/admin/jobs/${id}/approve`),
//   rejectJob:     (id)     => api.put(`/admin/jobs/${id}/reject`),
// }

// export default api

import axios from 'axios'


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006'

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

// Handle 401 globally — but NOT for auth endpoints (login returns 401 on wrong password)
api.interceptors.response.use(
  res => res,
  err => {
    const isAuthEndpoint = err.config?.url?.includes('/api/auth/')
    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.clear()
      window.dispatchEvent(new Event('auth:logout'))
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ───── AUTH ─────
// POST /api/auth/login     {Email, Password}
// POST /api/auth/register  {Username, Email, Password, Role, FullName?, Phone?, CompanyName?, ContactNumber?}
// Login response: {userId, profileId, userName, email, role, fullName?, companyName?, token}

export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
}

// ───── JOB SEEKER ─────
// GET  /api/jobseeker/jobs?jobType=&workMode=
// GET  /api/jobseeker/recommendations/{profileId}?jobType=&workMode=
// POST /api/jobseeker/apply  {JobId, JobSeekerId}
// GET  /api/jobseeker/applications/{profileId}  → {message, data:[{applicationId,jobId,jobTitle,companyName,applicationStatus,appliedAt,matchScore}]}
// GET  /api/jobseeker/profile/{id}              → {jobSeekerId,fullName,skills,educationLevel}
// PUT  /api/jobseeker/profile/{id}              {FullName,Phone,Skills,EducationLevel,PreferredJobType,PreferredWorkMode}
// GET  /api/jobseeker/profile/{id}/experiences  → ExperienceResponseDto[]
// POST /api/jobseeker/profile/{id}/experience   {JobTitle,CompanyName,StartDate,EndDate?,Description?}
// PUT  /api/jobseeker/experience/{expId}        {JobTitle,CompanyName,StartDate,EndDate?,Description?}
// DELETE /api/jobseeker/experience/{expId}

export const jobSeekerApi = {
  // Profile
  getProfile: (id) => api.get(`/api/jobseeker/profile/${id}`),
  updateProfile: (id, data) => api.put(`/api/jobseeker/profile/${id}`, data),

  // Experience
  getExperiences: (id) => api.get(`/api/jobseeker/profile/${id}/experiences`),
  addExperience: (id, data) => api.post(`/api/jobseeker/profile/${id}/experience`, data),
  updateExperience: (expId, data) => api.put(`/api/jobseeker/experience/${expId}`, data),
  deleteExperience: (expId) => api.delete(`/api/jobseeker/experience/${expId}`),

  // Jobs
  getApprovedJobs: (params) => api.get('/api/jobseeker/jobs', { params }),

  // Recommendations
  getRecommendations: (id, params) => api.get(`/api/jobseeker/recommendations/${id}`, { params }),

  // Applications
  apply: (data) => api.post('/api/jobseeker/apply', data),
  getApplications: (id) => api.get(`/api/jobseeker/applications/${id}`),
}

export default api
// ───── EMPLOYER ─────
export const employerApi = {
  getProfile:      (id)            => api.get(`/api/employer/profile/${id}`),
  updateProfile:   (id, data)      => api.put(`/api/employer/profile/${id}`, data),
  postJob:         (id, data)      => api.post(`/api/employer/postjobs/${id}`, data),
  getMyJobs:       (id)            => api.get(`/api/employer/myjobs/${id}`),
  updateJob:       (jobId, data)   => api.put(`/api/employer/jobs/${jobId}`, data),
  deleteJob:       (jobId)         => api.delete(`/api/employer/jobs/${jobId}`),
  getApplicants:   (jobId)         => api.get(`/api/employer/jobs/${jobId}/applicants`),
  updateAppStatus: (appId, status) => api.put(
    `/api/employer/applications/${appId}/status`,
    JSON.stringify(status),
    { headers: { 'Content-Type': 'application/json' } }
  ),
}

// ───── ADMIN ─────
export const adminApi = {
  getStats:      ()       => api.get('/api/admin/stats'),
  getUsers:      ()       => api.get('/api/admin/users'),
  getJobSeekers: ()       => api.get('/api/admin/users/jobseekers'),
  getEmployers:  ()       => api.get('/api/admin/users/employers'),
  toggleUser:    (id)     => api.put(`/api/admin/users/${id}/toggle`),
  deleteUser:    (id)     => api.delete(`/api/admin/users/${id}`),
  getJobs:       (params) => api.get('/api/admin/jobs', { params }),
  approveJob:    (id)     => api.put(`/api/admin/jobs/${id}/approve`),
  rejectJob:     (id)     => api.put(`/api/admin/jobs/${id}/reject`),
}