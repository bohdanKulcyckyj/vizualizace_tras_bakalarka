using api.DataAccess;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
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

    public AuthController(ApplicationDbContext context)
    {
        this._context = context;
    }

    [HttpGet("getUsers")]
    public async Task<IActionResult> GetUsers()
    {
        var container = _context.GetContainer();
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
}
