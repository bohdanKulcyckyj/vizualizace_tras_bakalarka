using Newtonsoft.Json;

namespace api.Models
{
    public class Map
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public DateTime? CreatedAt { get; set; }
        public MapModel? MapModel { get; set; }
    }
}
