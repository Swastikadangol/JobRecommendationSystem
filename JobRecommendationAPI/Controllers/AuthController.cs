using JobRecommendationAPI.DTOs.Auth;
using JobRecommendationAPI.Enums;
using JobRecommendationAPI.Models;
using JobRecommendationAPI.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JobRecommendationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IJobSeekerRepository _jobSeekerRepo;
        private readonly IEmployerRepository _employerRepo;

        public AuthController(
            IUserRepository userRepo,
            IJobSeekerRepository jobSeekerRepo,
            IEmployerRepository employerRepo)
        {
            _userRepo = userRepo;
            _jobSeekerRepo = jobSeekerRepo;
            _employerRepo = employerRepo;
        }

        // =========================
        // REGISTER
        // =========================
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (dto.Role == Role.Admin)
                return BadRequest("Cannot register as Admin.");

            if (await _userRepo.EmailExistsAsync(dto.Email))
                return BadRequest("Email already exists.");

            // Create User
            var user = new User
            {
                UserName = dto.Username,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                Status = UserStatus.Active
            };

            await _userRepo.CreateAsync(user);

            int profileId = 0;

            // =========================
            // JOB SEEKER
            // =========================
            if (dto.Role == Role.JobSeeker)
            {
                var jobSeeker = new JobSeeker
                {
                    UserId = user.UserId,
                    FullName = dto.FullName ?? dto.Username,
                    Phone = dto.Phone
                };

                await _jobSeekerRepo.CreateAsync(jobSeeker);
                profileId = jobSeeker.JobSeekerId;
            }

            // =========================
            // EMPLOYER
            // =========================
            else if (dto.Role == Role.Employer)
            {
                if (string.IsNullOrWhiteSpace(dto.CompanyName))
                    return BadRequest("CompanyName is required for Employer.");

                if (string.IsNullOrWhiteSpace(dto.ContactNumber))
                    return BadRequest("ContactNumber is required for Employer.");

                var employer = new Employer
                {
                    UserId = user.UserId,
                    CompanyName = dto.CompanyName,
                    CompanyNumber = dto.ContactNumber
                };

                await _employerRepo.CreateAsync(employer);
                profileId = employer.EmployerId;
            }

            return Ok(new
            {
                message = "Registration successful",
                user.UserId,
                profileId,
                user.UserName,
                user.Email,
                user.Role
            });
        }

        // =========================
        // LOGIN
        // =========================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized("Invalid email or password.");

            if (user.Status == UserStatus.Inactive)
                return Unauthorized("Account is inactive.");

            int profileId = 0;
            string? fullName = null;
            string? companyName = null;

            if (user.Role == Role.JobSeeker)
            {
                var js = await _jobSeekerRepo.GetByUserIdAsync(user.UserId);
                profileId = js?.JobSeekerId ?? 0;
                fullName = js?.FullName;
            }
            else if (user.Role == Role.Employer)
            {
                var emp = await _employerRepo.GetByUserIdAsync(user.UserId);
                profileId = emp?.EmployerId ?? 0;
                companyName = emp?.CompanyName;
            }

            return Ok(new
            {
                message = "Login successful",
                user.UserId,
                profileId,
                user.UserName,
                user.Email,
                user.Role,
                fullName,
                companyName
            });
        }
    }
}