using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class ApplicationUser : IdentityUser
    {
        [JsonProperty("id")]
        public override string? Id { get; set; }
        [JsonProperty("email")]
        public override string? Email { get; set; }
        [JsonProperty("password")]
        public string? Password { get; set; }
        [JsonProperty("name")]
        public string? Name { get; set; }
        [JsonProperty("maps")]
        public List<Map>? Maps { get; set; }
    }
}
