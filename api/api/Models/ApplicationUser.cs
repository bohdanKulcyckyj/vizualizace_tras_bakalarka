using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public override string? Id { get; set; }
        public override string? Email { get; set; }
        public string? RoleId { get; set; }
        public string? Name { get; set; }
        public List<Map>? Maps { get; set; } = new List<Map>();
    }
}
