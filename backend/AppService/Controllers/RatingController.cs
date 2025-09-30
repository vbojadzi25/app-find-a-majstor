using System.Security.Claims;
using AppService.Models;
using AppService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatingController : ControllerBase
{
    private readonly IRatingService _ratingService;
    private readonly ICraftsmanService _craftsmanService;

    public RatingController(IRatingService ratingService, ICraftsmanService craftsmanService)
    {
        _ratingService = ratingService;
        _craftsmanService = craftsmanService;
    }

    [Authorize(Roles = "Client")]
    [HttpPost("craftsman/{craftsmanId}")]
    public async Task<ActionResult<Rating>> AddRating(int craftsmanId, [FromBody] AddRatingRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var craftsman = await _craftsmanService.GetProfileByIdAsync(craftsmanId);
        if (craftsman == null)
        {
            return NotFound(new { message = "Craftsman not found" });
        }

        var clientId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var clientEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";

        var rating = await _ratingService.AddRatingAsync(craftsmanId, clientId, clientEmail, request);
        return Ok(rating);
    }

    [HttpGet("craftsman/{craftsmanId}")]
    public async Task<ActionResult<List<Rating>>> GetRatingsForCraftsman(int craftsmanId)
    {
        var craftsman = await _craftsmanService.GetProfileByIdAsync(craftsmanId);
        if (craftsman == null)
        {
            return NotFound(new { message = "Craftsman not found" });
        }

        var ratings = await _ratingService.GetRatingsForCraftsmanAsync(craftsmanId);
        return Ok(ratings);
    }

    [Authorize(Roles = "Client")]
    [HttpGet("craftsman/{craftsmanId}/my-rating")]
    public async Task<ActionResult<Rating>> GetMyRatingForCraftsman(int craftsmanId)
    {
        var clientId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var rating = await _ratingService.GetExistingRatingAsync(craftsmanId, clientId);
        if (rating == null)
        {
            return NotFound();
        }

        return Ok(rating);
    }
}