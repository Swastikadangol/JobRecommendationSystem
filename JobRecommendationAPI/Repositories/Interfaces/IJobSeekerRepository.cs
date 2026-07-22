namespace JobRecommendationAPI.Repositories.Interfaces
{
    public interface IJobSeekerRepository
    {
        //fetch a single jobseeker profile by their own primary key id
        Task<JobSeeker?> GetByIdAsync(int jobSeekerId);

        //fetch a jobseeker profile using their linked useraccount id
        Task<JobSeeker?> GetByUserIdAsync(int userId);

        //insert a new jobseeker profile into he db after user regiser
        Task<JobSeeker> CreateAsync(JobSeeker jobSeeker);

        //update jobseeker profile data(name, phone, resuje, skills ect)
        Task<JobSeeker> UpdateAsync(JobSeeker jobSeeker);

        //resume
        Task UploadResumeAsync(int jobSeekerId, string resumePath);
        Task DeleteResumeAsync(int jobSeekerId);

        // Experience
        Task<Experience> AddExperienceAsync(int jobSeekerId, Experience experience);
        Task<Experience?> GetExperienceByIdAsync(int experienceId);
        Task<IEnumerable<Experience>> GetExperiencesByJobSeekerIdAsync(int jobSeekerId);
        Task<Experience> UpdateExperienceAsync(Experience experience);
        Task<bool> DeleteExperienceAsync(int experienceId);

        Task<Education> AddEducationAsync(int jobSeekerId, Education education);
        Task<Education?> GetEducationByIdAsync(int educationId);
        Task<IEnumerable<Education>> GetEducationsByJobSeekerIdAsync(int jobSeekerId);
        Task<Education> UpdateEducationAsync(Education education);
        Task<bool> DeleteEducationAsync(int educationId);

    }
}

//Repository only does:

//Get data from DB
//Save data to DB
//Update data in DB
//Delete data from DB
