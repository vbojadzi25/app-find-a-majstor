using System.Text.Json.Serialization;

namespace AppService.Models;

public class CraftsmanProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Qualifications { get; set; } = string.Empty;
    public string WorkingHours { get; set; } = string.Empty;
    public ServiceCategory Category { get; set; }
    public string Location { get; set; } = string.Empty;
    public List<Rating> Ratings { get; set; } = new();
    public double AverageRating => Ratings.Any() ? Ratings.Average(r => r.Stars) : 0;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ServiceCategory
{
    Electrician,
    Plumber,
    Carpenter,
    Painter,
    Mason,
    Locksmith,
    Gardener,
    Cleaner,
    Mechanic,
    Other
}