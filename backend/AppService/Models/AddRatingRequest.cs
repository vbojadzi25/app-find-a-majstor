using System.ComponentModel.DataAnnotations;

namespace AppService.Models;

public class AddRatingRequest
{
    [Required]
    [Range(1, 5)]
    public int Stars { get; set; }

    public string Comment { get; set; } = string.Empty;
}