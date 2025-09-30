using AppService.Models;

namespace AppService.Services;

public interface ITimeSlotService
{
    Task<TimeSlot> CreateTimeSlotAsync(int craftsmanId, CreateTimeSlotRequest request);
    Task<List<TimeSlot>> GetAvailableTimeSlotsAsync(int craftsmanId, DateTime? startDate = null, DateTime? endDate = null);
    Task<List<TimeSlot>> GetTimeSlotsByCraftsmanAsync(int craftsmanId);
    Task<TimeSlot?> GetTimeSlotByIdAsync(int timeSlotId);
    Task<bool> DeleteTimeSlotAsync(int craftsmanId, int timeSlotId);
    Task<bool> MarkTimeSlotAsBookedAsync(int timeSlotId);
    Task<bool> MarkTimeSlotAsAvailableAsync(int timeSlotId);
}