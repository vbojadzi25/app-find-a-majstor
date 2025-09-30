using AppService.Models;

namespace AppService.Services;

public interface IRatingService
{
    Task<Rating> AddRatingAsync(int craftsmanId, int clientId, string clientEmail, AddRatingRequest request);
    Task<List<Rating>> GetRatingsForCraftsmanAsync(int craftsmanId);
    Task<Rating?> GetExistingRatingAsync(int craftsmanId, int clientId);
}