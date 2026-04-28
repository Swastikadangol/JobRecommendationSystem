using JobRecommendationAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobRecommendationAPI.Repositories.Implementation
{
    public class EmployerRepository : IEmployerRepository
    {
        private readonly AppDbContext _db;

        //dependency injnect by construtor
        public EmployerRepository(AppDbContext db)
        {
            _db = db;
        }

        //fecth the employer data using the id alsos include the connection to user
        public async Task<Employer?> GetByIdAsync(int employerId) =>
            await _db.Employers
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.EmployerId == employerId);

        //fetch the employer profile from the user
        public async Task<Employer?> GetByUserIdAsync(int userId) =>
            await _db.Employers
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.UserId == userId);

        //create a new employer to databse and return the newly created profile
        public async Task<Employer> CreateAsync(Employer employer)
        {
            _db.Employers.Add(employer);
            await _db.SaveChangesAsync();
            return employer;
        }

        //update the existing employer profile and return updated profile
        public async Task<Employer> UpdateAsync(Employer employer)
        {
            _db.Employers.Update(employer);
            await _db.SaveChangesAsync();
            return employer;
        }

        // JOB MANAGEMENT
        public async Task<IEnumerable<Job>> GetJobsByEmployerAsync(int employerId)
        {
            return await _db.Jobs
                .Where(j => j.EmployerId == employerId)
                .OrderByDescending(j => j.JobId)
                .ToListAsync();
        }

        public async Task<int> CountJobsAsync(int employerId)
        {
            return await _db.Jobs.CountAsync(j => j.EmployerId == employerId);
        }

        // APPLICATION INSIGHTS
        public async Task<int> GetTotalApplicationsAsync(int employerId)
        {
            return await _db.Applications
                .Where(a => a.Job.EmployerId == employerId)
                .CountAsync();
        }

        public async Task<IEnumerable<Application>> GetApplicationsByEmployerAsync(int employerId)
        {
            return await _db.Applications
                .Include(a => a.Job)
                .Include(a => a.JobSeeker)
                .ThenInclude(js => js.User)
                .Where(a => a.Job.EmployerId == employerId)
                .ToListAsync();
        }

    }
}
