using System.Globalization;

namespace JobRecommendationAPI.DTOs.Job
{
    public class JobDto
    {
        public int EmployerId {  get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string? JobDescription { get; set; }
        public string JobType { get; set; } = "FullTime";
        public string RequiredSkills { get; set; } = string.Empty;
        public string? Location {  get; set; }
        public string? SalaryRange {  get; set; }
        public string? Qualification {  get; set; }
        public string? ExperienceRequired {  get; set; }
        public string? Deadline {  get; set; }
    }
}
