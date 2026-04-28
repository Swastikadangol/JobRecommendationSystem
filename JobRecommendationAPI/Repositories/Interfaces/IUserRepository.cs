namespace JobRecommendationAPI.Repositories.Interfaces
{
    public interface IUserRepository
    {
        //fetch a single user by their primary key id, returns null if not found
        Task<User?> GetByIdAsync(int id);

        //fetch a single user by email (case-sensitive), returns null if not found
        Task<User?> GetByEmailAsync(string email);

        //fetch all users in the database as a list
        Task<IEnumerable<User>> GetAllAsync();

        //fetch all users that match a specific role(eg: "admin" "user"
        Task<IEnumerable<User>> GetByRoleAsync(Role role);

        //insert a new user record into the database and return the saved entity
        Task<User> CreateAsync(User user);

        //update an existing user's data ad return the updated entity
        Task<User> UpdateAsync(User user);

        //delete a user by id, return true if deleted, false if not found
        Task<bool> DeleteAsync(int userId);

        //check if an email is already registered, return true if exits
        Task<bool> EmailExistsAsync(string email);

        //flip a user's active/inactive status, return true if succesful
        Task<bool> ToggleStatusAsync(int id);

        //count how many users belong to a specifi role
        Task<int> CountByRoleAsync(Role role);
    }
}
