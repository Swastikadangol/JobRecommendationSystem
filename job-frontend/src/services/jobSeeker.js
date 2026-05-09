import req from "./api"

// GET  /api/jobseeker/profile/{id}
export const getJSProfile = (id) => req('GET', `/jobseeker/profile/${id}`)
 
// PUT  /api/jobseeker/profile/{id}   body: { fullName, phone, skills, educationLevel, preferredJobType, preferredWorkMode }
export const updateJSProfile = (id, data) => req('PUT', `/jobseeker/profile/${id}`, data)
 
// GET  /api/jobseeker/profile/{id}/experiences
export const getExperiences = (id) => req('GET', `/jobseeker/profile/${id}/experiences`)
 
// GET  /api/jobseeker/experience/{experienceId}
export const getExperienceById = (expId) => req('GET', `/jobseeker/experience/${expId}`)
 
// POST /api/jobseeker/profile/{id}/experience   body: { jobTitle, companyName, startDate, endDate, description }
export const addExperience = (id, data) => req('POST', `/jobseeker/profile/${id}/experience`, data)
 
// PUT  /api/jobseeker/experience/{experienceId}  body: { jobTitle, companyName, startDate, endDate, description }
export const updateExperience = (expId, data) => req('PUT', `/jobseeker/experience/${expId}`, data)
 
// DELETE /api/jobseeker/experience/{experienceId}
export const deleteExperience = (expId) => req('DELETE', `/jobseeker/experience/${expId}`)
 
// GET  /api/jobseeker/recommendations/{id}?jobType=&workMode=
export const getRecommendations = (id, params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''))
  ).toString()
  return req('GET', `/jobseeker/recommendations/${id}${qs ? '?' + qs : ''}`)
}
 
// POST /api/jobseeker/apply     body: { jobSeekerId, jobId }
export const applyToJob = (data) => req('POST', '/jobseeker/apply', data)
 
// GET  /api/jobseeker/applications/{id}
export const getMyApplications = (id) => req('GET', `/jobseeker/applications/${id}`)

// GET /api/jobseeker/jobs?jobType=&workMode=
export const getApprovedJobs = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''))
  ).toString()
  return req('GET', `/jobseeker/jobs${qs ? '?' + qs : ''}`)
}