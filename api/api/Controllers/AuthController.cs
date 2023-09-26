using api.DataAccess;
using api.Models;
using api.Models.Forms;
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


    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, ApplicationDbContext context)
    {
        this._context = context;
        this._configuration = configuration;
        this._userManager = userManager;
        this._signInManager = signInManager;
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
                await _context.GetUserContainer().CreateItemAsync(user);

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

    private string GenerateJwtToken(ApplicationUser user)
    {
        var claims = new[]
        {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.NameId, user.Id),
            };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _configuration["JwtIssuer"],
            _configuration["JwtIssuer"],
            claims,
            expires: DateTime.Now.AddMinutes(30), // Nastavte platnost tokenu dle vašich potřeb
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
