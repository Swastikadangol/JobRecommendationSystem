namespace JobRecommendationAPI.DTOs.Application
{
    public class ApplicationResponseDto
    {
        public int ApplicationId { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string ApplicantName { get; set; } = string.Empty;
        public string ApplicantEmail { get; set; } = string.Empty;
        public string? ApplicantSkills { get; set; }
        public string ApplicationStatus { get; set; } = string.Empty;
        
        public double MatchScore { get; set; }
        public DateTime AppliedAt { get; set; }
    }
}
