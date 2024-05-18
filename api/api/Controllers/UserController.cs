using api.DataAccess;
using api.Models;
using api.Models.DTO;
using api.Models.Forms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using System.Data;

namespace api.Controllers
{
    [ApiController]
    [Route("api/users")]
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

        [HttpGet]
        [Authorize(Roles = "Admin")]
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

        [HttpGet("{userId}")]
        [Authorize]
        public async Task<IActionResult> userProfile(string userId)
        {
            var currentUser = await _userManager.FindByEmailAsync(User.Identity.Name);
            if (currentUser == null) return NotFound();

            var userRoles = await _userManager.GetRolesAsync(currentUser);
            if (userRoles.Count() <= 0)
            {
                return BadRequest(new { Message = "User has no assigned role" });
            }
            if (currentUser.Id == userId || userRoles[0] == "Admin")
            {
                UserDTO userData = new UserDTO(currentUser, userRoles[0]);

                return Ok(userData);
            }

            return Unauthorized();
        }

        [HttpPost("{userId}")]
        [Authorize]
        public async Task<IActionResult> userDetailChange(string userId, [FromBody] UserProfileViewModel um)
        {
            var currentUser = await _userManager.FindByEmailAsync(User.Identity.Name);
            if (currentUser == null || currentUser.Id != userId) return Unauthorized();
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
