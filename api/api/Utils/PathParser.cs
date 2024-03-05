using Dynastream.Fit;
using Microsoft.Azure.Cosmos.Linq;
using Newtonsoft.Json;
using Postmark.Model.MessageStreams;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using static System.Net.WebRequestMethods;
using DateTime = Dynastream.Fit.DateTime;

namespace api.Utils
{
    public class PathRecord
    {
        [JsonProperty("latitude")]
        public double? Latitude { get; set; }
        [JsonProperty("longitude")]
        public double? Longitude { get; set; }
        [JsonProperty("elevation")]
        public double? Elevation { get; set; }
        [JsonProperty("timestamp")]
        public string? Timestamp { get; set; } = "";
        public override string ToString()
        {
            return $"{Latitude}-{Longitude}-{Elevation}-{Timestamp}";
        }
    }
    public class PathParser
    {
        public static List<PathRecord> ParseGpxFile(IFormFile file)
        {
            List<PathRecord> gpxRecords = new List<PathRecord>();

            using (var stream = file.OpenReadStream())
            {
                XDocument doc = XDocument.Load(stream);

                XNamespace ns = "http://www.topografix.com/GPX/1/1";
                var trkpts = doc.Descendants(ns + "trkpt");

                foreach (var trkpt in trkpts)
                {
                    double latitude = double.Parse(trkpt.Attribute("lat").Value, CultureInfo.InvariantCulture);
                    double longitude = double.Parse(trkpt.Attribute("lon").Value, CultureInfo.InvariantCulture);
                    double elevation = double.Parse(trkpt.Element(ns + "ele").Value, CultureInfo.InvariantCulture);

                    string timestamp = trkpt.Element(ns + "time")?.Value ?? "";

                    PathRecord record = new PathRecord
                    {
                        Latitude = latitude,
                        Longitude = longitude,
                        Elevation = elevation,
                        Timestamp = timestamp
                    };

                    gpxRecords.Add(record);
                }
            }

            return gpxRecords;
        }
        public static async Task<List<PathRecord>> ParseFitFile(IFormFile file)
        {
            List<PathRecord> fitRecords = new List<PathRecord>();

            using (MemoryStream memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                memoryStream.Seek(0, SeekOrigin.Begin);

                Decode decode = new Decode();
                MesgBroadcaster broadcaster = new MesgBroadcaster();
                decode.MesgEvent += broadcaster.OnMesg;
                decode.MesgDefinitionEvent += broadcaster.OnMesgDefinition;

                broadcaster.RecordMesgEvent += (object sender, MesgEventArgs e) =>
                {
                    RecordMesg record = (RecordMesg)e.mesg;
                    double? latitude = null;
                    double? longitude = null;
                    double? elevation = null;

                    if(record.GetPositionLat().HasValue)
                    {
                        latitude = (double?)record.GetPositionLat().Value * 180.0 / Math.Pow(2, 31);
                    }

                    if(record.GetPositionLong().HasValue)
                    {
                        longitude = (double?)record.GetPositionLong().Value * 180.0 / Math.Pow(2, 31);
                    }

                    if(record.GetAltitude().HasValue)
                    {
                        elevation = (double?)record.GetAltitude().Value;
                    }

                    DateTime timestamp = record.GetTimestamp();
                    string formattedTimestamp = timestamp.ToString();
                    PathRecord fitRecord = new PathRecord
                    {
                        Latitude = latitude,
                        Longitude = longitude,
                        Elevation = elevation,
                        Timestamp = formattedTimestamp
                    };
                    Console.WriteLine(fitRecord);
                    fitRecords.Add(fitRecord);
                };
                decode.Read(memoryStream);
                return fitRecords;
            }
        }
    }
}
