using Newtonsoft.Json;

namespace api.Models
{
    public class Map
    {
        [JsonProperty("id")]
        public string? Id { get; set; }
        [JsonProperty("name")]
        public string? Name { get; set; }
    }
}
