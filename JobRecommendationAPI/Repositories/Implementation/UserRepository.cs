using JobRecommendationAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobRecommendationAPI.Repositories.Implementation
{
    public class UserRepository:IUserRepository
    {
        //to use database make a obkect of dbcontext
        private readonly AppDbContext _db;

        //inject database context via constructor
        public UserRepository(AppDbContext db)
        {
            _db = db;
        }

        //find user by primary key, retuen null if not found
        //findasync find only using prmarykey
        public async Task<User?> GetByIdAsync(int id) =>
            await _db.Users.FindAsync(id);

        //find user by email for login/auth checkks
        public async Task<User?> GetByEmailAsync(string email)
          => await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

        //get all non-admin users, newest first
        public async Task<IEnumerable<User>> GetAllAsync() =>
            await _db.Users
            .Where(u => u.Role != "Admin")
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        //get all users f specific role, newest first
        public async Task<IEnumerable<User>> GetByRoleAsync(string role) =>
            await _db.Users
            .Where(u => u.Role == role)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        //add new user to db and return saved entity
        public async Task<User> CreateAsync(User user)
        {
             _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }

        //update user data and return updated entity
        public async Task<User> UpdateAsync(User user)
        {
            _db.Users.Update(user);
            await _db.SaveChangesAsync();
            return user;
        }

        //delette user by id , return false if not found
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if(user == null) return false;
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return true;
        }

       //check if email is already registered to prevent duplicates
       public async Task<bool> EmailExistAsync(string email) =>
            await _db.Users.AnyAsync(u => u.Email == email);

        //flip status between active and inactive, return false if user not found
        public async Task<bool> ToggleStatusAsync(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return false;
            user.Status = user.Status == "Active" ? "Inactive" : "Active";
            await _db.SaveChangesAsync();
            return true;
        }

        //count total users belonging to a specific role
        public async Task<int> CountByRoleAsync(string role) =>
            await _db.Users.CountAsync(u => u.Role == role);


            

    }
}
