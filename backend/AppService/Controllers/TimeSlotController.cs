using System.Security.Claims;
using AppService.Models;
using AppService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimeSlotController : ControllerBase
{
    private readonly ITimeSlotService _timeSlotService;
    private readonly ICraftsmanService _craftsmanService;

    public TimeSlotController(ITimeSlotService timeSlotService, ICraftsmanService craftsmanService)
    {
        _timeSlotService = timeSlotService;
        _craftsmanService = craftsmanService;
    }

    [HttpGet("craftsman/{craftsmanId}/available")]
    public async Task<ActionResult<List<TimeSlot>>> GetAvailableTimeSlots(
        int craftsmanId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var craftsman = await _craftsmanService.GetProfileByIdAsync(craftsmanId);
        if (craftsman == null)
        {
            return NotFound(new { message = "Craftsman not found" });
        }

        var timeSlots = await _timeSlotService.GetAvailableTimeSlotsAsync(craftsmanId, startDate, endDate);
        return Ok(timeSlots);
    }

    [Authorize(Roles = "Craftsman")]
    [HttpPost("craftsman/{craftsmanId}")]
    public async Task<ActionResult<TimeSlot>> CreateTimeSlot(int craftsmanId, [FromBody] CreateTimeSlotRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Verify the craftsman profile belongs to the authenticated user
        var craftsman = await _craftsmanService.GetProfileByUserIdAsync(userId);
        if (craftsman == null || craftsman.Id != craftsmanId)
        {
            return Forbid();
        }

        // Validate time slot
        if (request.StartTime >= request.EndTime)
        {
            return BadRequest(new { message = "Start time must be before end time" });
        }

        if (request.StartTime <= DateTime.UtcNow)
        {
            return BadRequest(new { message = "Cannot create time slots in the past" });
        }

        try
        {
            var timeSlot = await _timeSlotService.CreateTimeSlotAsync(craftsmanId, request);
            return CreatedAtAction(nameof(GetTimeSlotById), new { id = timeSlot.Id }, timeSlot);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "Craftsman")]
    [HttpPost("me")]
    public async Task<ActionResult<TimeSlot>> CreateMyTimeSlot([FromBody] CreateTimeSlotRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var craftsman = await _craftsmanService.GetProfileByUserIdAsync(userId);
        if (craftsman == null)
        {
            return NotFound(new { message = "Craftsman profile not found" });
        }

        // Validate time slot
        if (request.StartTime >= request.EndTime)
        {
            return BadRequest(new { message = "Start time must be before end time" });
        }

        if (request.StartTime <= DateTime.UtcNow)
        {
            return BadRequest(new { message = "Cannot create time slots in the past" });
        }

        try
        {
            var timeSlot = await _timeSlotService.CreateTimeSlotAsync(craftsman.Id, request);
            return CreatedAtAction(nameof(GetTimeSlotById), new { id = timeSlot.Id }, timeSlot);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "Craftsman")]
    [HttpGet("craftsman/me")]
    public async Task<ActionResult<List<TimeSlot>>> GetMyTimeSlots()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var craftsman = await _craftsmanService.GetProfileByUserIdAsync(userId);
        if (craftsman == null)
        {
            return NotFound(new { message = "Craftsman profile not found" });
        }

        var timeSlots = await _timeSlotService.GetTimeSlotsByCraftsmanAsync(craftsman.Id);
        return Ok(timeSlots);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TimeSlot>> GetTimeSlotById(int id)
    {
        var timeSlot = await _timeSlotService.GetTimeSlotByIdAsync(id);
        if (timeSlot == null)
        {
            return NotFound();
        }

        return Ok(timeSlot);
    }

    [Authorize(Roles = "Craftsman")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTimeSlot(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var craftsman = await _craftsmanService.GetProfileByUserIdAsync(userId);
        if (craftsman == null)
        {
            return NotFound(new { message = "Craftsman profile not found" });
        }

        var success = await _timeSlotService.DeleteTimeSlotAsync(craftsman.Id, id);
        if (!success)
        {
            return NotFound(new { message = "Time slot not found" });
        }

        return NoContent();
    }
}