namespace JobRecommendationAPI.DTOs.AI
{
    public class GenerateJobResponse
    {
        public string Description { get; set; } = "";

        public List<string> Responsibilities { get; set; } = new();

        public List<string> RequiredSkills { get; set; } = new();

        public List<string> Benefits { get; set; } = new();

        public int MinimumEducationLevel { get; set; }

        public int MinYearsExperience { get; set; }
    }
}
