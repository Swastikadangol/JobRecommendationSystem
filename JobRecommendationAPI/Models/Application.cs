using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobRecommendationAPI.Models
{
    public class Application
    {
        [Key]
        public int ApplicationId { get; set; }

        [Required]
        public int JobId {  get; set; }
        [ForeignKey("JobId")]
        public Job? Job { get; set; }
        [Required]
        public int JobSeekerId { get; set; }
        [ForeignKey("JobSeekerId")]
        public JobSeeker? JobSeeker { get; set; }

        //applied, reviewed, accepted, rejected
        public string ApplicationStatus { get; set; } = "Applied";
        public double MatchScore{ get; set; } = 0;
        public DateTime AppliedAt { get; set; } = DateTime.Now;

      
    }
}
