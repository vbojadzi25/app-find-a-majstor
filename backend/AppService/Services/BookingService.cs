using AppService.Models;

namespace AppService.Services;

public class BookingService : IBookingService
{
    private readonly List<Booking> _bookings = new();
    private readonly ITimeSlotService _timeSlotService;
    private int _nextId = 1;

    public BookingService(ITimeSlotService timeSlotService)
    {
        _timeSlotService = timeSlotService;
    }

    public async Task<Booking> CreateBookingAsync(int craftsmanId, int clientId, string clientEmail, CreateBookingRequest request)
    {
        // Verify time slot exists and is available
        var timeSlot = await _timeSlotService.GetTimeSlotByIdAsync(request.TimeSlotId);
        if (timeSlot == null)
        {
            throw new InvalidOperationException("Time slot not found");
        }

        if (!timeSlot.IsAvailable)
        {
            throw new InvalidOperationException("Time slot is no longer available");
        }

        if (timeSlot.CraftsmanId != craftsmanId)
        {
            throw new InvalidOperationException("Time slot does not belong to this craftsman");
        }

        // Check if time slot is in the future
        if (timeSlot.StartTime <= DateTime.UtcNow)
        {
            throw new InvalidOperationException("Cannot book past time slots");
        }

        var booking = new Booking
        {
            Id = _nextId++,
            CraftsmanId = craftsmanId,
            ClientId = clientId,
            ClientEmail = clientEmail,
            ClientName = request.ClientName,
            ClientPhone = request.ClientPhone,
            TimeSlotId = request.TimeSlotId,
            BookingDate = DateTime.UtcNow.Date,
            StartTime = timeSlot.StartTime,
            EndTime = timeSlot.EndTime,
            Status = BookingStatus.Pending,
            ServiceDescription = request.ServiceDescription,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _bookings.Add(booking);

        // Mark time slot as booked
        await _timeSlotService.MarkTimeSlotAsBookedAsync(request.TimeSlotId);

        return booking;
    }

    public Task<List<Booking>> GetBookingsByCraftsmanAsync(int craftsmanId)
    {
        var bookings = _bookings
            .Where(b => b.CraftsmanId == craftsmanId)
            .OrderByDescending(b => b.StartTime)
            .ToList();

        return Task.FromResult(bookings);
    }

    public Task<List<Booking>> GetBookingsByClientAsync(int clientId)
    {
        var bookings = _bookings
            .Where(b => b.ClientId == clientId)
            .OrderByDescending(b => b.StartTime)
            .ToList();

        return Task.FromResult(bookings);
    }

    public Task<Booking?> GetBookingByIdAsync(int bookingId)
    {
        var booking = _bookings.FirstOrDefault(b => b.Id == bookingId);
        return Task.FromResult(booking);
    }

    public async Task<Booking?> UpdateBookingStatusAsync(int bookingId, int craftsmanId, UpdateBookingStatusRequest request)
    {
        var booking = _bookings.FirstOrDefault(b => b.Id == bookingId && b.CraftsmanId == craftsmanId);
        if (booking == null)
        {
            return null;
        }

        var oldStatus = booking.Status;
        booking.Status = request.Status;
        booking.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrEmpty(request.Notes))
        {
            booking.Notes = request.Notes;
        }

        if (request.EstimatedPrice.HasValue)
        {
            booking.EstimatedPrice = request.EstimatedPrice.Value;
        }

        // If booking is cancelled or rejected, make the time slot available again
        if ((request.Status == BookingStatus.Cancelled || request.Status == BookingStatus.Rejected) &&
            oldStatus != BookingStatus.Cancelled && oldStatus != BookingStatus.Rejected)
        {
            await _timeSlotService.MarkTimeSlotAsAvailableAsync(booking.TimeSlotId);
        }

        return booking;
    }

    public async Task<bool> CancelBookingAsync(int bookingId, int userId, bool isCraftsman = false)
    {
        var booking = _bookings.FirstOrDefault(b => b.Id == bookingId);
        if (booking == null)
        {
            return false;
        }

        // Verify user has permission to cancel
        if (isCraftsman && booking.CraftsmanId != userId)
        {
            return false;
        }

        if (!isCraftsman && booking.ClientId != userId)
        {
            return false;
        }

        // Can only cancel pending or confirmed bookings
        if (booking.Status != BookingStatus.Pending && booking.Status != BookingStatus.Confirmed)
        {
            return false;
        }

        booking.Status = BookingStatus.Cancelled;
        booking.UpdatedAt = DateTime.UtcNow;

        // Make the time slot available again
        await _timeSlotService.MarkTimeSlotAsAvailableAsync(booking.TimeSlotId);

        return true;
    }
}