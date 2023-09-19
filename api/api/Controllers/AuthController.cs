using api.DataAccess;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.Xml;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpGet("getUsers")]
    public async IAsyncEnumerable<ApplicationUser> GetUsers()
    {
        using(var myDbContext = new ApplicationDbContext())
        {
            if(myDbContext.applicationUsers != null)
            {
                var users = await myDbContext.applicationUsers.ToListAsync();

                foreach(var user in users)
                {
                    if(user != null)
                    {
                        yield return user;
                    }
                    yield break;
                }
                yield break;
            }
        }
        yield break;
    }

    /*[HttpPost("register")]
    public async Task<IActionResult> Register(string model)
    {
        // Validace, vytvoření uživatele, uložení do databáze
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string model)
    {
        // Validace, přihlášení uživatele
    }*/
}
