namespace JobRecommendationAPI.DTOs.Profile.Employer
{
    public class UpdateEmployerDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? ContactNumber { get; set; }
        public string? Website { get; set; }
        public string? About { get; set; }
        public string? Industry { get; set; }
        public string? CompanySize { get; set; }

        // Address
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        public string? Address { get; set; }

        // Social
        public string? LinkedIn { get; set; }
        public string? Facebook { get; set; }
        public string? Twitter { get; set; }
        public string? Instagram { get; set; }
    }
}