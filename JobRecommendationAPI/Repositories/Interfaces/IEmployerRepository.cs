namespace JobRecommendationAPI.Repositories.Interfaces
{
    public interface IEmployerRepository
    {
        //fetch a single employer profile using thier priary key id
        Task<Employer?> GetByIdAsync(int employerId);
        //fetch the employer profile using thier linked userid
        Task<Employer?> GetByUserIdAsync(int userId);
        //add a new employer profile in db
        Task<Employer> CreateAsync(Employer employer);
        //update existing employer profile data
        Task<Employer> UpdateAsync(Employer employer);


        // JOB MANAGEMENT (important)
        Task<IEnumerable<Job>> GetJobsByEmployerAsync(int employerId);
        Task<int> CountJobsAsync(int employerId);

        // APPLICATION INSIGHTS
        Task<int> GetTotalApplicationsAsync(int employerId);
        Task<IEnumerable<Application>> GetApplicationsByEmployerAsync(int employerId);

        Task<EmployerReportDto> GetEmployerReportAsync(int employerId);




    }
}
