using AuthService.Models;

namespace AuthService.Services;

public interface IUserService
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<User> CreateUserAsync(RegisterRequest request);
    Task<User?> ValidateUserAsync(string email, string password);
    Task<List<User>> GetAllUsersAsync();
}