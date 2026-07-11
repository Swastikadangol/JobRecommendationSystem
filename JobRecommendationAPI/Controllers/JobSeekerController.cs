using JobRecommendationAPI.DTOs.Profile.JobSeeker;
using JobRecommendationAPI.DTOs.Profile.JobSeeker.Experience;
using JobRecommendationAPI.Enums;
using JobRecommendationAPI.Models;
using JobRecommendationAPI.Repositories.Interfaces;
using JobRecommendationAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExperienceDto = JobRecommendationAPI.DTOs.Application.ExperienceDto;

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
    profile.Phone,
    profile.Skills,
    profile.EducationLevel,
    profile.PreferredJobType,
    profile.PreferredWorkMode
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
        public async Task<IActionResult> GetRecommendations(
     int id,
     [FromQuery] JobType? jobType = null,
     [FromQuery] WorkMode? workMode = null)
        {
            // 1. Get job seeker profile
            var profile = await _jsRepo.GetByIdAsync(id);

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            // 2. Get approved jobs (pre-filtered from DB)
            var approvedJobs = await _jobRepo.GetAllApprovedAsync(jobType, workMode);
            var experienceYears = CalculateTotalExperienceYears(profile.Experiences);
            var education = profile.EducationLevel ?? EducationLevel.HighSchool;
            var results = _recommender.GetRecommendations(
                profile.Skills,
                experienceYears,
                education,
                 profile.PreferredJobType ?? JobType.FullTime,
                profile.PreferredWorkMode ?? WorkMode.OnSite,

                approvedJobs,
                //for filter
                jobType,
                workMode
            );

            // 4. Shape response
            var response = results.Select(r => new
            {
                r.Job.JobId,
                r.Job.JobTitle,
                r.Job.JobType,
                r.Job.WorkMode,
                r.Job.Location,
                r.Job.SalaryRange,
                r.Job.RequiredSkills,
                r.Job.Deadline,
                CompanyName = r.Job.Employer?.CompanyName,

                MatchScore = r.Score,

                MatchedSkills = r.MatchedSkills,
                MissingSkills = r.MissingSkills,
                Reason = r.Reason
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

            var approvedJobs = await _jobRepo.GetAllApprovedAsync();

            var matchScore = _recommender.CalculateMatchScore(
                profile.Skills,
                job.RequiredSkills,
                approvedJobs
            );
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
        [HttpGet("jobs/{id}")]
        public async Task<IActionResult> GetApprovedJobs(
            int id,
            [FromQuery] JobType? jobType = null,
            [FromQuery] WorkMode? workMode = null)
        {
            var profile = await _jsRepo.GetByIdAsync(id);

            if (profile == null)
                return NotFound();

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
                CompanyName = j.Employer != null ? j.Employer.CompanyName : "",
                MatchScore = _recommender.CalculateMatchScore(profile.Skills, j.RequiredSkills,jobs)
            });

            return Ok(response);
        }
        private int CalculateTotalExperienceYears(ICollection<Experience> experiences)
        {
            if (experiences == null || !experiences.Any())
                return 0;

            double totalMonths = 0;

            foreach (var exp in experiences)
            {
                var endDate = exp.EndDate ?? DateTime.Now;

                var months = ((endDate.Year - exp.StartDate.Year) * 12)
                             + (endDate.Month - exp.StartDate.Month);

                totalMonths += months;
            }

            return (int)(totalMonths / 12);
        }

    }
}