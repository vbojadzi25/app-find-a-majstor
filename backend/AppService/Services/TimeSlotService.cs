using AppService.Models;

namespace AppService.Services;

public class TimeSlotService : ITimeSlotService
{
    private readonly List<TimeSlot> _timeSlots = new();
    private int _nextId = 1;

    public Task<TimeSlot> CreateTimeSlotAsync(int craftsmanId, CreateTimeSlotRequest request)
    {
        // Validate time slot doesn't overlap with existing ones
        var existingSlots = _timeSlots.Where(ts => ts.CraftsmanId == craftsmanId).ToList();

        foreach (var existingSlot in existingSlots)
        {
            if (IsOverlapping(request.StartTime, request.EndTime, existingSlot.StartTime, existingSlot.EndTime))
            {
                throw new InvalidOperationException("Time slot overlaps with an existing slot");
            }
        }

        var timeSlot = new TimeSlot
        {
            Id = _nextId++,
            CraftsmanId = craftsmanId,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Description = request.Description,
            IsAvailable = true,
            CreatedAt = DateTime.UtcNow
        };

        _timeSlots.Add(timeSlot);
        return Task.FromResult(timeSlot);
    }

    public Task<List<TimeSlot>> GetAvailableTimeSlotsAsync(int craftsmanId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _timeSlots.Where(ts => ts.CraftsmanId == craftsmanId && ts.IsAvailable);

        if (startDate.HasValue)
        {
            query = query.Where(ts => ts.StartTime >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(ts => ts.EndTime <= endDate.Value);
        }

        // Only return future time slots
        query = query.Where(ts => ts.StartTime > DateTime.UtcNow);

        var result = query.OrderBy(ts => ts.StartTime).ToList();
        return Task.FromResult(result);
    }

    public Task<List<TimeSlot>> GetTimeSlotsByCraftsmanAsync(int craftsmanId)
    {
        var timeSlots = _timeSlots
            .Where(ts => ts.CraftsmanId == craftsmanId)
            .OrderBy(ts => ts.StartTime)
            .ToList();

        return Task.FromResult(timeSlots);
    }

    public Task<TimeSlot?> GetTimeSlotByIdAsync(int timeSlotId)
    {
        var timeSlot = _timeSlots.FirstOrDefault(ts => ts.Id == timeSlotId);
        return Task.FromResult(timeSlot);
    }

    public Task<bool> DeleteTimeSlotAsync(int craftsmanId, int timeSlotId)
    {
        var timeSlot = _timeSlots.FirstOrDefault(ts => ts.Id == timeSlotId && ts.CraftsmanId == craftsmanId);
        if (timeSlot == null)
        {
            return Task.FromResult(false);
        }

        _timeSlots.Remove(timeSlot);
        return Task.FromResult(true);
    }

    public Task<bool> MarkTimeSlotAsBookedAsync(int timeSlotId)
    {
        var timeSlot = _timeSlots.FirstOrDefault(ts => ts.Id == timeSlotId);
        if (timeSlot == null)
        {
            return Task.FromResult(false);
        }

        timeSlot.IsAvailable = false;
        return Task.FromResult(true);
    }

    public Task<bool> MarkTimeSlotAsAvailableAsync(int timeSlotId)
    {
        var timeSlot = _timeSlots.FirstOrDefault(ts => ts.Id == timeSlotId);
        if (timeSlot == null)
        {
            return Task.FromResult(false);
        }

        timeSlot.IsAvailable = true;
        return Task.FromResult(true);
    }

    private static bool IsOverlapping(DateTime start1, DateTime end1, DateTime start2, DateTime end2)
    {
        return start1 < end2 && start2 < end1;
    }
}