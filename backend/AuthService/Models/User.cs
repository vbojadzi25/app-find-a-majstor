using System.Text.Json.Serialization;

namespace AuthService.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserRole
{
    Client,
    Craftsman,
    Admin
}