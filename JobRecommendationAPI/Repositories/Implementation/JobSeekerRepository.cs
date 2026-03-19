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
        public async Task<JobSeeker?> GetByIdAsync(int id) =>
            await _db.JobSeekers
            .Include(js => js.User)
            .FirstOrDefaultAsync(js => js.JobSeekerId == id);

        //find jobseeker by their linked user account id, inclcudes user data
        public async Task<JobSeeker?> GetByUserIdAsync(int userId) =>
            await _db.JobSeekers
            .Include(js => js.User)
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
    }
}
