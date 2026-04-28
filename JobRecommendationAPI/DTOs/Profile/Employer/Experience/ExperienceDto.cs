namespace JobRecommendationAPI.DTOs.Profile.Employer.Experience
{
    //Used when user SENDS data to API
    public class ExperienceDto
    {
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; } // null = currently working
        public string? Description { get; set; }
    }
}
