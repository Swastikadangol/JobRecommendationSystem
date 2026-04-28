using JobRecommendationAPI.Enums;

namespace JobRecommendationAPI.DTOs.Auth
{
    public class RegisterDto
    {
        //only contain those field that are required for register that are show in register ui
        //users fields
        public string Username {  get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        // JobSeeker or Employer only — Admin cannot register
        public Role Role { get; set; } = Role.JobSeeker;

        //jobseeker fields
        public string? FullName {  get; set; }
        public string? Phone {  get; set; }
    

        //employer field
        public string? CompanyName {  get; set; }
        public string? ContactNumber {  get; set; }



    }
}
