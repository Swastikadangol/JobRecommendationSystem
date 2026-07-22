using JobRecommendationAPI.DTOs.Profile.JobSeeker;
using JobRecommendationAPI.DTOs.Profile.JobSeeker.Experience;
using JobRecommendationAPI.Enums;
using JobRecommendationAPI.Models;
using JobRecommendationAPI.Repositories.Interfaces;
using JobRecommendationAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using ExperienceDto = JobRecommendationAPI.DTOs.Application.ExperienceDto;
using EducationDto = JobRecommendationAPI.DTOs.Application.EducationDto;
using JobRecommendationAPI.DTOs.Profile.JobSeeker.Education;

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
        private readonly IWebHostEnvironment _env;

        public JobSeekerController(
            IJobSeekerRepository jsRepo,
            IJobRepository jobRepo,
            IApplicationRepository appRepo,
            RecommendationService recommender, IWebHostEnvironment env)
        {
            _jsRepo = jsRepo;
            _jobRepo = jobRepo;
            _appRepo = appRepo;
            _recommender = recommender;
            _env = env;
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

                Resume = string.IsNullOrEmpty(profile.Resume)
                    ? null
                    : $"{Request.Scheme}://{Request.Host}/{profile.Resume}",

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

        [HttpPost("profile/{id}/upload-resume")]
        public async Task<IActionResult> UploadResume(int id, IFormFile resume)
        {
            // Get logged-in user id from JWT
            var userId = int.Parse(User.FindFirst("userId")!.Value);

            // Get the logged-in user's profile
            var loggedInProfile = await _jsRepo.GetByUserIdAsync(userId);

            if (loggedInProfile == null)
                return Unauthorized();

            // Make sure the user is uploading only to their own profile
            if (loggedInProfile.JobSeekerId != id)
            {
                return Forbid();
            }

            // Check if job seeker exists
            var profile = await _jsRepo.GetByIdAsync(id);

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            // If the user already has a resume, delete the old file
            if (!string.IsNullOrWhiteSpace(profile.Resume))
            {
                var oldFilePath = Path.Combine(
    _env.WebRootPath,
    profile.Resume.Replace("/", Path.DirectorySeparatorChar.ToString())
);

                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            // Check if file selected
            if (resume == null || resume.Length == 0)
                return BadRequest(new { message = "Please select a resume." });

            var allowedContentTypes = new[]
{
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

            if (!allowedContentTypes.Contains(resume.ContentType))
            {
                return BadRequest(new
                {
                    message = "Invalid file type."
                });
            }

            // Allow only PDF, DOC and DOCX
            var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
            var extension = Path.GetExtension(resume.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                return BadRequest(new
                {
                    message = "Only PDF, DOC and DOCX files are allowed."
                });

            // Maximum allowed file size (5 MB)
            const long maxFileSize = 5 * 1024 * 1024;

            if (resume.Length > maxFileSize)
            {
                return BadRequest(new
                {
                    message = "Maximum file size is 5 MB."
                });
            }

            // Folder path
            var folderPath = Path.Combine(
    _env.WebRootPath,
    "uploads",
    "resumes");

            // Create folder if it doesn't exist
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // Unique file name
            var fileName = $"{Guid.NewGuid()}{extension}";

            var filePath = Path.Combine(folderPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await resume.CopyToAsync(stream);
            }

            // Relative path saved in database
            var resumePath = $"uploads/resumes/{fileName}";
            var resumeUrl = $"{Request.Scheme}://{Request.Host}/{resumePath}";

            // Save path
            await _jsRepo.UploadResumeAsync(id, resumePath);

            return Ok(new
            {
                message = "Resume uploaded successfully.",
                resume = resumeUrl
            });
        }

        [HttpDelete("profile/{id}/delete-resume")]
        public async Task<IActionResult> DeleteResume(int id)
        {
            var profile = await _jsRepo.GetByIdAsync(id);

            if (profile == null)
                return NotFound(new { message = "Profile not found." });

            if (string.IsNullOrWhiteSpace(profile.Resume))
                return BadRequest(new { message = "No resume uploaded." });

            // Physical file path
            var fullPath = Path.Combine(
       _env.WebRootPath,
       profile.Resume);

            // Delete file if it exists
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }

            // Remove path from database
            await _jsRepo.DeleteResumeAsync(id);

            return Ok(new
            {
                message = "Resume deleted successfully."
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

        // ==================== EDUCATION CRUD ====================

        [HttpPost("profile/{id}/education")]
        public async Task<IActionResult> AddEducation(int id, [FromBody] EducationDto dto)
        {
            var profile = await _jsRepo.GetByIdAsync(id);
            if (profile == null)
                return NotFound(new { message = "Job seeker not found" });

            var education = new Education
            {
                JobSeekerId = id,
                InstitutionName = dto.InstitutionName,
                FieldOfStudy = dto.FieldOfStudy,
                Level = dto.Level,
                GraduationYear = dto.GraduationYear
            };

            var result = await _jsRepo.AddEducationAsync(id, education);

            // Keep JobSeeker.EducationLevel synced to the HIGHEST level across all entries
            await SyncHighestEducationLevel(id);

            return Ok(new
            {
                message = "Education added successfully",
                education = new
                {
                    result.EducationId,
                    result.InstitutionName,
                    result.FieldOfStudy,
                    result.Level,
                    result.GraduationYear
                }
            });
        }

        [HttpGet("profile/{id}/educations")]
        public async Task<IActionResult> GetEducations(int id)
        {
            var educations = await _jsRepo.GetEducationsByJobSeekerIdAsync(id);

            var response = educations.Select(e => new EducationResponseDto
            {
                EducationId = e.EducationId,
                InstitutionName = e.InstitutionName,
                FieldOfStudy = e.FieldOfStudy,
                Level = e.Level,
                GraduationYear = e.GraduationYear
            });

            return Ok(response);
        }

        [HttpGet("education/{educationId}")]
        public async Task<IActionResult> GetEducationById(int educationId)
        {
            var education = await _jsRepo.GetEducationByIdAsync(educationId);
            if (education == null)
                return NotFound(new { message = "Education not found" });

            return Ok(new EducationResponseDto
            {
                EducationId = education.EducationId,
                InstitutionName = education.InstitutionName,
                FieldOfStudy = education.FieldOfStudy,
                Level = education.Level,
                GraduationYear = education.GraduationYear
            });
        }

        [HttpPut("education/{educationId}")]
        public async Task<IActionResult> UpdateEducation(int educationId, [FromBody] EducationDto dto)
        {
            var education = await _jsRepo.GetEducationByIdAsync(educationId);
            if (education == null)
                return NotFound(new { message = "Education not found" });

            education.InstitutionName = dto.InstitutionName;
            education.FieldOfStudy = dto.FieldOfStudy;
            education.Level = dto.Level;
            education.GraduationYear = dto.GraduationYear;

            var result = await _jsRepo.UpdateEducationAsync(education);

            // Keep JobSeeker.EducationLevel synced to the HIGHEST level across all entries
            await SyncHighestEducationLevel(education.JobSeekerId);

            return Ok(new
            {
                message = "Education updated successfully",
                education = new EducationResponseDto
                {
                    EducationId = result.EducationId,
                    InstitutionName = result.InstitutionName,
                    FieldOfStudy = result.FieldOfStudy,
                    Level = result.Level,
                    GraduationYear = result.GraduationYear
                }
            });
        }

        [HttpDelete("education/{educationId}")]
        public async Task<IActionResult> DeleteEducation(int educationId)
        {
            var education = await _jsRepo.GetEducationByIdAsync(educationId);
            if (education == null)
                return NotFound(new { message = "Education not found" });

            var jobSeekerId = education.JobSeekerId;

            var deleted = await _jsRepo.DeleteEducationAsync(educationId);
            if (!deleted)
                return NotFound(new { message = "Education not found" });

            // Recalculate highest remaining level (or clear if none left)
            await SyncHighestEducationLevel(jobSeekerId);

            return Ok(new { message = "Education deleted successfully" });
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

            //Console.WriteLine($"Profile Skills: {profile.Skills}");
            //Console.WriteLine($"Job Skills: {job.RequiredSkills}");
            //Console.WriteLine($"Approved Jobs Count: {approvedJobs.Count()}");
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

        [HttpGet("profile/{id}/generate-cv")]
        public async Task<IActionResult> GenerateCv(int id)
        {
            var profile = await _jsRepo.GetByIdAsync(id);
            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            var pdfBytes = CvPdfBuilder.Build(profile);
            var fileName = $"{(profile.FullName ?? "resume").Replace(" ", "_")}_CV.pdf";

            return File(pdfBytes, "application/pdf", fileName);
        }

        private async Task SyncHighestEducationLevel(int jobSeekerId)
        {
            var educations = await _jsRepo.GetEducationsByJobSeekerIdAsync(jobSeekerId);
            var profile = await _jsRepo.GetByIdAsync(jobSeekerId);
            if (profile == null) return;

            profile.EducationLevel = educations.Any()
                ? educations.Max(e => e.Level)
                : null;

            await _jsRepo.UpdateAsync(profile);
        }

    }
}