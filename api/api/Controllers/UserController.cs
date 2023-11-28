using api.DataAccess;
using api.Models;
using api.Models.Forms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using System.Data;

namespace api.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, ApplicationDbContext context)
        {
            this._context = context;
            this._configuration = configuration;
            this._userManager = userManager;
            this._roleManager = roleManager;
            this._signInManager = signInManager;
        }

        [HttpGet("all-users")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetUsers()
        {
            var currentUser = await _userManager.FindByEmailAsync(User.Identity.Name);
            if (currentUser == null) return Unauthorized();


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

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> userDetail()
        {
            var currentUser = await _userManager.FindByEmailAsync(User.Identity.Name);
            if (currentUser == null) return Unauthorized();

            return Ok(currentUser);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> userDetailChange([FromBody] UserProfileViewModel um)
        {
            var currentUser = await _userManager.FindByEmailAsync(User.Identity.Name);
            if (currentUser == null) return Unauthorized();
            currentUser.Name = um.Name;
            currentUser.Email = um.Email;
            _context.SaveChanges();

            return Ok(new {Message = "Your profile was successfully updated"});
        }

        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> deleteUser(string userId)
        {
            var userToDelete = await _userManager.FindByIdAsync(userId);
            if (userToDelete == null) return NotFound();

            var result = await _userManager.DeleteAsync(userToDelete);
            if (result.Succeeded)
            {
                return Ok($"User with Id {userId} deleted successfully.");
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

    }
}
