namespace JobRecommendationAPI.DTOs.Profile
{
    public class UpdateEmployerDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? CompanyWebsite { get; set; }
        public string? CompanyDetails { get; set; }
        public string? ContactNumber { get; set; }
    }
}
