using JobRecommendationAPI.Enums;
using JobRecommendationAPI.Models;

namespace JobRecommendationAPI.Services
{
    public class RecommendationService
    {
        //noramlize skills (split is notw working properly so)
        private List<string> NormalizeSkills(string skills)
        {
            return skills
                .ToLower()
                .Split(new[] { ',', ';', '|' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .ToList();
        }
        // Cosine similarity between jobseeker skills and job required skills
        public double CalculateMatchScore(string? seekerSkills, string jobSkills)
        {
            if (string.IsNullOrWhiteSpace(seekerSkills) || string.IsNullOrWhiteSpace(jobSkills))
                return 0;

            var seekerSet = NormalizeSkills(seekerSkills).ToHashSet();
            var jobSet = NormalizeSkills(jobSkills).ToHashSet();

            if (seekerSet.Count == 0 || jobSet.Count == 0)
                return 0;

            // Union of all unique skills = vector space Combine both sets
            var allSkills = seekerSet.Union(jobSet).ToList();

            //u : jobseeker skills j= job skills
            double[] u = allSkills.Select(s => seekerSet.Contains(s) ? 1.0 : 0.0).ToArray();
            double[] j = allSkills.Select(s => jobSet.Contains(s) ? 1.0 : 0.0).ToArray();

            // Cosine similarity = U·J / (||U|| * ||J||)
            //zip: Take one item from u and one item from j at the same position.
            double dotProduct = u.Zip(j, (a, b) => a * b).Sum();
            //|U| = √(u1² + u2² + u3² + ... + un²)
            double magU = Math.Sqrt(u.Sum(x => x * x));
            double magJ = Math.Sqrt(j.Sum(x => x * x));

            if (magU == 0 || magJ == 0) return 0;

            //cosθ = (U · J) / (|U| × |J|)
            return Math.Round(dotProduct / (magU * magJ) * 100, 2);
        }

        // Returns jobs sorted by match score with optional enum filters
        public List<(Job job, double score)> GetRecommendations(
            string? seekerSkills,
            IEnumerable<Job> allJobs,
            JobType? filterJobType = null,
            WorkMode? filterWorkMode = null)
        {
            var scored = allJobs
                .Select(j => (job: j, score: CalculateMatchScore(seekerSkills, j.RequiredSkills)))
                .ToList();

            if (filterJobType.HasValue)
                scored = scored.Where(x => x.job.JobType == filterJobType.Value).ToList();

            if (filterWorkMode.HasValue)
                scored = scored.Where(x => x.job.WorkMode == filterWorkMode.Value).ToList();

            return scored.OrderByDescending(x => x.score).ToList();
        }
    }
}