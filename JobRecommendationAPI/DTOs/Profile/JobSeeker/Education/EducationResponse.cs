using JobRecommendationAPI.Enums;

namespace JobRecommendationAPI.DTOs.Profile.JobSeeker.Education
{
    public class EducationResponseDto
    {
        public int EducationId { get; set; }
        public string InstitutionName { get; set; } = string.Empty;
        public string? FieldOfStudy { get; set; }
        public EducationLevel Level { get; set; }
        public int? GraduationYear { get; set; }
    }
}