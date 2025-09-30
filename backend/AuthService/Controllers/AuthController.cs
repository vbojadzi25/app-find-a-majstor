using AuthService.Models;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IJwtService _jwtService;

    public AuthController(IUserService userService, IJwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingUser = await _userService.GetUserByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return Conflict(new { message = "User with this email already exists" });
        }

        var user = await _userService.CreateUserAsync(request);
        var token = _jwtService.GenerateToken(user);

        var response = new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email,
            Role = user.Role
        };

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userService.ValidateUserAsync(request.Email, request.Password);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        var token = _jwtService.GenerateToken(user);

        var response = new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email,
            Role = user.Role
        };

        return Ok(response);
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<User>>> GetUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users.Select(u => new { u.Id, u.Email, u.Role, u.CreatedAt }));
    }
}