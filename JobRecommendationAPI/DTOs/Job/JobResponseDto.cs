using JobRecommendationAPI.Enums;

namespace JobRecommendationAPI.DTOs.Job
{
    public class JobResponseDto
    {
        public int JobId { get; set; }
        public int EmployerId { get; set; }
        public string CompanyName { get; set; } = string.Empty;

        public string JobTitle { get; set; } = string.Empty;
        public string? JobDescription { get; set; }
        public JobType JobType { get; set; }
        public WorkMode WorkMode { get; set; }
        public string RequiredSkills { get; set; } = string.Empty;

        public string? Location { get; set; }
        public string? SalaryRange { get; set; }

        public DateTime? Deadline { get; set; }
        public EducationLevel? MinimumEducationLevel { get; set; }
        public int? MinYearsExperience { get; set; }
        public JobStatus Status { get; set; }
        public bool IsActive { get; set; }
        public DateTime PostedAt { get; set; }

    }
}