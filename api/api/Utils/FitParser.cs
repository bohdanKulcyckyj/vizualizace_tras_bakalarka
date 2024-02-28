using Dynastream.Fit;
using Postmark.Model.MessageStreams;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;
using DateTime = Dynastream.Fit.DateTime;

namespace api.Utils
{
    public class FitRecord
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Elevation { get; set; }
        public DateTime? Timestamp { get; set; } = null;
        public override string ToString()
        {
            return $"{Latitude}-{Longitude}-{Elevation}-{Timestamp}";
        }
    }
    public class FitParser
    {
        public static async Task<List<FitRecord>> ParseFitFile(IFormFile file)
        {
            List<FitRecord> fitRecords = new List<FitRecord>();

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
                    if (record.GetPositionLat() != null && record.GetPositionLong() != null && record.GetAltitude() != null)
                    {
                        double latitude = record.GetPositionLat().Value * 180.0 / Math.Pow(2, 31);
                        double longitude = record.GetPositionLong().Value * 180.0 / Math.Pow(2, 31);
                        double elevation = record.GetAltitude().Value;
                        DateTime timestamp = record.GetTimestamp();
                        FitRecord fitRecord = new FitRecord
                        {
                            Latitude = latitude,
                            Longitude = longitude,
                            Elevation = elevation,
                            Timestamp = timestamp
                        };
                        fitRecords.Add(fitRecord);
                    };
                };
                decode.Read(memoryStream);
                return fitRecords;
            }
        }
    }
}
