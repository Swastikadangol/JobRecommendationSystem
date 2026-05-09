import req from "./api"

// GET  /api/employer/profile/{id}
export const getEmpProfile = (id) => req('GET', `/employer/profile/${id}`)
 
// PUT  /api/employer/profile/{id}   body: { companyName, contactNumber }
export const updateEmpProfile = (id, data) => req('PUT', `/employer/profile/${id}`, data)
 
// POST /api/employer/postjobs/{id}  body: { jobTitle, jobDescription, jobType, workMode, requiredSkills, location, salaryRange, deadline, minimumEducationLevel, minYearsExperience }
export const postJob = (id, data) => req('POST', `/employer/postjobs/${id}`, data)
 
// GET  /api/employer/myjobs/{id}
export const getMyJobs = (id) => req('GET', `/employer/myjobs/${id}`)
 
// PUT  /api/employer/jobs/{jobId}   body: same as postJob
export const updateJob = (jobId, data) => req('PUT', `/employer/jobs/${jobId}`, data)
 
// DELETE /api/employer/jobs/{jobId}
export const deleteJob = (jobId) => req('DELETE', `/employer/jobs/${jobId}`)
 
// GET  /api/employer/jobs/{jobId}/applicants
export const getApplicants = (jobId) => req('GET', `/employer/jobs/${jobId}/applicants`)
 
// PUT  /api/employer/applications/{applicationId}/status   body: "Shortlisted" (string directly)
export const updateAppStatus = (appId, status) =>
  req("PUT", `/employer/applications/${appId}/status`, {
    status,
  })