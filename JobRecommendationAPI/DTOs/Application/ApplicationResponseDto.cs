using JobRecommendationAPI.DTOs.Profile.JobSeeker.Experience;
using JobRecommendationAPI.Enums;

namespace JobRecommendationAPI.DTOs.Application
{
    public class ApplicationResponseDto
    {
        public int ApplicationId { get; set; }

        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;

        public int JobSeekerId { get; set; }
        public string ApplicantName { get; set; } = string.Empty;
        public string ApplicantEmail { get; set; } = string.Empty;

        public string? ApplicantSkills { get; set; }
        public string? ApplicantPhone {get; set;}
        public string? ApplicantEducation {get; set;}
        public string? ApplicantResume { get; set; }


        public ApplicationStatus ApplicationStatus { get; set; }

        public double MatchScore { get; set; }

        public DateTime AppliedAt { get; set; }

        //experience list
        public List<ExperienceDto> Experiences {get; set;} = new();
    }

    public class ExperienceDto
    {
        public int ExperienceId {get; set;}
        public string JobTitle {get; set;} = string.Empty;
        public string CompanyName {get; set;} = string.Empty;
        public DateTime StartDate {get; set;}
        public DateTime? EndDate {get; set;}
        public string? Description {get; set;}
        public bool IsCurrent => EndDate == null;


    }
}