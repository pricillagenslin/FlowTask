using FlowTask.DTOs;
using FlowTask.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlowTask.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterRequest request)
    {
        try
        {
            var user = _authService.Register(request);

            return Ok(new
            {
                message = "Registration successful",
                userId = user.Id,
                name = user.Name,
                email = user.Email
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "REGISTER ERROR");
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        try
        {
            var token = _authService.Login(request);

            if (token == null)
            {
                return Unauthorized("Invalid email or password");
            }

            return Ok(new
            {
                message = "Login successful",
                token = token
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "LOGIN ERROR");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        return Ok(new
        {
            message = "Logout successful"
        });
    }
}