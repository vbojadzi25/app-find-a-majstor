using System.ComponentModel.DataAnnotations;

namespace AppService.Models;

public class CreateProfileRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string Qualifications { get; set; } = string.Empty;

    [Required]
    public string WorkingHours { get; set; } = string.Empty;

    [Required]
    public ServiceCategory Category { get; set; }

    [Required]
    public string Location { get; set; } = string.Empty;
}