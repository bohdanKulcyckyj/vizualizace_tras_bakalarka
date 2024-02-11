namespace api.Models
{
    public class MapModel
    {
        public MapModelCenter center { get; set; }
        public MapModelBBox bbox { get; set; }
        public int zoom { get; set; }
        public string? trailGpxUrl { get; set; }
        public List<MapModelUserAddedObject>? mapObjects { get; set; } = new List<MapModelUserAddedObject>();
    }
}
