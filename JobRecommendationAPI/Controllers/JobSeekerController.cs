using JobRecommendationAPI.DTOs.Application;
using JobRecommendationAPI.DTOs.Profile.Employer.Experience;
using JobRecommendationAPI.DTOs.Profile.JobSeeker;
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
    [Authorize(Roles = "JobSeeker")]
    public class JobSeekerController : ControllerBase
    {
        private readonly IJobSeekerRepository _jsRepo;
        private readonly IJobRepository _jobRepo;
        private readonly IApplicationRepository _appRepo;
        private readonly RecommendationService _recommender;

        public JobSeekerController(
            IJobSeekerRepository jsRepo,
            IJobRepository jobRepo,
            IApplicationRepository appRepo,
            RecommendationService recommender)
        {
            _jsRepo = jsRepo;
            _jobRepo = jobRepo;
            _appRepo = appRepo;
            _recommender = recommender;
        }

        // ==================== PROFILE CRUD ====================

        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var profile = await _jsRepo.GetByIdAsync(id);
            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            return Ok(new
            {
                profile.JobSeekerId,
                profile.FullName,
                profile.Skills,
                profile.EducationLevel
            });
        }

        [HttpPut("profile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateJobSeekerDto dto)
        {
            var profile = await _jsRepo.GetByIdAsync(id);
            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            profile.FullName = dto.FullName;
            profile.Phone = dto.Phone;
            profile.Skills = dto.Skills;
            profile.EducationLevel = dto.EducationLevel;
            profile.PreferredJobType = dto.PreferredJobType;
            profile.PreferredWorkMode = dto.PreferredWorkMode;

            await _jsRepo.UpdateAsync(profile);
            return Ok(new { message = "Profile updated successfully",
                profile = new
                {
                    profile.JobSeekerId,
                    profile.FullName,
                    profile.Phone,
                    profile.Skills,
                    profile.EducationLevel,
                    profile.PreferredJobType,
                    profile.PreferredWorkMode
                }
            });
        }

        // ==================== EXPERIENCE CRUD ====================

        [HttpPost("profile/{id}/experience")]
        public async Task<IActionResult> AddExperience(int id, [FromBody] ExperienceDto dto)
        {
            var profile = await _jsRepo.GetByIdAsync(id);
            if (profile == null)
                return NotFound(new { message = "Job seeker not found" });

            var experience = new Experience
            {
                JobSeekerId = id,
                JobTitle = dto.JobTitle,
                CompanyName = dto.CompanyName,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Description = dto.Description
            };

            var result = await _jsRepo.AddExperienceAsync(id, experience);
            return Ok(new
            {
                message = "Experience added successfully",
                experience = new
                {
                    result.ExperienceId,
                    result.JobTitle,
                    result.CompanyName,
                    result.StartDate,
                    result.EndDate,
                    result.Description
                }
            });
        }

        [HttpGet("profile/{id}/experiences")]
        public async Task<IActionResult> GetExperiences(int id)
        {
            var experiences = await _jsRepo.GetExperiencesByJobSeekerIdAsync(id);

            var response = experiences.Select(e => new ExperienceResponseDto
            {
                ExperienceId = e.ExperienceId,
                JobTitle = e.JobTitle,
                CompanyName = e.CompanyName,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Description = e.Description
            });

            return Ok(response);
        }

        [HttpGet("experience/{experienceId}")]
        public async Task<IActionResult> GetExperienceById(int experienceId)
        {
            var experience = await _jsRepo.GetExperienceByIdAsync(experienceId);
            if (experience == null)
                return NotFound(new { message = "Experience not found" });

            return Ok(new ExperienceResponseDto
            {
                ExperienceId = experience.ExperienceId,
                JobTitle = experience.JobTitle,
                CompanyName = experience.CompanyName,
                StartDate = experience.StartDate,
                EndDate = experience.EndDate,
                Description = experience.Description
            });
        }

        [HttpPut("experience/{experienceId}")]
        public async Task<IActionResult> UpdateExperience(int experienceId, [FromBody] ExperienceDto dto)
        {
            var experience = await _jsRepo.GetExperienceByIdAsync(experienceId);
            if (experience == null)
                return NotFound(new { message = "Experience not found" });

            experience.JobTitle = dto.JobTitle;
            experience.CompanyName = dto.CompanyName;
            experience.StartDate = dto.StartDate;
            experience.EndDate = dto.EndDate;
            experience.Description = dto.Description;

            var result = await _jsRepo.UpdateExperienceAsync(experience);

            return Ok(new
            {
                message = "Experience updated successfully",
                experience = new ExperienceResponseDto
                {
                    ExperienceId = result.ExperienceId,
                    JobTitle = result.JobTitle,
                    CompanyName = result.CompanyName,
                    StartDate = result.StartDate,
                    EndDate = result.EndDate,
                    Description = result.Description
                }
            });
        }

        [HttpDelete("experience/{experienceId}")]
        public async Task<IActionResult> DeleteExperience(int experienceId)
        {
            var deleted = await _jsRepo.DeleteExperienceAsync(experienceId);
            if (!deleted)
                return NotFound(new { message = "Experience not found" });

            return Ok(new { message = "Experience deleted successfully" });
        }

        // ==================== JOB RECOMMENDATIONS ====================

        [HttpGet("recommendations/{id}")]
        public async Task<IActionResult> GetRecommendations(int id,
            [FromQuery] JobType? jobType = null,
            [FromQuery] WorkMode? workMode = null)
        {
            var profile = await _jsRepo.GetByIdAsync(id);
            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            var approvedJobs = await _jobRepo.GetAllApprovedAsync(jobType, workMode);
            var results = _recommender.GetRecommendations(profile.Skills, approvedJobs, jobType, workMode);

            var response = results.Select(r => new
            {
                r.job.JobId,
                r.job.JobTitle,
                r.job.JobType,
                r.job.WorkMode,
                r.job.Location,
                r.job.SalaryRange,
                r.job.RequiredSkills,
                r.job.Deadline,
                CompanyName = r.job.Employer?.CompanyName,
                MatchScore = r.score
            });

            return Ok(response);
        }

        // ==================== JOB APPLICATIONS ====================
        // ONCE APPLIED - NO WITHDRAW, NO DELETE, NO CHANGES!

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyToJob([FromBody] ApplyDto dto)
        {
            var profile = await _jsRepo.GetByIdAsync(dto.JobSeekerId);
            if (profile == null)
                return NotFound(new { message = "Job seeker not found" });

            var job = await _jobRepo.GetByIdAsync(dto.JobId);
            if (job == null || job.Status != JobStatus.Approved || !job.IsActive)
                return NotFound(new { message = "Job not found or not available" });

            var alreadyApplied = await _appRepo.AlreadyAppliedAsync(dto.JobSeekerId, dto.JobId);
            if (alreadyApplied)
                return BadRequest(new { message = "You have already applied for this job" });

            var matchScore = _recommender.CalculateMatchScore(profile.Skills, job.RequiredSkills);

            var application = new Application
            {
                JobId = dto.JobId,
                JobSeekerId = dto.JobSeekerId,
                MatchScore = matchScore,
                ApplicationStatus = ApplicationStatus.Applied,
                AppliedAt = DateTime.UtcNow
            };

            await _appRepo.CreateAsync(application);

            return Ok(new
            {
                message = "Application submitted successfully!",
                matchScore = matchScore
            });
        }
        [HttpGet("applications/{id}")]
        public async Task<IActionResult> GetApplications(int id)
        {
            var applications = await _appRepo.GetByJobSeekerAsync(id);

            var response = applications.Select(a => new
            {
                a.ApplicationId,
                a.JobId,
                JobTitle = a.Job?.JobTitle ?? "",
                CompanyName = a.Job?.Employer?.CompanyName ?? "",
                a.ApplicationStatus,
                a.AppliedAt,
                MatchScore = a.MatchScore
            });

            return Ok(new
            {
                message = "Applications cannot be withdrawn or deleted once submitted",
                data = response
            });
        }

        [HttpGet("jobs")]
        public async Task<IActionResult> GetApprovedJobs(
    [FromQuery] JobType? jobType = null,
    [FromQuery] WorkMode? workMode = null)
        {
            var jobs = await _jobRepo.GetAllApprovedAsync(jobType, workMode);

            var response = jobs.Select(j => new
            {
                j.JobId,
                j.JobTitle,
                j.JobDescription,
                j.JobType,
                j.WorkMode,
                j.Location,
                j.SalaryRange,
                j.RequiredSkills,
                j.Deadline,
                j.MinimumEducationLevel,
                j.MinYearsExperience,
                CompanyName = j.Employer != null ? j.Employer.CompanyName : ""
            });

            return Ok(response);
        }

    }
}