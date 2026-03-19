namespace JobRecommendationAPI.Repositories.Interfaces
{
    public interface IJobRepository
    {
        //fetch single job by its primary key id
        Task<Job?> GetByIdAsync(int jobId);
        //fecth all approved job, oprionally filter by type("FullTime", "PartTime", "Internship")
        Task<IEnumerable<Job>> GetAllApprovedAsync(string? type = null);
        //fetch all jobs, oprtionally filter by approval statust( true = show approved jobs, fale= show rejected or pennding jobes)
        Task<IEnumerable<Job>> GetAllAsync(bool? approved = null);
        //fetch all jobs posted by specific employer
        Task<IEnumerable<Job>> GetByEmployerAsync(int employerId);
        //insert a new job into db (defalut "pending status")
        Task<Job> CreateAsync(Job job);
        //update an existing job's data
        Task<Job> UpdateAsync(Job job);
        //delete a job by id returns true if deleted else false if not found
        Task<bool> DeleteAsync(int jobId);
        //set  job status to approved and make it visible to jobseekers
        Task<bool> ApproveAsync(int jobId);
        //set job status to rejected and hidemit from jobseekers
        Task<bool> RejectAsync(int jobId);
        //count total number of jobs in db
        Task<int> CountAsync();
        //count job with sattus = "pending" (waiting for admin aproval)
        Task<int> CountPendingAsync();

    }
}
