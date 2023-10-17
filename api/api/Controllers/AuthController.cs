using api.DataAccess;
using api.Models;
using api.Models.Forms;
using api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Azure.Cosmos;
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
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly EmailSender _emailSender;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, ApplicationDbContext context, EmailSender emailSender)
    {
        this._context = context;
        this._configuration = configuration;
        this._userManager = userManager;
        this._signInManager = signInManager;
        this._emailSender = emailSender;
    }

    [HttpGet("get-users")]
    public async Task<IActionResult> GetUsers()
    {
        var container = _context.GetUserContainer();
        var sqlQueryText = "SELECT * FROM c";
        var queryDefinition = new QueryDefinition(sqlQueryText);

        var queryResultSetIterator = container.GetItemQueryIterator<ApplicationUser>(queryDefinition);

        var items = new List<ApplicationUser>();
        while (queryResultSetIterator.HasMoreResults)
        {
            var currentResultSet = await queryResultSetIterator.ReadNextAsync();
            items.AddRange(currentResultSet);
        }

        return Ok(items);
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

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Vytvoření uživatele bylo úspěšné, můžeme uložit uživatele do Cosmos DB
                //await _context.GetUserContainer().CreateItemAsync(user);
                // Nyní můžeme generovat a vrátit JWT token
                var token = GenerateJwtToken(user);

                return Ok(new { token });
            }
            else
            {
                // Registrace selhala, vrátit chybové zprávy
                return BadRequest(new { Errors = result.Errors });
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
                // Uživatel byl úspěšně přihlášen, generovat a vrátit JWT token
                var token = GenerateJwtToken(user);

                return Ok(new { token });
            }
            else
            {
                // Přihlášení selhalo, vrátit chybovou zprávu
                return BadRequest(new { Message = "Nesprávné přihlašovací údaje." });
            }
        }

        return BadRequest(ModelState);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordVewModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                var emailSubject = "Obnova hesla";
                var emailMessage = $"Pro obnovu hesla použijte tento token: {token}";

                try
                {
                    await _emailSender.SendEmailAsync(model.Email, emailSubject, emailMessage);
                    return Ok(new { Message = "E-mail pro obnovu hesla byl odeslán.", Token = token });
                }
                catch (Exception ex)
                {
                    // Zpracování chyby při odesílání e-mailu
                    return BadRequest(new { Message = $"Nepodařilo se odeslat e-mail: {ex.Message}" });
                }

                return Ok(new { Message = "E-mail pro obnovu hesla byl odeslán. ", Token = token });
            }
            else
            {
                return BadRequest(new { Message = "Uživatel s tímto e-mailem neexistuje." });
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

            if (user != null)
            {
                var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);

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



    private string GenerateJwtToken(ApplicationUser user)
    {
        var claims = new[]
        {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.NameId, user.Id),
            };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("A247DB24-C8AE-4B8A-8CB2-59637754BF2F"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _configuration["JwtIssuer"],
            _configuration["JwtIssuer"],
            claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
