namespace api.Models
{
    public class MapModel
    {
        public MapModelCenter center { get; set; }
        public MapModelBBox bbox { get; set; }
        public int zoom { get; set; }
        public string? trailUrl { get; set; }
        public string? trailColor { get; set; }
        public List<MapModelUserAddedObject>? mapObjects { get; set; } = new List<MapModelUserAddedObject>();
        public double? heightCoefficient { get; set; } = null;
        public string? textureTypeLabel { get; set; } = null;
        public bool animateTrail { get; set; } = true;
        public bool enableShadow { get; set; } = true;
        public bool enableSun { get; set; } = true;
        public int? lightX { get; set; }
        public int? lightY { get; set; } 
        public int? lightZ { get; set; }
    }
}
