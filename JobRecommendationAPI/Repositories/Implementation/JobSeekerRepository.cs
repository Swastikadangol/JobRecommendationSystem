using JobRecommendationAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobRecommendationAPI.Repositories.Implementation
{
    public class JobSeekerRepository : IJobSeekerRepository
    {
        private readonly AppDbContext _db;

        //inject database via constructor
        public JobSeekerRepository(AppDbContext db)
        {
            _db = db;
        }

        //find jobseeker by their own id, includes linked user account data
        public async Task<JobSeeker?> GetByIdAsync(int jobseekerId) =>
            await _db.JobSeekers
            .Include(js => js.User)
            .Include(js => js.Experiences)
            .FirstOrDefaultAsync(js => js.JobSeekerId == jobseekerId);

        //find jobseeker by their linked user account id, inclcudes user data
        public async Task<JobSeeker?> GetByUserIdAsync(int userId) =>
            await _db.JobSeekers
            .Include(js => js.User)
            .Include(js => js.Experiences)
            .FirstOrDefaultAsync(js => js.UserId == userId);

        //create a new jobseeker to db and reurn saved entity
        public async Task<JobSeeker> CreateAsync (JobSeeker jobSeeker)
        {
            _db.JobSeekers.Add(jobSeeker);
            await _db.SaveChangesAsync();
            return jobSeeker;
        }

        //update existing jobseeker progile in db and return updated entity
        public async Task<JobSeeker> UpdateAsync (JobSeeker jobSeeker)
        {
            _db.JobSeekers.Update(jobSeeker);
            await _db.SaveChangesAsync();
            return jobSeeker;
        }

        //experience
        public async Task<Experience> AddExperienceAsync(int jobSeekerId,Experience experience)
        {
            experience.JobSeekerId = jobSeekerId;

            _db.Experiences.Add(experience);
            await _db.SaveChangesAsync();
            return experience;
        }

        public async Task<Experience?> GetExperienceByIdAsync(int experienceId) =>
          await _db.Experiences.FindAsync(experienceId);

        public async Task<IEnumerable<Experience>> GetExperiencesByJobSeekerIdAsync(int jobSeekerId)
        {
            return await _db.Experiences
                .Where(e => e.JobSeekerId == jobSeekerId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();
        }

        public async Task<Experience> UpdateExperienceAsync(Experience experience)
        {
            _db.Experiences.Update(experience);
            await _db.SaveChangesAsync();
            return experience;
        }

        public async Task<bool> DeleteExperienceAsync(int experienceId)
        {
            var exp = await _db.Experiences.FindAsync(experienceId);
            if (exp == null) return false;
            _db.Experiences.Remove(exp);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
