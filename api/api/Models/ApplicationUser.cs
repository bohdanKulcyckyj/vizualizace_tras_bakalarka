using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class ApplicationUser
    {
        [JsonProperty("id")]
        public string? Id { get; set; }
        [JsonProperty("email")]
        public string? Email { get; set; }
        [JsonProperty("password")]
        public string? Password { get; set; }
        [JsonProperty("name")]
        public string? Name { get; set; }
        [JsonProperty("maps")]
        public List<Map>? Maps { get; set; }
    }
}
