using System.ComponentModel.DataAnnotations;

namespace AppService.Models;

public class CreateTimeSlotRequest
{
    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }

    public string? Description { get; set; }
}

public class CreateBookingRequest
{
    [Required]
    public int TimeSlotId { get; set; }

    [Required]
    public string ServiceDescription { get; set; } = string.Empty;

    [Required]
    public string ClientName { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string ClientPhone { get; set; } = string.Empty;

    public string? Notes { get; set; }
}

public class UpdateBookingStatusRequest
{
    [Required]
    public BookingStatus Status { get; set; }

    public string? Notes { get; set; }
    public decimal? EstimatedPrice { get; set; }
}