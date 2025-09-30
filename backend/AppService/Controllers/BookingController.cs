using System.Security.Claims;
using AppService.Models;
using AppService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly ICraftsmanService _craftsmanService;

    public BookingController(IBookingService bookingService, ICraftsmanService craftsmanService)
    {
        _bookingService = bookingService;
        _craftsmanService = craftsmanService;
    }

    [Authorize(Roles = "Client")]
    [HttpPost("craftsman/{craftsmanId}")]
    public async Task<ActionResult<Booking>> CreateBooking(int craftsmanId, [FromBody] CreateBookingRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var clientId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var clientEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";

        var craftsman = await _craftsmanService.GetProfileByIdAsync(craftsmanId);
        if (craftsman == null)
        {
            return NotFound(new { message = "Craftsman not found" });
        }

        try
        {
            var booking = await _bookingService.CreateBookingAsync(craftsmanId, clientId, clientEmail, request);
            return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "Client")]
    [HttpGet("client/me")]
    public async Task<ActionResult<List<Booking>>> GetMyBookings()
    {
        var clientId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var bookings = await _bookingService.GetBookingsByClientAsync(clientId);
        return Ok(bookings);
    }

    [Authorize(Roles = "Craftsman")]
    [HttpGet("craftsman/me")]
    public async Task<ActionResult<List<Booking>>> GetMyCraftsmanBookings()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var craftsman = await _craftsmanService.GetProfileByUserIdAsync(userId);
        if (craftsman == null)
        {
            return NotFound(new { message = "Craftsman profile not found" });
        }

        var bookings = await _bookingService.GetBookingsByCraftsmanAsync(craftsman.Id);
        return Ok(bookings);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<Booking>> GetBookingById(int id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        if (booking == null)
        {
            return NotFound();
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Check if user has permission to view this booking
        bool hasPermission = false;

        if (userRole == "Client" && booking.ClientId == userId)
        {
            hasPermission = true;
        }
        else if (userRole == "Craftsman")
        {
            var craftsman = await _craftsmanService.GetProfileByUserIdAsync(userId);
            if (craftsman != null && booking.CraftsmanId == craftsman.Id)
            {
                hasPermission = true;
            }
        }

        if (!hasPermission)
        {
            return Forbid();
        }

        return Ok(booking);
    }

    [Authorize(Roles = "Craftsman")]
    [HttpPut("{id}/status")]
    public async Task<ActionResult<Booking>> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusRequest request)
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

        var booking = await _bookingService.UpdateBookingStatusAsync(id, craftsman.Id, request);
        if (booking == null)
        {
            return NotFound(new { message = "Booking not found" });
        }

        return Ok(booking);
    }

    [Authorize]
    [HttpPut("{id}/cancel")]
    public async Task<ActionResult> CancelBooking(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        bool isCraftsman = userRole == "Craftsman";

        var success = await _bookingService.CancelBookingAsync(id, userId, isCraftsman);
        if (!success)
        {
            return NotFound(new { message = "Booking not found or cannot be cancelled" });
        }

        return Ok(new { message = "Booking cancelled successfully" });
    }
}