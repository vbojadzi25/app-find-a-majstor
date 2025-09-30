namespace AppService.Models;

public class Rating
{
    public int Id { get; set; }
    public int CraftsmanId { get; set; }
    public int ClientId { get; set; }
    public string ClientEmail { get; set; } = string.Empty;
    public int Stars { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}