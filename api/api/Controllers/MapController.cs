using api.DataAccess;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Azure.Cosmos;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography.Xml;
using System.Text;

namespace api.Controllers
{
    [Route("api/map")]
    [ApiController]
    public class MapController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public MapController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, ApplicationDbContext context, IWebHostEnvironment hostingEnvironment)
        {
            this._context = context;
            this._configuration = configuration;
            this._userManager = userManager;
            this._roleManager = roleManager;
            this._signInManager = signInManager;
            this._hostingEnvironment = hostingEnvironment;
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> createNewMap([FromBody] Map m)
        {
            var currentUser = await _userManager.FindByEmailAsync(User.Identity.Name);
            if(currentUser == null)
            {
                return NotFound();
            }
            if((ModelState.IsValid))
            {
                m.Id = Guid.NewGuid().ToString("N");
                currentUser.Maps.Add(m);
                _context.SaveChanges();
                
                return Ok(m);
            } else
            {
                return BadRequest(new { Message = "Invalid data format" });
            }

            return BadRequest(new {Message = "Something went wrong"});
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> getUserMaps()
        {
            var currentUser = await _userManager.FindByEmailAsync(User.Identity.Name);
            if (currentUser == null)
            {
                return NotFound();
            }

            return Ok(currentUser.Maps);

            return BadRequest(new { Message = "Something went wrong" });
        }

        [HttpGet("all-maps")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> getAllMaps()
        {
            try
            {
                List<Map> maps = new List<Map>();
                var users = await _context.Users.ToListAsync<ApplicationUser>();
                foreach (var user in users)
                {
                    foreach(var map in user.Maps)
                    {
                        maps.Add(map);  
                    }
                }

                return Ok(maps);
            }
            catch(Exception e)
            {
                return BadRequest(new { Message = e.Message });
            }
        }

        [HttpGet("{mapId}")]
        public async Task<IActionResult> getMapById(string mapId)
        {
            /*var currentUser = await _userManager.FindByEmailAsync(User.Identity.Name);
            if (currentUser == null)
            {
                return NotFound();
            }*/

            var map = _context.getMapById(mapId);

            if (map == null)
            {
                return NotFound();
            }

            return Ok(map);
        }

        [HttpPost("{mapId}")]
        [Authorize]
        public async Task<IActionResult> editMap(string mapId, [FromBody] Map m)
        {
            var currentUser = await _userManager.FindByEmailAsync(User.Identity.Name);
            if (currentUser == null)
            {
                return NotFound();
            }

            var map = currentUser.Maps.FirstOrDefault(m => m.Id == mapId);

            if (map == null)
            {
                return NotFound();
            }
            map.Name = m.Name;
            map.MapModel = m.MapModel;
            _context.SaveChanges();

            return Ok(new { Message = "Your map was successfully changed"});
        }

        [HttpPost("upload/gpx")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadGpx(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Invalid file");
            }

            try
            {
                var uniqueFileName = Guid.NewGuid().ToString("N") + "_" + file.FileName;
                var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "gpx", uniqueFileName);

                // Save the file to the server
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                return Ok(new { fileName = uniqueFileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpDelete("{mapId}")]
        [Authorize]
        public async Task<IActionResult> deleteMap(string mapId)
        {
            var currentUser = await _userManager.FindByEmailAsync(User.Identity.Name);
            if (currentUser == null)
            {
                return NotFound();
            }

            var map = currentUser.Maps.FirstOrDefault(m => m.Id == mapId);

            if (map == null)
            {
                return NotFound();
            }
            currentUser.Maps.Remove(map);
            await _context.SaveChangesAsync();

            return Ok(map);
        }
    }
}
