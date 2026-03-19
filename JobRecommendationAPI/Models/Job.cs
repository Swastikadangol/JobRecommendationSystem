using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobRecommendationAPI.Models
{
    public class Job
    {
        [Key]
        public int JobId { get; set; }
        [Required]
        public int EmployerId { get; set; }
        [ForeignKey("EmployerId")]
        public Employer? Employer { get; set; }
        [Required]
        public string JobTitle { get; set; } = string.Empty;
        public string? JobDescription { get; set; }

    //FullTime, PartTime, Internship
        public string JobType { get; set; } = "FullTime";
        [Required]
        public string RequiredSkills { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? SalaryRange { get; set; }
        public string? Qualification { get; set; }
        public string? ExperienceRequired { get; set; }
        public string? Deadline { get; set; }
        //Pending, Approved, Rejected
        public string Status { get; set; } = "Pending";
        public bool IsActive { get; set; } = true;
        public DateTime PostedAt { get; set; } = DateTime.Now;

        // Navigation-- one job can have multiple applicants
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
