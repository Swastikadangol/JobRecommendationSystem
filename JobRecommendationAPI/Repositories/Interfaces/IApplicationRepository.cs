namespace JobRecommendationAPI.Repositories.Interfaces
{
    public interface IApplicationRepository
    {
        //fetch a single application by its primary key id
        Task<Application?> GetByIdAsync(int applicationId);

        //fetch all apllications submitted by a specific jobseeker
        Task<IEnumerable<Application>> GetByJobSeekerAsync(int jobSeekerId);

        //fetch all applications received for a specific job
        Task<IEnumerable<Application>> GetByJobAsync(int jobId);

        //fetch all applications in db (for admin overview)
        Task<IEnumerable<Application>> GetAllAsync();

        //check if a jobseeker has already applied for a specifie job, returns streu if yes
        Task<bool> AlreadyAppliedAsync(int jobSeekerId, int jobId);

        //insert a new job applcation into db , default to applied= status
        Task<Application> CreateAsync(Application application);

        //update application status ("Applied", "Reviewed", "Accepted", "Rejected") , done by employer
        Task<bool> UpdateStatusAsync(int applicationId, ApplicationStatus status);

        //count total number of application in db
        Task<int> CountAsync();
    }
}
