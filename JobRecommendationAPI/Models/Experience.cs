using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobRecommendationAPI.Models
{
    public class Experience
    {
        [Key]
        public int ExperienceId { get; set; }

        [Required]
        public int JobSeekerId { get; set; }

        [ForeignKey("JobSeekerId")]
        public JobSeeker? JobSeeker { get; set; }

        [Required]
        public string JobTitle { get; set; } = string.Empty;

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        // Null means currently working here
        public DateTime? EndDate { get; set; }

        public string? Description { get; set; }
    }
}