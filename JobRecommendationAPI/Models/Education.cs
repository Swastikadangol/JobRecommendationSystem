using JobRecommendationAPI.Enums;

namespace JobRecommendationAPI.Models
{
    public class Education
    {
        public int EducationId { get; set; }
        public int JobSeekerId { get; set; }
        public JobSeeker JobSeeker { get; set; }

        public string InstitutionName { get; set; } = string.Empty;
        public string? FieldOfStudy { get; set; }
        public EducationLevel Level { get; set; }
        public int? GraduationYear { get; set; }
    }
}