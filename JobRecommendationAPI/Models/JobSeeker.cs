using JobRecommendationAPI.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobRecommendationAPI.Models
{
    public class JobSeeker
    {
        [Key]
        public int JobSeekerId { get; set; }
        //foreign key
        [Required]
        public int UserId { get; set; }
        //naviagtion
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        //file path
        //public string? Resume { get; set; }
        // Comma-separated e.g. "Python,SQL,React"
        public string? Skills { get; set; }

        // Education level using enum
        public EducationLevel? EducationLevel { get; set; }
        public JobType? PreferredJobType { get; set; }  // FullTime | PartTime | Internship
        public WorkMode? PreferredWorkMode { get; set; } // OnSite | Remote | Hybrid


        public DateTime ProfileCreatedAt { get; set; } = DateTime.Now;

        //navigation - one job seeker can apply multiple application ( one-to-many navigation property)
//        ICollection<Application> — a collection of Application objects
//= new List<Application>() — initializes it as an empty list so it's never null
        public ICollection<Application> Applications { get; set; } = new List<Application>();
        // Navigation — one jobseeker can have many experiences
        public ICollection<Experience> Experiences { get; set; } = new List<Experience>();

    }
}
