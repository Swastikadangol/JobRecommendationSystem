using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JobRecommendationAPI.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(User user, int profileId)
        {
            //claims: the data we put inside the token
            //anyone can read these but nobidy can change them 
            var claims = new[]
            {
                new Claim("userId", user.UserId.ToString()),
                new Claim("profileId", profileId.ToString()),
                new Claim("email", user.Email),
                new Claim("userName", user.UserName),

                //claimtypes.role : special claim that [Authorize(Roles ="")] reads
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            //create the signing key from  secret string in appsettings.json
            var key = new SymmetricSecurityKey(
                           Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

            // HMAC SHA256 = the algorithm used to sign the token
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // build the actual token
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],    // who created the token
                audience: _config["Jwt:Audience"],  // who it's for
                claims: claims,                   // the data inside
                expires: DateTime.UtcNow.AddDays(7), // valid for 7 days
                signingCredentials: creds                     // sign it
            );

            // convert token object → the long string "eyJhbGci..."
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
