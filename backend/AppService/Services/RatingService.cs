using AppService.Models;

namespace AppService.Services;

public class RatingService : IRatingService
{
    private readonly List<Rating> _ratings = new();
    private readonly ICraftsmanService _craftsmanService;
    private int _nextId = 1;

    public RatingService(ICraftsmanService craftsmanService)
    {
        _craftsmanService = craftsmanService;
    }

    public async Task<Rating> AddRatingAsync(int craftsmanId, int clientId, string clientEmail, AddRatingRequest request)
    {
        var existingRating = _ratings.FirstOrDefault(r => r.CraftsmanId == craftsmanId && r.ClientId == clientId);

        if (existingRating != null)
        {
            existingRating.Stars = request.Stars;
            existingRating.Comment = request.Comment;
            existingRating.CreatedAt = DateTime.UtcNow;
        }
        else
        {
            existingRating = new Rating
            {
                Id = _nextId++,
                CraftsmanId = craftsmanId,
                ClientId = clientId,
                ClientEmail = clientEmail,
                Stars = request.Stars,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow
            };
            _ratings.Add(existingRating);
        }

        var craftsman = await _craftsmanService.GetProfileByIdAsync(craftsmanId);
        if (craftsman != null)
        {
            craftsman.Ratings = _ratings.Where(r => r.CraftsmanId == craftsmanId).ToList();
        }

        return existingRating;
    }

    public Task<List<Rating>> GetRatingsForCraftsmanAsync(int craftsmanId)
    {
        var ratings = _ratings.Where(r => r.CraftsmanId == craftsmanId).ToList();
        return Task.FromResult(ratings);
    }

    public Task<Rating?> GetExistingRatingAsync(int craftsmanId, int clientId)
    {
        var rating = _ratings.FirstOrDefault(r => r.CraftsmanId == craftsmanId && r.ClientId == clientId);
        return Task.FromResult(rating);
    }
}