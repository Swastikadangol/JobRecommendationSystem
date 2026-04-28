namespace JobRecommendationAPI.DTOs.Profile.JobSeeker
{
    //UpdateJobSeekerDto is the data the UI sends when a JobSeeker edits their profile.
    public class UpdateJobSeekerDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Skills { get; set; }
        public EducationLevel? EducationLevel { get; set; }
        public JobType? PreferredJobType { get; set; }
        public WorkMode? PreferredWorkMode { get; set; }

    }
}
