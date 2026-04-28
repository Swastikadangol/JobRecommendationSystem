using JobRecommendationAPI.Enums;

namespace JobRecommendationAPI.DTOs.Job
{
    public class JobDto
    {
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
    }
}