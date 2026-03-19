namespace JobRecommendationAPI.DTOs.Auth
{
    //AuthResponseDto is what your API sends back to the UI after successful login or register.
    public class AuthResponseDto
    {
        public int UserId { get; set; }       // to identify the user
        public int ProfileId { get; set; }    // JobSeekerId or EmployerId for profile pages
        public string Username { get; set; } = string.Empty;  // to display "Welcome, admin"
        public string Email { get; set; } = string.Empty;    // to display in profile
        public string Role { get; set; }  = string.Empty;      // to show correct UI (Admin/JobSeeker/Employer)
        public string Token { get; set; } = string.Empty;      // JWT — used for all future API requests
        public string? FullName { get; set; }    // if JobSeeker
        public string? CompanyName { get; set; } // if Employer

    }
}
