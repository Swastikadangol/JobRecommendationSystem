using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobRecommendationAPI.Models
{
    public class Employer
    {
        [Key]
        public int EmployerId { get; set; }
        //foreign key
        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
        public string CompanyName { get; set; } = string.Empty;

        public string? CompanyNumber { get; set; }
        public DateTime ProfileCreatedAt { get; set; } = DateTime.Now;
        
        // Navigation-- one employer can post multiple jobs
        public ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}
