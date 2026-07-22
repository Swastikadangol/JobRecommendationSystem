using JobRecommendationAPI.Enums;

namespace JobRecommendationAPI.DTOs.Application
{
    public class EducationDto
    {
        public string InstitutionName { get; set; } = string.Empty;
        public string? FieldOfStudy { get; set; }
        public EducationLevel Level { get; set; }
        public int? GraduationYear { get; set; }
    }
}