namespace JobRecommendationAPI.Repositories.Interfaces
{
    public interface IJobRepository
    {
        //fetch single job by its primary key id
        Task<Job?> GetByIdAsync(int jobId);
        //fetch all jobs, oprtionally filter by approval statust( true = show approved jobs, fale= show rejected or pennding jobes)
        Task<IEnumerable<Job>> GetAllAsync(JobStatus? approved = null);
        //insert a new job into db (defalut "pending status")
        Task<Job> CreateAsync(Job job);
        //update an existing job's data
        Task<Job> UpdateAsync(Job job);
        //delete a job by id returns true if deleted else false if not found
        Task<bool> DeleteAsync(int jobId);

        Task<IEnumerable<Job>> GetAllApprovedAsync(JobType? jobType = null, WorkMode? workMode = null);


        //fetch all jobs posted by specific employer
        Task<IEnumerable<Job>> GetByEmployerAsync(int employerId);
        Task<IEnumerable<Job>> SearchAsync(string keyword);

        //count total number of jobs in db
        Task<int> CountAsync();
        Task<bool> ApproveAsync(int jobId);
        Task<bool> RejectAsync(int jobId);
        Task<int> CountPendingAsync();

    }
}
