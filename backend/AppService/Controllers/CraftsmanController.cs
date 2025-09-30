using System.Security.Claims;
using AppService.Models;
using AppService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CraftsmanController : ControllerBase
{
    private readonly ICraftsmanService _craftsmanService;

    public CraftsmanController(ICraftsmanService craftsmanService)
    {
        _craftsmanService = craftsmanService;
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<CraftsmanProfile>>> SearchCraftsmen([FromQuery] ServiceCategory? category,
        [FromQuery] string? location, [FromQuery] double? minRating, [FromQuery] string? searchTerm)
    {
        var filters = new SearchFilters
        {
            Category = category,
            Location = location,
            MinRating = minRating,
            SearchTerm = searchTerm
        };

        var craftsmen = await _craftsmanService.SearchCraftsmenAsync(filters);
        return Ok(craftsmen);
    }

    [HttpGet]
    public async Task<ActionResult<List<CraftsmanProfile>>> GetAllCraftsmen()
    {
        var craftsmen = await _craftsmanService.GetAllCraftsmenAsync();
        return Ok(craftsmen);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CraftsmanProfile>> GetCraftsman(int id)
    {
        var craftsman = await _craftsmanService.GetProfileByIdAsync(id);
        if (craftsman == null)
        {
            return NotFound();
        }

        return Ok(craftsman);
    }

    [Authorize(Roles = "Craftsman")]
    [HttpPost("profile")]
    public async Task<ActionResult<CraftsmanProfile>> CreateProfile([FromBody] CreateProfileRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var email = User.FindFirst(ClaimTypes.Email)?.Value ?? "";

        var existingProfile = await _craftsmanService.GetProfileByUserIdAsync(userId);
        if (existingProfile != null)
        {
            return Conflict(new { message = "Profile already exists" });
        }

        var profile = await _craftsmanService.CreateProfileAsync(userId, email, request);
        return CreatedAtAction(nameof(GetCraftsman), new { id = profile.Id }, profile);
    }

    [Authorize(Roles = "Craftsman")]
    [HttpPut("profile")]
    public async Task<ActionResult<CraftsmanProfile>> UpdateProfile([FromBody] CreateProfileRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var profile = await _craftsmanService.UpdateProfileAsync(userId, request);
        if (profile == null)
        {
            return NotFound(new { message = "Profile not found" });
        }

        return Ok(profile);
    }

    [Authorize(Roles = "Craftsman")]
    [HttpGet("profile/me")]
    public async Task<ActionResult<CraftsmanProfile>> GetMyProfile()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var profile = await _craftsmanService.GetProfileByUserIdAsync(userId);
        if (profile == null)
        {
            return NotFound(new { message = "Profile not found" });
        }

        return Ok(profile);
    }
}