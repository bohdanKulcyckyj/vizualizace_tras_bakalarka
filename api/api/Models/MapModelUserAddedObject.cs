namespace api.Models
{
    public class MapModelUserAddedObject
    {
        public string? id { get; set; }
        public string? pinType { get; set; }
        public string? label { get; set; }
        public string? color { get; set; }
        public List<string>? images { get; set; }
        public float? x { get; set; }
        public float? y { get; set; }
        public float? z { get; set; }
    }
}
