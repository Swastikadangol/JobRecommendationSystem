using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobRecommendationAPI.Models
{
    public class Employer
    {
        [Key]
        public int EmployerId { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        public string CompanyName { get; set; } = string.Empty;
        public string? CompanyNumber { get; set; }

        public string? Website { get; set; }
        public string? About { get; set; }
        public string? Industry { get; set; }
        public string? CompanySize { get; set; }

        public string? City { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        public string? Address { get; set; }

        public string? LinkedIn { get; set; }
        public string? Facebook { get; set; }
        public string? Twitter { get; set; }
        public string? Instagram { get; set; }

        public DateTime ProfileCreatedAt { get; set; } = DateTime.Now;

        // Navigation
        public ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}