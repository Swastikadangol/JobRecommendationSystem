using JobRecommendationAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace JobRecommendationAPI.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [Required]
        public string UserName { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        //JobSeeker, Employer, Admin

        public Role Role { get; set; } = Role.JobSeeker;

        public UserStatus Status { get; set; } = UserStatus.Active;
       
      
        public DateTime CreatedAt {  get; set; }= DateTime.Now;

       //navigation- one user has one profile
       public JobSeeker? JobSeekerProfile { get; set; }
        public Employer? EmployerProfile {  get; set; }
    }
}
