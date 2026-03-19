using JobRecommendationAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobRecommendationAPI.Repositories.Implementation
{
    public class JobRepository : IJobRepository
    {
        private readonly AppDbContext _db;
        public JobRepository(AppDbContext db)
        {
            _db = db;
        }

        //get a job using its id
        public async Task<Job?> GetByIdAsync(int id) =>
            await _db.Jobs
            .Include(j => j.Employer)
            .FirstOrDefaultAsync(j => j.JobId == id);

        //fecth all approved job, oprionally filter by type("FullTime", "PartTime", "Internship")

        public async Task<IEnumerable<Job>> GetAllApprovedAsync(string? type = null)
        {
            var query = _db.Jobs
                .Include(j => j.Employer) //load employer details with job
                .Where(j => j.Status == "Approved" && j.IsActive) //filter only approved and active jobs
                .AsQueryable(); //convert to query so we can add conditions later

            if(!string.IsNullOrEmpty(type) ) 
                query = query.Where(j => j.JobType == type);

            return await query
                .OrderByDescending(j => j.PostedAt)
                .ToListAsync();
        }


        //fetch the job posted by the specific employer find using employer id 
        public async Task<IEnumerable<Job>> GetByEmployerAsync(int employerId) =>
            await _db.Jobs
            .Where(j => j.EmployerId == employerId && j.IsActive)
            .OrderByDescending(j => j.PostedAt)
            .ToListAsync();


        //get all job posted with the employer details 
        //when approved ==nul show all the jobs
        public async Task<IEnumerable<Job>> GetAllAsync(bool? approved = null)
        {
            var query = _db.Jobs
                .Include(j => j.Employer) // also load the linked Employer data
                .ThenInclude(e => e!.User) //from that Employer, also load their linked User data → e! means "I know Employer might be null but trust me it's not"(null forgiveness operator)
                .Where(j => j.IsActive)
                .AsQueryable();

            if (approved == true)
                query = query.Where(j => j.Status == "Approved");

            if (approved == false)
                query = query.Where(j => j.Status == "Pending");

            return await query.OrderByDescending(j => j.PostedAt).ToListAsync();
        }

        //create a new job and return the job
        public async Task<Job> CreateAsync(Job job)
        {
            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();
            return job;
        }

        //update the existing job and retuen updated one
        public async Task<Job> UpdateAsync(Job job)
        {
            _db.Jobs.Update(job);
            await _db.SaveChangesAsync();
            return job;
        }

        //delete the job from db using id
        public async Task<bool> DeleteAsync(int id)
        {
           var job = await _db.Jobs.FindAsync(id);
            if (job == null) return false;
            job.IsActive = false;
            await _db.SaveChangesAsync();
            return true;
        }

        //set the job status to approved
        //used by admin to approve the job posted by the employer
        public async Task<bool> ApproveAsync(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if(job == null)  return false;
            job.Status = "Approved";
            await _db.SaveChangesAsync();
            return true;
        }

        //set the job ststus to rejected
        //used by admin to rejecy the job posted by the employer
        public async Task<bool> RejectAsync(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return false;
            job.Status = "Rejected";
            await _db.SaveChangesAsync();
            return true;
        }

        //count all the active job
        public async Task<int> CountAsync() =>
            await _db.Jobs.CountAsync(j => j.IsActive);

        //count the pending and active job 
        public async Task<int> CountPendingAsync() =>
            await _db.Jobs.CountAsync(j => j.Status == "Pending" && j.IsActive);
    }
}
