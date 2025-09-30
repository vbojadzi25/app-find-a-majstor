using AppService.Models;

namespace AppService.Services;

public class CraftsmanService : ICraftsmanService
{
    private readonly List<CraftsmanProfile> _profiles = new();
    private int _nextId = 1;

    public Task<CraftsmanProfile?> GetProfileByUserIdAsync(int userId)
    {
        var profile = _profiles.FirstOrDefault(p => p.UserId == userId);
        return Task.FromResult(profile);
    }

    public Task<CraftsmanProfile?> GetProfileByIdAsync(int id)
    {
        var profile = _profiles.FirstOrDefault(p => p.Id == id);
        return Task.FromResult(profile);
    }

    public Task<CraftsmanProfile> CreateProfileAsync(int userId, string email, CreateProfileRequest request)
    {
        var profile = new CraftsmanProfile
        {
            Id = _nextId++,
            UserId = userId,
            Name = request.Name,
            Email = email,
            Phone = request.Phone,
            Qualifications = request.Qualifications,
            WorkingHours = request.WorkingHours,
            Category = request.Category,
            Location = request.Location,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _profiles.Add(profile);
        return Task.FromResult(profile);
    }

    public Task<CraftsmanProfile?> UpdateProfileAsync(int userId, CreateProfileRequest request)
    {
        var profile = _profiles.FirstOrDefault(p => p.UserId == userId);
        if (profile == null)
        {
            return Task.FromResult<CraftsmanProfile?>(null);
        }

        profile.Name = request.Name;
        profile.Phone = request.Phone;
        profile.Qualifications = request.Qualifications;
        profile.WorkingHours = request.WorkingHours;
        profile.Category = request.Category;
        profile.Location = request.Location;
        profile.UpdatedAt = DateTime.UtcNow;

        return Task.FromResult<CraftsmanProfile?>(profile);
    }

    public Task<List<CraftsmanProfile>> SearchCraftsmenAsync(SearchFilters filters)
    {
        var query = _profiles.AsQueryable();

        if (filters.Category.HasValue)
        {
            query = query.Where(p => p.Category == filters.Category.Value);
        }

        if (!string.IsNullOrWhiteSpace(filters.Location))
        {
            query = query.Where(p => p.Location.Contains(filters.Location, StringComparison.OrdinalIgnoreCase));
        }

        if (filters.MinRating.HasValue)
        {
            query = query.Where(p => p.AverageRating >= filters.MinRating.Value);
        }

        if (!string.IsNullOrWhiteSpace(filters.SearchTerm))
        {
            query = query.Where(p =>
                p.Name.Contains(filters.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                p.Qualifications.Contains(filters.SearchTerm, StringComparison.OrdinalIgnoreCase));
        }

        return Task.FromResult(query.ToList());
    }

    public Task<List<CraftsmanProfile>> GetAllCraftsmenAsync()
    {
        return Task.FromResult(_profiles.ToList());
    }
}