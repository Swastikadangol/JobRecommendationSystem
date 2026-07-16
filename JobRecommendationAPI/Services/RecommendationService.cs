using JobRecommendationAPI.Enums;
using JobRecommendationAPI.Models;
using JobRecommendationAPI.DTOs.Recommendation;

namespace JobRecommendationAPI.Services
{
    public class RecommendationService
    {
        //noramlize skills 
        // Convert to lowercase and split by comma, semicolon or |
        // Example:
        // "C#, SQL; React" -> ["c#", "sql", "react"]
        private List<string> NormalizeSkills(string skills)
        {
            return skills
                .ToLower()
                .Split(new[] { ',', ';', '|' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .ToList();
        }

        // TF = Term Frequency (how importatn is this skill inside this document inside one job)
        // Measures how often each skill appears in one document.
        //
        // Formula:
        // TF = Count of skill / Total number of skills
        private Dictionary<string, double> CalculateTF(List<string> skills)
        {
            int totalSkills = skills.Count;
            return skills
                .GroupBy(skill => skill)
                .ToDictionary(
                  group => group.Key,
            group => group.Count() / (double)totalSkills
                );
        }

        // IDF = Inverse Document Frequency
        // Measures how rare or common a skill is across ALL jobs.
        //
        // Rare skills get a HIGHER IDF.
        // Common skills get a LOWER IDF.
        //
        // Formula:
        // IDF = log(Total Jobs / (1 + Jobs Containing Skill))
        private Dictionary<string, double> CalculateIDF(IEnumerable<Job> allJobs)
        {
            // Convert every job's required skills into a list
            var jobSkillLists = allJobs
                .Select(job => NormalizeSkills(job.RequiredSkills).Distinct())
                .ToList();

            // Total number of jobs
            int totalJobs = jobSkillLists.Count;

            // Get every unique skill from all jobs
            var allSkills = jobSkillLists
                .SelectMany(skills => skills)
                .Distinct();

            var idf = new Dictionary<string, double>();

            foreach (var skill in allSkills)
            {
                // Count how many jobs contain this skill
                int documentFrequency = jobSkillLists.Count(skills => skills.Contains(skill));

                // Calculate IDF
                idf[skill] = Math.Log((double)totalJobs / (1 + documentFrequency));
            }

            return idf;
        }

        // Build TF-IDF vector for one document (job or job seeker)
        //
        // TF-IDF = TF × IDF
        private Dictionary<string, double> BuildTFIDFVector(
            List<string> skills,
            Dictionary<string, double> idf)
        {
            // Calculate TF for this document
            var tf = CalculateTF(skills);

            // Store TF-IDF values
            var tfidf = new Dictionary<string, double>();

            // Loop through every skill in the IDF dictionary
            foreach (var skill in idf.Keys)
            {
                // If this document contains the skill,
                // get its TF value. Otherwise use 0.
                double tfValue = tf.ContainsKey(skill)
                    ? tf[skill]
                    : 0;

                // TF-IDF = TF × IDF
                tfidf[skill] = tfValue * idf[skill];
            }

            return tfidf;
        }

        // Compare two TF-IDF vectors using Cosine Similarity
        // Returns a value between 0 and 100
        private double CosineSimilarity(
            Dictionary<string, double> seekerVector,
            Dictionary<string, double> jobVector)
        {
            // U · J (dot product)
            double dotProduct = 0;

            // |U|
            double magnitudeSeeker = 0;

            // |J|
            double magnitudeJob = 0;

            // Loop through every skill in the vector
            foreach (var skill in seekerVector.Keys)
            {
                // Multiply both TF-IDF values and add them
                dotProduct += seekerVector[skill] * jobVector[skill];

                // Square seeker value
                magnitudeSeeker += Math.Pow(seekerVector[skill], 2);

                // Square job value
                magnitudeJob += Math.Pow(jobVector[skill], 2);
            }

            // Take square root
            magnitudeSeeker = Math.Sqrt(magnitudeSeeker);
            magnitudeJob = Math.Sqrt(magnitudeJob);

            // Avoid division by zero
            if (magnitudeSeeker == 0 || magnitudeJob == 0)
                return 0;

            // Cosine Similarity formula
            return Math.Round(
                (dotProduct / (magnitudeSeeker * magnitudeJob)) * 100,
                2);
        }
        // Calculate skill match using TF-IDF + Cosine Similarity
        public double CalculateMatchScore(
            string? seekerSkills,
            string jobSkills,
            IEnumerable<Job> allJobs)
        {
            // Return 0 if either skill list is empty
            if (string.IsNullOrWhiteSpace(seekerSkills) ||
                string.IsNullOrWhiteSpace(jobSkills))
                return 0;

            // Convert skill strings into lists
            var seekerSkillList = NormalizeSkills(seekerSkills);
            var jobSkillList = NormalizeSkills(jobSkills);

            // Calculate IDF using ALL jobs
            var idf = CalculateIDF(allJobs);

            // Build TF-IDF vector for the seeker
            var seekerVector = BuildTFIDFVector(seekerSkillList, idf);

            // Build TF-IDF vector for this job
            var jobVector = BuildTFIDFVector(jobSkillList, idf);

            // Compare vectors using Cosine Similarity
            return CosineSimilarity(seekerVector, jobVector);
        }

        // final recommendation system
        //weighted scoring system
        // WEIGHTS (importance level):
        // Skills      = 60%  (most important)
        // Experience  = 15%
        // Education   = 10%
        // JobType     = 10%
        // WorkMode    = 5%
        public List<RecommendationResult> GetRecommendations(
             string? seekerSkills,
            int seekerExperience,
            EducationLevel seekerEducation,
            JobType seekerJobType,
            WorkMode seekerWorkMode,
            IEnumerable<Job> allJobs,
            JobType? filterJobType = null,
            WorkMode? filterWorkMode = null)
        {
            // User must have entered skills before getting recommendations
            if (string.IsNullOrWhiteSpace(seekerSkills))
            {
                return new List<RecommendationResult>();
            }

            var scored = allJobs
                .Select(job =>
                {
                    // 1. SKILL SCORE
                    double skillScore = CalculateMatchScore(seekerSkills,job.RequiredSkills, allJobs);
                    var matchedSkills = GetMatchedSkills(seekerSkills, job.RequiredSkills);
                    var missingSkills = GetMissingSkills(seekerSkills, job.RequiredSkills);
                    // 2. EXPERIENCE SCORE
                    double experienceScore =
                        seekerExperience >= job.MinYearsExperience
                            ? 100
                            : (job.MinYearsExperience == 0
                                ? 100
                                : (seekerExperience / (double)job.MinYearsExperience) * 100);

                    experienceScore = Math.Min(experienceScore, 100);

                    // 3. EDUCATION SCORE
                    // Higher enum = better qualification
                    double educationScore =
                        seekerEducation >= job.MinimumEducationLevel
                            ? 100
                            : 0;

                    // 4. JOB TYPE SCORE
                    double jobTypeScore =
                        seekerJobType == job.JobType
                            ? 100
                            : 0;

                    // 5. WORK MODE SCORE
                    double workModeScore =
                        seekerWorkMode == job.WorkMode
                            ? 100
                            : 0;

                    // FINAL WEIGHTED SCORE
                    double finalScore =
                        (skillScore * 0.60) +
                        (experienceScore * 0.15) +
                        (educationScore * 0.10) +
                        (jobTypeScore * 0.10) +
                        (workModeScore * 0.05);

                    return new RecommendationResult
                    {
                        Job = job,
                        Score = Math.Round(finalScore, 2),
                        MatchedSkills = matchedSkills,
                        MissingSkills = missingSkills,
                        Reason = matchedSkills.Count > 0
                            ? $"Matched {matchedSkills.Count} required skills"
                            : "Low skill match"
                    };
                })
                .ToList();

            // STEP 4: APPLY FILTERS
            if (filterJobType.HasValue)
                scored = scored.Where(x => x.Job.JobType == filterJobType.Value).ToList();
            if (filterWorkMode.HasValue)
                scored = scored.Where(x => x.Job.WorkMode == filterWorkMode.Value).ToList();
            // STEP 5: SORT BY BEST MATCH
            return scored
                .OrderByDescending(x => x.Score)
                .ToList();
        }

        private List<string> GetMatchedSkills(string? seekerSkills, string jobSkills)
        {
            var seekerSet = NormalizeSkills(seekerSkills ?? "").ToHashSet();

            return NormalizeSkills(jobSkills)
                .Where(skill => seekerSet.Contains(skill))
                .ToList();
        }

        private List<string> GetMissingSkills(string? seekerSkills, string jobSkills)
        {
            var seekerSet = NormalizeSkills(seekerSkills ?? "").ToHashSet();

            return NormalizeSkills(jobSkills)
                .Where(skill => !seekerSet.Contains(skill))
                .ToList();
        }
    }
}
//First, I normalize the job seeker and job skills by converting them to lowercase and splitting them into individual skills. Then I calculate Term Frequency (TF) for each skill and Inverse Document Frequency (IDF) using all jobs in the database. Multiplying TF and IDF gives me a TF-IDF weight for each skill. Next, I build TF-IDF vectors for the job seeker and each job, and compare them using Cosine Similarity to calculate the skill match score. Finally, I combine the skill score with experience, education, job type, and work mode using a weighted scoring formula(60%, 15%, 10%, 10%, and 5%) to generate the final recommendation score. The jobs are then sorted from highest score to lowest and displayed as recommendations."