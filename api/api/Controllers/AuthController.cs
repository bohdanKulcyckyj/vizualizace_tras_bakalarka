using api.DataAccess;
using api.Models;
using api.Models.DTO;
using api.Models.Forms;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Serialization.HybridRow;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography.Xml;
using System.Text;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly EmailSender _emailSender;

    public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, ApplicationDbContext context, EmailSender emailSender)
    {
        this._context = context;
        this._configuration = configuration;
        this._userManager = userManager;
        this._roleManager = roleManager;
        this._signInManager = signInManager;
        this._emailSender = emailSender;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
    {
        if (ModelState.IsValid)
        {
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name,
            };

            var savingUser = await _userManager.CreateAsync(user, model.Password);
            
            if (savingUser.Succeeded)
            {
                var token = GenerateJwtToken(user, "USER");
                await _userManager.AddToRoleAsync(user, "USER");
                await _signInManager.SignInAsync(user, isPersistent: false);

                var userRoles = await _userManager.GetRolesAsync(user);
                if (userRoles.Count() <= 0)
                {
                    return BadRequest(new { Message = "User has no assigned role" });
                }
                return Ok(new { token, user = new UserDTO(user, userRoles[0])});
            }
            else
            {
                return BadRequest(new { Errors = savingUser.Errors });
            }
        }
        return BadRequest(ModelState);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginViewModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                if(userRoles.Count() <= 0)
                {
                    return BadRequest(new { Message = "User has no assigned role" });
                }
                var token = GenerateJwtToken(user, userRoles[0]);
                await _signInManager.SignInAsync(user, isPersistent: false);

                return Ok(new { token, user = new UserDTO(user, userRoles[0]) });
            }
            else
            {
                return BadRequest(new { Message = "Incorrect credentials" });
            }
        }

        return BadRequest(ModelState);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var resetToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
                var resetLink = $"{_configuration.GetValue<string>("FrontendUrl")}/reset-password?token={resetToken}";
                var emailSubject = "Password Restore";
                var emailMessage = $"Use this lik for setting new password: {resetLink}";

                try
                {
                    await _emailSender.SendEmailAsync(model.Email, emailSubject, emailMessage);
                    return Ok(new { Message = "The password reset email has been sent.", resetToken });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { Message = $"Failed to send e-mail: {ex.Message}" });
                }
            }
            else
            {
                return BadRequest(new { Message = "The user with this email does not exist." });
            }
        }

        return BadRequest(ModelState);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordVeiwModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            var tokenBytes = WebEncoders.Base64UrlDecode(model.Token);
            var decordedToken = Encoding.UTF8.GetString(tokenBytes);

            if (user != null)
            {
                var result = await _userManager.ResetPasswordAsync(user, decordedToken, model.NewPassword);

                if (result.Succeeded)
                {
                    return Ok(new { Message = "Heslo bylo úspěšně obnoveno." });
                }
                else
                {
                    return BadRequest(new { Errors = result.Errors });
                }
            }
            else
            {
                return BadRequest(new { Message = "Uživatel s tímto e-mailem neexistuje." });
            }
        }

        return BadRequest(ModelState);
    }

    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok("Uživatel byl odhlašen");
    }
    private string GenerateJwtToken(ApplicationUser user, string role)
    {        
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(JwtRegisteredClaimNames.NameId, user.Id),
            new Claim(ClaimTypes.Role, role),
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _configuration["Jwt:JwtIssuer"],
            _configuration["Jwt:JwtAudience"],
            claims,
            expires: DateTime.Now.AddMinutes(60),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
