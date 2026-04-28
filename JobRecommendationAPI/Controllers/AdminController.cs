using JobRecommendationAPI.DTOs.Job;
using JobRecommendationAPI.Enums;
using JobRecommendationAPI.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobRecommendationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]


    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IJobRepository _jobRepo;
        private readonly IApplicationRepository _appRepo;

        public AdminController(
            IUserRepository userRepo,
            IJobRepository jobRepo,
            IApplicationRepository appRepo)
        {
            _userRepo = userRepo;
            _jobRepo = jobRepo;
            _appRepo = appRepo;
        }

        // ── Users ────────────────────────────────────────────────

        // GET api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepo.GetAllAsync();
            return Ok(users.Select(u => new
            {
                u.UserId,
                u.UserName,
                u.Email,
                u.Role,
                u.Status,
                u.CreatedAt
            }));
        }

        // GET api/admin/users/jobseekers
        [HttpGet("users/jobseekers")]
        public async Task<IActionResult> GetJobSeekers()
        {
            var users = await _userRepo.GetByRoleAsync(Role.JobSeeker);
            return Ok(users.Select(u => new { u.UserId, u.UserName, u.Email, u.Status, u.CreatedAt }));
        }

        // GET api/admin/users/employers
        [HttpGet("users/employers")]
        public async Task<IActionResult> GetEmployers()
        {
            var users = await _userRepo.GetByRoleAsync(Role.Employer);
            return Ok(users.Select(u => new { u.UserId, u.UserName, u.Email, u.Status, u.CreatedAt }));
        }

        // PUT api/admin/users/{userId}/toggle
        [HttpPut("users/{userId}/toggle")]
        public async Task<IActionResult> ToggleUserStatus(int userId)
        {
            var toggled = await _userRepo.ToggleStatusAsync(userId);
            if (!toggled) return NotFound("User not found.");
            return Ok("User status toggled.");
        }

        // DELETE api/admin/users/{userId}
        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var deleted = await _userRepo.DeleteAsync(userId);
            if (!deleted) return NotFound("User not found.");
            return Ok("User deleted.");
        }

        // ── Jobs ─────────────────────────────────────────────────

        // GET api/admin/jobs?status=Pending
        [HttpGet("jobs")]
        public async Task<IActionResult> GetAllJobs([FromQuery] JobStatus? status = null)
        {
            var jobs = await _jobRepo.GetAllAsync(status);

            var response = jobs.Select(j => new JobResponseDto
            {
                JobId = j.JobId,
                EmployerId = j.EmployerId,
                CompanyName = j.Employer?.CompanyName ?? "",
                JobTitle = j.JobTitle,
                JobDescription = j.JobDescription,
                JobType = j.JobType,
                WorkMode = j.WorkMode,
                RequiredSkills = j.RequiredSkills,
                Location = j.Location,
                SalaryRange = j.SalaryRange,
                Deadline = j.Deadline,
                Status = j.Status,
                PostedAt = j.PostedAt
            });

            return Ok(response);
        }

        // PUT api/admin/jobs/{jobId}/approve
        [HttpPut("jobs/{jobId}/approve")]
        public async Task<IActionResult> ApproveJob(int jobId)
        {
            var done = await _jobRepo.ApproveAsync(jobId);
            if (!done) return NotFound("Job not found.");
            return Ok("Job approved.");
        }

        // PUT api/admin/jobs/{jobId}/reject
        [HttpPut("jobs/{jobId}/reject")]
        public async Task<IActionResult> RejectJob(int jobId)
        {
            var done = await _jobRepo.RejectAsync(jobId);
            if (!done) return NotFound("Job not found.");
            return Ok("Job rejected.");
        }

        // ── Dashboard stats ──────────────────────────────────────

        // GET api/admin/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            return Ok(new
            {
                TotalJobSeekers = await _userRepo.CountByRoleAsync(Role.JobSeeker),
                TotalEmployers = await _userRepo.CountByRoleAsync(Role.Employer),
                TotalJobs = await _jobRepo.CountAsync(),
                PendingJobs = await _jobRepo.CountPendingAsync(),
                TotalApplications = await _appRepo.CountAsync()
            });
        }
    }
}