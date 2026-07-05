using System.Text;
using System.Text.Json;
using JobRecommendationAPI.DTOs.AI;

namespace JobRecommendationAPI.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public GeminiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<GenerateJobResponse> GenerateJobAsync(string jobTitle)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            var model = _configuration["Gemini:Model"] ?? "gemini-2.5-flash";

            if (string.IsNullOrWhiteSpace(apiKey))
                throw new Exception("Gemini API Key not found.");

            var prompt = $$"""
Generate a professional job posting for the job title "{{jobTitle}}".

Return ONLY valid JSON in this format:

{
  "description": "...",
  "responsibilities": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ],
  "requiredSkills": [
    "...",
    "...",
    "...",
    "...",
    "...",
    "..."
  ],
  "qualifications": [
    "...",
    "..."
  ]
}

Requirements:
- Write a professional job description.
- Return exactly 5 responsibilities.
- Return exactly 6 requiredSkills.
- Return exactly 2 qualifications.

IMPORTANT:
requiredSkills must contain ONLY technical skill names such as:
HTML, CSS, JavaScript, React, Bootstrap, C#, .NET, ASP.NET Core, SQL Server, Entity Framework, Flutter, Dart, Python, Power BI, Figma, Git.

Do NOT write sentences.
Do NOT include phrases like "Proficiency in", "Experience with", "Knowledge of", or "Ability to".

Return JSON only.
""";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new
                            {
                                text = prompt
                            }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);

            var url =
                $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            var response = await _httpClient.PostAsync(
                url,
                new StringContent(json, Encoding.UTF8, "application/json"));

            var responseText = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception(responseText);

            using var doc = JsonDocument.Parse(responseText);

            var aiText = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            if (string.IsNullOrWhiteSpace(aiText))
                throw new Exception("Gemini returned an empty response.");

            aiText = aiText
                .Replace("```json", "")
                .Replace("```", "")
                .Trim();

            var result = JsonSerializer.Deserialize<GenerateJobResponse>(
                aiText,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            if (result == null)
                throw new Exception("Unable to parse Gemini response.");

            return result;
        }
    }
}