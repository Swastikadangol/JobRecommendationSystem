namespace JobRecommendationAPI.DTOs.Profile
{
    //UpdateJobSeekerDto is the data the UI sends when a JobSeeker edits their profile.
    public class UpdateJobSeekerDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Skills { get; set; }
        public string? Education { get; set; }
        public string? Experience { get; set; }
        public string? Interests { get; set; }
    }
}
