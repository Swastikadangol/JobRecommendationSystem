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
        public async Task<Employer?> GetByIdAsync(int id) =>
            await _db.Employers
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.EmployerId == id);

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
         
    }
}
