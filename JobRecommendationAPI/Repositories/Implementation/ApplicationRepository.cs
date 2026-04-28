using JobRecommendationAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace JobRecommendationAPI.Repositories.Implementation
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly AppDbContext _db;
        public ApplicationRepository(AppDbContext db)
        {
            _db = db;
        }

        //get the application using the id also include the job, employer linked to job, and jobseeker aswell as user linked to jobseeker
        //fetch the all information of application search using the id that specific application
        public async Task<Application?> GetByIdAsync(int id) =>
            await _db.Applications
            .Include(a => a.Job)
            .ThenInclude(j => j!.Employer)
            .Include(a => a.JobSeeker)
            .ThenInclude(js => js!.User)
            .FirstOrDefaultAsync(a => a.ApplicationId == id);


        //get the application usinf jobseekerid and also include job and employer linked to job
        //fetch only the application that a specific jobseeker appliied to
        public async Task<IEnumerable<Application>> GetByJobSeekerAsync(int jobSeekerId) =>
            await _db.Applications
            .Include(a => a.Job)
            .ThenInclude(j => j!.Employer)
            .Where(a => a.JobSeekerId == jobSeekerId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();


        //fetch only the application of specific job usinf jobid
        public async Task<IEnumerable<Application>> GetByJobAsync(int jobId) =>
            await _db.Applications
            .Include(a => a.JobSeeker)
            .ThenInclude(js => js!.User)
            .Where(a => a.JobId == jobId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        //fetch all the applications in db with alll details with job jobseeker user
        public async Task<IEnumerable<Application>> GetAllAsync() =>
            await _db.Applications
            .Include(a => a.Job)
            .Include(a => a.JobSeeker)
            .ThenInclude(js => js!.User)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        //check if the specific jobseekr has applied to the specific job or not
        public async Task<bool> AlreadyAppliedAsync(int jobSeekerId, int jobId) =>
            await _db.Applications
            .AnyAsync(a => a.JobSeekerId == jobSeekerId && a.JobId == jobId);

        //create a new application that mean applied to any job
        public async Task<Application> CreateAsync(Application application)
        {
            _db.Applications.Add(application);
            await _db.SaveChangesAsync();
            return application;
        }

        //update/set the status of the application ie jobseeker applied the job that make application and the stsus is changed by the employer like approved rejected 
        public async Task<bool> UpdateStatusAsync(int id, ApplicationStatus status)
        {
            var app = await _db.Applications.FindAsync(id);
            if (app == null) return false;
            app.ApplicationStatus = status;
            await _db.SaveChangesAsync();
            return true;
        }

        //count the no of applcation
        public async Task<int> CountAsync() =>
            await _db.Applications.CountAsync();
    }
}
