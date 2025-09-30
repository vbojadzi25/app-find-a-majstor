using System.Text.Json.Serialization;

namespace AppService.Models;

public class TimeSlot
{
    public int Id { get; set; }
    public int CraftsmanId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class Booking
{
    public int Id { get; set; }
    public int CraftsmanId { get; set; }
    public int ClientId { get; set; }
    public string ClientEmail { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public int TimeSlotId { get; set; }
    public DateTime BookingDate { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public BookingStatus Status { get; set; }
    public string ServiceDescription { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public decimal? EstimatedPrice { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum BookingStatus
{
    Pending,
    Confirmed,
    InProgress,
    Completed,
    Cancelled,
    Rejected
}