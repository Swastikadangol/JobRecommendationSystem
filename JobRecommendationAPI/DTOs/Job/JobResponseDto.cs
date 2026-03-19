namespace JobRecommendationAPI.DTOs.Job
{
    public class JobResponseDto
    {
        public int JobId { get; set; }
        public int EmployerId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string? JobDescription { get; set; }
        public string JobType { get; set; } = string.Empty;
        public string RequiredSkills { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? SalaryRange { get; set; }
        public string? Qualifications { get; set; }
        public string? ExperienceRequired { get; set; }
        public string? Deadline { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime PostedAt { get; set; }
        public string? CompanyName { get; set; }
    }
}
