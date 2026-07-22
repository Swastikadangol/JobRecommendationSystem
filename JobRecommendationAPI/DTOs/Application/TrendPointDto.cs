namespace JobRecommendationAPI.DTOs.Application
{
    public class TrendPointDto
    {
        public string Label { get; set; }   // e.g. "Jul 16", "W29", "Jun"
        public int Applications { get; set; }
        public int Accepted { get; set; }
    }
}
