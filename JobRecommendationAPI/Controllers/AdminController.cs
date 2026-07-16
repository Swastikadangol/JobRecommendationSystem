using JobRecommendationAPI.DTOs.Job;
using JobRecommendationAPI.Enums;
using JobRecommendationAPI.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobRecommendationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IJobRepository _jobRepo;
        private readonly IApplicationRepository _appRepo;
        private readonly IJobSeekerRepository _jobSeekerRepo;
        private readonly IEmployerRepository _empRepo;

        public AdminController(
            IUserRepository userRepo,
            IJobRepository jobRepo,
            IApplicationRepository appRepo,
            IJobSeekerRepository jobSeekerRepo,
            IEmployerRepository empRepo)
        {
            _userRepo      = userRepo;
            _jobRepo       = jobRepo;
            _appRepo       = appRepo;
            _jobSeekerRepo = jobSeekerRepo;
            _empRepo       = empRepo;
        }

        // ── Stats ─────────────────────────────────────────────────
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalJobSeekers   = await _userRepo.CountByRoleAsync(Role.JobSeeker);
            var totalEmployers    = await _userRepo.CountByRoleAsync(Role.Employer);
            var totalJobs         = await _jobRepo.CountAsync();
            var pendingJobs       = await _jobRepo.CountPendingAsync();
            var totalApplications = await _appRepo.CountAsync();

            // Job status breakdown for charts
            var allJobs  = await _jobRepo.GetAllAsync();
            var approved = allJobs.Count(j => j.Status == JobStatus.Approved);
            var rejected = allJobs.Count(j => j.Status == JobStatus.Rejected);

            // Applications by month (last 6 months)
            var allApps     = await _appRepo.GetAllAsync();
            var now         = DateTime.Now;
            var monthlyApps = Enumerable.Range(0, 6).Select(i =>
            {
                var month = now.AddMonths(-i);
                var count = allApps.Count(a =>
                    a.AppliedAt.Year  == month.Year &&
                    a.AppliedAt.Month == month.Month);
                return new
                {
                    month = month.ToString("MMM"),
                    year  = month.Year,
                    count
                };
            }).Reverse().ToList();

            // Application status breakdown
            var hiredCandidates        = allApps.Count(a => a.ApplicationStatus == ApplicationStatus.Accepted);
            var rejectedApplications   = allApps.Count(a => a.ApplicationStatus == ApplicationStatus.Rejected);
            var shortlistedCandidates  = allApps.Count(a => a.ApplicationStatus == ApplicationStatus.Shortlisted);
            var openJobs               = allJobs.Count(j => j.Status == JobStatus.Approved && (j.Deadline == null || j.Deadline >= DateTime.Now));
            var jobsFilled             = hiredCandidates; // jobs with at least one accepted = filled
            var avgApplicationsPerJob  = totalJobs > 0 ? Math.Round((double)totalApplications / totalJobs, 1) : 0;

            return Ok(new
            {
                totalJobSeekers,
                totalEmployers,
                totalJobs,
                pendingJobs,
                approvedJobs          = approved,
                rejectedJobs          = rejected,
                totalApplications,
                hiredCandidates,
                rejectedApplications,
                shortlistedCandidates,
                openJobs,
                jobsFilled,
                avgApplicationsPerJob,
                monthlyApplications   = monthlyApps
            });
        }

        // ── Users ─────────────────────────────────────────────────
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepo.GetAllAsync();
            var result = new List<object>();

            foreach (var u in users)
            {
                string? resume = null;
                if (u.Role == Role.JobSeeker)
                {
                    var profile = await _jobSeekerRepo.GetByUserIdAsync(u.UserId);
                    resume = profile?.Resume;
                }

                result.Add(new
                {
                    u.UserId,
                    u.UserName,
                    u.Email,
                    u.Role,
                    u.Status,
                    u.CreatedAt,
                    resume
                });
            }

            return Ok(result);
        }

        [HttpGet("users/jobseekers")]
        public async Task<IActionResult> GetJobSeekers()
        {
            var users = await _userRepo.GetByRoleAsync(Role.JobSeeker);
            var result = new List<object>();
            foreach (var u in users)
            {
                var profile = await _jobSeekerRepo.GetByUserIdAsync(u.UserId);
                result.Add(new
                {
                    u.UserId,
                    u.UserName,
                    u.Email,
                    role = "JobSeeker",
                    u.Status,
                    u.CreatedAt,
                    profileId    = profile?.JobSeekerId,
                    fullName     = profile?.FullName,
                    phone        = profile?.Phone,
                    resume = profile?.Resume,
                    skills       = profile?.Skills,
                    education    = profile?.EducationLevel,
                    totalApps    = profile?.Applications?.Count ?? 0
                });
            }
            return Ok(result);
        }

        [HttpGet("users/employers")]
        public async Task<IActionResult> GetEmployers()
        {
            var users = await _userRepo.GetByRoleAsync(Role.Employer);
            var result = new List<object>();
            foreach (var u in users)
            {
                var profile = await _empRepo.GetByUserIdAsync(u.UserId);
                result.Add(new
                {
                    u.UserId,
                    u.UserName,
                    u.Email,
                    role = "Employer",
                    u.Status,
                    u.CreatedAt,
                    profileId     = profile?.EmployerId,
                    companyName   = profile?.CompanyName,
                    contactNumber = profile?.CompanyNumber,
                    website       = profile?.Website,
                    industry      = profile?.Industry,
                    location      = profile?.City,
                    totalJobs     = profile?.Jobs?.Count ?? 0
                });
            }
            return Ok(result);
        }

        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUserDetail(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            if (user.Role == Role.JobSeeker)
            {
                var profile = await _jobSeekerRepo.GetByUserIdAsync(userId);
                var apps    = profile != null
                    ? await _appRepo.GetByJobSeekerAsync(profile.JobSeekerId)
                    : Enumerable.Empty<Application>();

                return Ok(new
                {
                    user.UserId, user.UserName, user.Email,
                    user.Role, user.Status, user.CreatedAt,
                    profile = profile == null ? null : new
                    {
                        profile.JobSeekerId,
                        profile.FullName,
                        profile.Phone,
                        resume = profile.Resume,
                        profile.Skills,
                        education         = profile.EducationLevel,
                        preferredJobType  = profile.PreferredJobType,
                        preferredWorkMode = profile.PreferredWorkMode,
                    },
                    applications = apps.Select(a => new
                    {
                        a.ApplicationId,
                        jobTitle    = a.Job?.JobTitle,
                        companyName = a.Job?.Employer?.CompanyName,
                        a.ApplicationStatus,
                        a.MatchScore,
                        a.AppliedAt
                    })
                });
            }
            else if (user.Role == Role.Employer)
            {
                var profile = await _empRepo.GetByUserIdAsync(userId);
                var jobs    = profile != null
                    ? await _jobRepo.GetByEmployerAsync(profile.EmployerId)
                    : Enumerable.Empty<Job>();

                return Ok(new
                {
                    user.UserId, user.UserName, user.Email,
                    user.Role, user.Status, user.CreatedAt,
                    profile = profile == null ? null : new
                    {
                        profile.EmployerId,
                        profile.CompanyName,
                        contactNumber = profile.CompanyNumber,
                        profile.Website,
                        profile.Industry,
                        profile.CompanySize,
                        city          = profile.City,
                        profile.Province,
                    },
                    jobs = jobs.Select(j => new
                    {
                        j.JobId, j.JobTitle, j.Status,
                        j.PostedAt, j.Deadline
                    })
                });
            }

            return Ok(new { user.UserId, user.UserName, user.Email, user.Role, user.Status });
        }

        [HttpPut("users/{userId}/toggle")]
        public async Task<IActionResult> ToggleUserStatus(int userId)
        {
            var toggled = await _userRepo.ToggleStatusAsync(userId);
            if (!toggled) return NotFound("User not found.");
            return Ok("User status toggled.");
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var deleted = await _userRepo.DeleteAsync(userId);
            if (!deleted) return NotFound("User not found.");
            return Ok("User deleted.");
        }

        // ── Jobs ─────────────────────────────────────────────────
        [HttpGet("jobs")]
        public async Task<IActionResult> GetAllJobs([FromQuery] JobStatus? status = null)
        {
            var jobs = await _jobRepo.GetAllAsync(status);
            var response = jobs.Select(j => new JobResponseDto
            {
                JobId          = j.JobId,
                EmployerId     = j.EmployerId,
                CompanyName    = j.Employer?.CompanyName ?? "",
                JobTitle       = j.JobTitle,
                JobDescription = j.JobDescription,
                JobType        = j.JobType,
                WorkMode       = j.WorkMode,
                RequiredSkills = j.RequiredSkills,
                Location       = j.Location,
                SalaryRange    = j.SalaryRange,
                Deadline       = j.Deadline,
                Status         = j.Status,
                PostedAt       = j.PostedAt,
                MinimumEducationLevel = j.MinimumEducationLevel,
                MinYearsExperience    = j.MinYearsExperience
            });
            return Ok(response);
        }

        [HttpGet("jobs/{jobId}")]
        public async Task<IActionResult> GetJobDetail(int jobId)
        {
            var job = await _jobRepo.GetByIdAsync(jobId);
            if (job == null) return NotFound("Job not found.");

            var apps = await _appRepo.GetByJobAsync(jobId);

            return Ok(new
            {
                job.JobId, job.JobTitle, job.JobDescription,
                job.JobType, job.WorkMode, job.RequiredSkills,
                job.Location, job.SalaryRange, job.Deadline,
                job.Status, job.PostedAt,
                job.MinimumEducationLevel, job.MinYearsExperience,
                companyName    = job.Employer?.CompanyName,
                employerEmail  = job.Employer?.User?.Email,
                totalApplicants = apps.Count(),
                avgMatchScore   = apps.Any()
                    ? Math.Round(apps.Average(a => a.MatchScore), 1)
                    : 0
            });
        }

        [HttpPut("jobs/{jobId}/approve")]
        public async Task<IActionResult> ApproveJob(int jobId)
        {
            var done = await _jobRepo.ApproveAsync(jobId);
            if (!done) return NotFound("Job not found.");
            return Ok("Job approved.");
        }

        [HttpPut("jobs/{jobId}/reject")]
        public async Task<IActionResult> RejectJob(int jobId)
        {
            var done = await _jobRepo.RejectAsync(jobId);
            if (!done) return NotFound("Job not found.");
            return Ok("Job rejected.");
        }

        [HttpDelete("jobs/{jobId}")]
        public async Task<IActionResult> DeleteJob(int jobId)
        {
            var deleted = await _jobRepo.DeleteAsync(jobId);
            if (!deleted) return NotFound("Job not found.");
            return Ok("Job deleted.");
        }

        // ── Applications ──────────────────────────────────────────
        [HttpGet("applications")]
        public async Task<IActionResult> GetAllApplications()
        {
            var apps = await _appRepo.GetAllAsync();
            return Ok(apps.Select(a => new
            {
                a.ApplicationId,
                jobTitle      = a.Job?.JobTitle,
                companyName   = a.Job?.Employer?.CompanyName,
                applicantName = a.JobSeeker?.FullName,
                applicantEmail= a.JobSeeker?.User?.Email,
                a.ApplicationStatus,
                a.MatchScore,
                a.AppliedAt
            }));
        }
    }
}