using JobRecommendationAPI.DTOs.AI;
using JobRecommendationAPI.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly GeminiService _geminiService;

    public AIController(GeminiService geminiService)
    {
        _geminiService = geminiService;
    }

    [HttpPost("generate-job")]
    public async Task<IActionResult> GenerateJob(GenerateJobRequest request)
    {
        var result = await _geminiService.GenerateJobAsync(request.JobTitle);
        return Ok(result);
    }
}