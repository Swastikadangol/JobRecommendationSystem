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
        [Required]
        public string Role { get; set; } = string.Empty;
        //Active, Inactive
        public string Status { get; set; } = "Active";
        public DateTime CreatedAt {  get; set; }= DateTime.Now;

       //navigation- one user has one profile
       public JobSeeker? JobSeekerProfile { get; set; }
        public Employer? EmployerProfile {  get; set; }
    }
}
