namespace AppService.Models;

public class SearchFilters
{
    public ServiceCategory? Category { get; set; }
    public string? Location { get; set; }
    public double? MinRating { get; set; }
    public string? SearchTerm { get; set; }
}