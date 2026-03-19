namespace JobRecommendationAPI.DTOs.Auth
{
    public class RegisterDto
    {
        //only contain those field that are required for register that are show in register ui
        //users fields
        public string Username {  get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "JobSeeker";

        //jobseeker fields
        public string? FullName {  get; set; }
        public string? Phone {  get; set; }
        public string? Skills {  get; set; }
        public string? Education {  get; set; }
        public string? Experience {  get; set; }
        public string? Interests {  get; set; }

        //employer field
        public string? CompanyName {  get; set; }
        public string? CompanyWebsite {  get; set; }
        public string? CompanyDetails {  get; set; }
        public string? ContactNumber {  get; set; }



    }
}
