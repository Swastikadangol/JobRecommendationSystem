using JobRecommendationAPI.Enums;
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
        public JobType JobType { get; set; } = JobType.FullTime;
        public WorkMode WorkMode { get; set; } = WorkMode.OnSite;
        [Required]
        public string RequiredSkills { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? SalaryRange { get; set; }
        public EducationLevel? MinimumEducationLevel { get; set; }
        public int? MinYearsExperience { get; set; }
        public DateTime? Deadline { get; set; }
        //Pending, Approved, Rejected
        public JobStatus Status { get; set; } = JobStatus.Pending;
        public bool IsActive { get; set; } = false;
        public DateTime PostedAt { get; set; } = DateTime.Now;

        // Navigation-- one job can have multiple applicants
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
