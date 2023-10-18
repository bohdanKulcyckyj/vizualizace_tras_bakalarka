namespace api.Models
{
    public class MapModelOptions
    {
        public MapModelCenter center { get; set; }
        public MapModelBBox bbox { get; set; }
        public int zoom { get; set; }
        public string trailGpxUrl { get; set; }
    }
}
