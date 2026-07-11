using JobRecommendationAPI.Models;

namespace JobRecommendationAPI.DTOs.Recommendation
{
    public class RecommendationResult
    {
        public JobRecommendationAPI.Models.Job Job { get; set; }

        public double Score { get; set; }

        public List<string> MatchedSkills { get; set; } = new();

        public List<string> MissingSkills { get; set; } = new();

        public string Reason { get; set; } = "";
    }
}