using api.DataAccess;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Security.Cryptography.Xml;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    public readonly ApplicationDbContext _context;

    /*private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }
    */

    public AuthController()
    {
        this._context = new ApplicationDbContext();
    }

    [HttpGet("getUsers")]
    public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetUsers()
    {
        List<ApplicationUser> applicationUsers = new List<ApplicationUser>();
        int count = 0;
        using(_context)
        {
            if(_context.applicationUsers != null)
            {
                var users = await _context.applicationUsers.ToListAsync();
                
                foreach(var user in users)
                {
                    count++;
                    if(user != null)
                    {
                        applicationUsers.Add(user);
                    }
                }
            }
        }
        ApplicationUser user1 = new ApplicationUser()
        {
            Id = count.ToString(),
            Name = "bohdan",
            Email = "bohdan.kulchytskyy@seznam.cz",
            Password = "123456789Bk",
            Maps = new List<Map>()
        };
        applicationUsers.Add(user1);

        return Ok(applicationUsers);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register()

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
