using static System.Runtime.InteropServices.JavaScript.JSType;

namespace JobRecommendationAPI.DTOs.Profile.JobSeeker.Experience
{
    //Used when API SENDS data back to user
    public class ExperienceResponseDto
    {
        public int ExperienceId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Description { get; set; }
    }
}
