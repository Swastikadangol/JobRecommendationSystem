using JobRecommendationAPI.DTOs.Application;
using JobRecommendationAPI.DTOs.Job;
using JobRecommendationAPI.DTOs.Profile;
using JobRecommendationAPI.DTOs.Profile.Employer;
using JobRecommendationAPI.Enums;
using JobRecommendationAPI.Models;
using JobRecommendationAPI.Repositories.Interfaces;
using JobRecommendationAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobRecommendationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Employer")]
    public class EmployerController : ControllerBase
    {
        private readonly IEmployerRepository _empRepo;
        private readonly IJobRepository _jobRepo;
        private readonly IApplicationRepository _appRepo;
        private readonly RecommendationService _recommender;

        public EmployerController(
            IEmployerRepository empRepo,
            IJobRepository jobRepo,
            IApplicationRepository appRepo,
            RecommendationService recommender)
        {
            _empRepo = empRepo;
            _jobRepo = jobRepo;
            _appRepo = appRepo;
            _recommender = recommender;
        }

        // ── GET api/employer/profile/{id} ──────────────────────────
        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var emp = await _empRepo.GetByIdAsync(id);
            if (emp == null) return NotFound("Employer not found.");

            return Ok(new EmployerProfileResponseDto
            {
                EmployerId = emp.EmployerId,
                UserId = emp.UserId,
                CompanyName = emp.CompanyName,
                ContactNumber = emp.CompanyNumber,
                Email = emp.User?.Email,
                Website = emp.Website,
                About = emp.About,
                Industry = emp.Industry,
                CompanySize = emp.CompanySize,
                City = emp.City,
                Province = emp.Province,
                PostalCode = emp.PostalCode,
                Address = emp.Address,
                LinkedIn = emp.LinkedIn,
                Facebook = emp.Facebook,
                Twitter = emp.Twitter,
                Instagram = emp.Instagram,
                ProfileCreatedAt = emp.ProfileCreatedAt
            });
        }

        // ── PUT api/employer/profile/{id} ──────────────────────────
        [HttpPut("profile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, UpdateEmployerDto dto)
        {
            var emp = await _empRepo.GetByIdAsync(id);
            if (emp == null) return NotFound("Employer not found.");

            emp.CompanyName = dto.CompanyName;
            emp.CompanyNumber = dto.ContactNumber;
            emp.Website = dto.Website;
            emp.About = dto.About;
            emp.Industry = dto.Industry;
            emp.CompanySize = dto.CompanySize;
            emp.City = dto.City;
            emp.Province = dto.Province;
            emp.PostalCode = dto.PostalCode;
            emp.Address = dto.Address;
            emp.LinkedIn = dto.LinkedIn;
            emp.Facebook = dto.Facebook;
            emp.Twitter = dto.Twitter;
            emp.Instagram = dto.Instagram;

            await _empRepo.UpdateAsync(emp);

            return Ok(new EmployerProfileResponseDto
            {
                EmployerId = emp.EmployerId,
                CompanyName = emp.CompanyName,
                ContactNumber = emp.CompanyNumber,
                Email = emp.User?.Email,
                Website = emp.Website,
                About = emp.About,
                Industry = emp.Industry,
                CompanySize = emp.CompanySize,
                City = emp.City,
                Province = emp.Province,
                PostalCode = emp.PostalCode,
                Address = emp.Address,
                LinkedIn = emp.LinkedIn,
                Facebook = emp.Facebook,
                Twitter = emp.Twitter,
                Instagram = emp.Instagram,
            });
        }

        // ── Job Management ───────────────────────────────────────

        // POST api/employer/{id}/jobs
        [HttpPost("postjobs/{id}")]
        public async Task<IActionResult> PostJob(int id, JobDto dto)
        {
            var emp = await _empRepo.GetByIdAsync(id);
            if (emp == null) return NotFound("Employer not found.");

            var job = new Job
            {
                EmployerId = id,
                JobTitle = dto.JobTitle,
                JobDescription = dto.JobDescription,
                JobType = dto.JobType,
                WorkMode = dto.WorkMode,
                RequiredSkills = dto.RequiredSkills,
                Location = dto.Location,
                SalaryRange = dto.SalaryRange,
                Deadline = dto.Deadline,
                Status = JobStatus.Pending,
                MinimumEducationLevel = dto.MinimumEducationLevel,
                MinYearsExperience = dto.MinYearsExperience
            };

            await _jobRepo.CreateAsync(job);
            return Ok(new { message = "Job posted. Waiting for admin approval.", job.JobId });
        }

        // GET api/employer/{id}/jobs
        [HttpGet("myjobs/{id}")]
        public async Task<IActionResult> GetMyJobs(int id)
        {
            var jobs = await _jobRepo.GetByEmployerAsync(id);
            var emp = await _empRepo.GetByIdAsync(id);

            var response = jobs.Select(j => new JobResponseDto
            {
                JobId = j.JobId,
                EmployerId = j.EmployerId,
                CompanyName = emp?.CompanyName ?? "",
                JobTitle = j.JobTitle,
                JobDescription = j.JobDescription,
                JobType = j.JobType,
                WorkMode = j.WorkMode,
                RequiredSkills = j.RequiredSkills,
                Location = j.Location,
                SalaryRange = j.SalaryRange,
                Deadline = j.Deadline,
                IsActive = j.IsActive,
                Status = j.Status,
                PostedAt = j.PostedAt,
                MinimumEducationLevel = j.MinimumEducationLevel,
                MinYearsExperience = j.MinYearsExperience
            });

            return Ok(response);
        }

        // PUT api/employer/jobs/{jobId}
        [HttpPut("jobs/{jobId}")]
        public async Task<IActionResult> UpdateJob(int jobId, JobDto dto)
        {
            var job = await _jobRepo.GetByIdAsync(jobId);
            if (job == null) return NotFound("Job not found.");

            job.JobTitle = dto.JobTitle;
            job.JobDescription = dto.JobDescription;
            job.JobType = dto.JobType;
            job.WorkMode = dto.WorkMode;
            job.RequiredSkills = dto.RequiredSkills;
            job.Location = dto.Location;
            job.SalaryRange = dto.SalaryRange;
            job.Deadline = dto.Deadline;
            job.MinimumEducationLevel = dto.MinimumEducationLevel;
            job.MinYearsExperience = dto.MinYearsExperience;
            job.Status = JobStatus.Pending; // re-submit for approval after edit

            await _jobRepo.UpdateAsync(job);
            return Ok("Job updated. Waiting for admin re-approval.");
        }

        // DELETE api/employer/jobs/{jobId}
        [HttpDelete("jobs/{jobId}")]
        public async Task<IActionResult> DeleteJob(int jobId)
        {
            var deleted = await _jobRepo.DeleteAsync(jobId);
            if (!deleted) return NotFound("Job not found.");
            return Ok("Job removed.");
        }

        // GET api/employer/jobs/{jobId}/applicants
        [HttpGet("jobs/{jobId}/applicants")]
        public async Task<IActionResult> GetApplicants(int jobId)
        {
            var apps = await _appRepo.GetByJobAsync(jobId);
            var approvedJobs = await _jobRepo.GetAllApprovedAsync();
            var response = apps.Select(a => new ApplicationResponseDto
            {
                ApplicationId = a.ApplicationId,
                JobId = a.JobId,
                JobTitle = a.Job?.JobTitle ?? "",
                CompanyName = a.Job?.Employer?.CompanyName ?? "",

                JobSeekerId = a.JobSeekerId,
                ApplicantName = a.JobSeeker?.FullName ?? "",
                ApplicantEmail = a.JobSeeker?.User?.Email ?? "",
                ApplicantSkills = a.JobSeeker?.Skills,
                ApplicantPhone = a.JobSeeker?.Phone,
                ApplicantEducation = a.JobSeeker?.EducationLevel?.ToString(),

                ApplicationStatus = a.ApplicationStatus,

                MatchScore = _recommender.CalculateMatchScore(
                    a.JobSeeker?.Skills,
                    a.Job?.RequiredSkills ?? "",
                    approvedJobs
                ),

                AppliedAt = a.AppliedAt,

                Experiences = (a.JobSeeker?.Experiences ?? new List<Experience>())
                    .OrderByDescending(e => e.StartDate)
                    .Select(e => new ExperienceDto
                    {
                        ExperienceId = e.ExperienceId,
                        JobTitle = e.JobTitle,
                        CompanyName = e.CompanyName,
                        StartDate = e.StartDate,
                        EndDate = e.EndDate,
                        Description = e.Description
                    })
                    .ToList()
            });

            return Ok(response);
        }

        // PUT api/employer/applications/{applicationId}/status
        [HttpPut("applications/{applicationId}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(
            int applicationId,
            [FromBody] ApplicationStatus status)
        {
            var updated = await _appRepo.UpdateStatusAsync(applicationId, status);
            if (!updated) return NotFound("Application not found.");
            return Ok($"Application status updated to {status}.");
        }
    }
}