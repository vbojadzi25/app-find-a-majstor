using AppService.Models;

namespace AppService.Services;

public interface ICraftsmanService
{
    Task<CraftsmanProfile?> GetProfileByUserIdAsync(int userId);
    Task<CraftsmanProfile?> GetProfileByIdAsync(int id);
    Task<CraftsmanProfile> CreateProfileAsync(int userId, string email, CreateProfileRequest request);
    Task<CraftsmanProfile?> UpdateProfileAsync(int userId, CreateProfileRequest request);
    Task<List<CraftsmanProfile>> SearchCraftsmenAsync(SearchFilters filters);
    Task<List<CraftsmanProfile>> GetAllCraftsmenAsync();
}