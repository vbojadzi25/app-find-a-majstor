using AppService.Models;

namespace AppService.Services;

public interface IBookingService
{
    Task<Booking> CreateBookingAsync(int craftsmanId, int clientId, string clientEmail, CreateBookingRequest request);
    Task<List<Booking>> GetBookingsByCraftsmanAsync(int craftsmanId);
    Task<List<Booking>> GetBookingsByClientAsync(int clientId);
    Task<Booking?> GetBookingByIdAsync(int bookingId);
    Task<Booking?> UpdateBookingStatusAsync(int bookingId, int craftsmanId, UpdateBookingStatusRequest request);
    Task<bool> CancelBookingAsync(int bookingId, int userId, bool isCraftsman = false);
}