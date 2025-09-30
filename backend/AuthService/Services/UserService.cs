using AuthService.Models;
using BCrypt.Net;

namespace AuthService.Services;

public class UserService : IUserService
{
    private readonly List<User> _users = new();
    private int _nextId = 1;

    public Task<User?> GetUserByEmailAsync(string email)
    {
        var user = _users.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(user);
    }

    public Task<User> CreateUserAsync(RegisterRequest request)
    {
        var user = new User
        {
            Id = _nextId++,
            Email = request.Email.ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        _users.Add(user);
        return Task.FromResult(user);
    }

    public Task<User?> ValidateUserAsync(string email, string password)
    {
        var user = _users.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            return Task.FromResult<User?>(null);
        }

        return Task.FromResult<User?>(user);
    }

    public Task<List<User>> GetAllUsersAsync()
    {
        return Task.FromResult(_users.ToList());
    }
}