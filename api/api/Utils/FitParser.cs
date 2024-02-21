using Dynastream.Fit;
using Postmark.Model.MessageStreams;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using DateTime = Dynastream.Fit.DateTime;

namespace api.Utils
{
    public class FitRecord
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Elevation { get; set; }
        public DateTime Timestamp { get; set; } = new DateTime(0);
        public override string ToString()
        {
            return $"{Latitude}-{Longitude}-{Elevation}-{Timestamp}";
        }
    }
    public class FitParser
    {
        public static async Task<List<RecordMesg>> ParseFitFile(Stream fitFileStream)
        {
            List<RecordMesg> fitRecords = new List<RecordMesg>();

            using (fitFileStream)
            {
                Decode decode = new Decode();
                MesgBroadcaster broadcaster = new MesgBroadcaster();

                broadcaster.RecordMesgEvent += (object sender, MesgEventArgs e) =>
                {
                    RecordMesg record = (RecordMesg)e.mesg;
                    fitRecords.Add(record);
                };

                decode.Read(fitFileStream);
                return fitRecords;
            }
        }
    }
}
