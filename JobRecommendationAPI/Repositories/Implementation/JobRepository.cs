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
        public async Task<Job?> GetByIdAsync(int jobId) =>
            await _db.Jobs
            .Include(j => j.Employer)
            .FirstOrDefaultAsync(j => j.JobId == jobId);

        //get all job posted with the employer details 
        //when approved ==nul show all the jobs
        public async Task<IEnumerable<Job>> GetAllAsync(JobStatus? status = null)
        {
            var query = _db.Jobs
                .Include(j => j.Employer) // also load the linked Employer data
                .Where(j => j.IsActive)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(j => j.Status == status.Value);

           

            return await query.OrderByDescending(j => j.PostedAt).ToListAsync();
        }


        //create a new job and return the job
        public async Task<Job> CreateAsync(Job job)
        {
            job.PostedAt = DateTime.UtcNow;
            job.Status = JobStatus.Pending; // default visible job
            job.IsActive = true;
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
            job.Status = JobStatus.Closed;
            job.IsActive = false;
            await _db.SaveChangesAsync();
            return true;
        }


        public async Task<IEnumerable<Job>> GetAllApprovedAsync(JobType? jobType = null, WorkMode? workMode = null)
        {
            var query = _db.Jobs
                .Include(j => j.Employer) // keep only this
                .Where(j => j.Status == JobStatus.Approved && j.IsActive);

            if (jobType.HasValue)
                query = query.Where(j => j.JobType == jobType.Value);

            if (workMode.HasValue)
                query = query.Where(j => j.WorkMode == workMode.Value);

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

        //search job
        public async Task<IEnumerable<Job>> SearchAsync(string keyword)
        {
            return await _db.Jobs
                .Where(j =>
                    j.IsActive &&
                    (
                        j.JobTitle.Contains(keyword) ||
                        j.RequiredSkills.Contains(keyword) ||
                        (j.JobDescription != null && j.JobDescription.Contains(keyword))
                    ))
                .OrderByDescending(j => j.PostedAt)
                .ToListAsync();
        }


        //count all the active job
        public async Task<int> CountAsync() =>
            await _db.Jobs.CountAsync(j => j.IsActive);


        // Approve a job (set status to Approved)
        public async Task<bool> ApproveAsync(int jobId)
        {
            var job = await _db.Jobs.FindAsync(jobId);
            if (job == null) return false;

            job.Status = JobStatus.Approved;
            await _db.SaveChangesAsync();
            return true;
        }

        // Reject a job (set status to Rejected)
        public async Task<bool> RejectAsync(int jobId)
        {
            var job = await _db.Jobs.FindAsync(jobId);
            if (job == null) return false;

            job.Status = JobStatus.Rejected;
            await _db.SaveChangesAsync();
            return true;
        }

        // Count only pending jobs (for admin dashboard)
        public async Task<int> CountPendingAsync()
        {
            return await _db.Jobs.CountAsync(j => j.Status == JobStatus.Pending && j.IsActive);
        }


    }
}
