using JobRecommendationAPI.DTOs.Profile.JobSeeker.Experience;

namespace JobRecommendationAPI.DTOs.Profile.JobSeeker
{
    public class JobSeekerProfileResponseDto
    {

        public int JobSeekerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Resume { get; set; }
        public string? Skills { get; set; }
        public EducationLevel? EducationLevel { get; set; }
        public JobType? PreferredJobType { get; set; }
        public WorkMode? PreferredWorkMode { get; set; }
        public List<ExperienceResponseDto> Experiences { get; set; } = new();
    }
}
