using api.Models;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace api.Services
{
    public class OverpassApi
    {
        private readonly MapModelBBox _bbox;
        private readonly HttpClient _httpClient;

        public OverpassApi(MapModelBBox bbox)
        {
            _bbox = bbox ?? throw new ArgumentNullException(nameof(bbox));
            _httpClient = new HttpClient();
        }

        public async Task<string> GetMapPoints()
        {
            try
            {
                string overpassUrl = "https://overpass-api.de/api/interpreter";
                string requestBody = @"
                    [bbox: {{bbox}}]
                    [out:json]
                    [timeout:90]
                    ;
                    (
                        node[""natural""=""peak""]({{bbox}});
                        node[""historic""=""castle""]({{bbox}});
                        node[""tourism""=""monument""]({{bbox}});
                        node[""tourism""=""alpine_hut""]({{bbox}});
                        node[""tourism""=""viewpoint""]({{bbox}});
                        node[""man_made""=""tower""]({{bbox}});
                        node[""waterway""=""dam""]({{bbox}});
                        node[""water""=""reservoir""]({{bbox}});
                    );
                    out geom;";

                requestBody = requestBody.Replace("{{bbox}}", $"{_bbox.southWest.lat.ToString(System.Globalization.CultureInfo.InvariantCulture)},{_bbox.southWest.lng.ToString(System.Globalization.CultureInfo.InvariantCulture)},{_bbox.northEast.lat.ToString(System.Globalization.CultureInfo.InvariantCulture)},{_bbox.northEast.lng.ToString(System.Globalization.CultureInfo.InvariantCulture)}");

                var content = new StringContent($"data={Uri.EscapeDataString(requestBody)}", Encoding.UTF8, "application/x-www-form-urlencoded");

                HttpResponseMessage response = await _httpClient.PostAsync(overpassUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    return jsonResponse;
                }
                else
                {
                    Console.WriteLine($"Overpass API request failed with status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while making Overpass API request: {ex.Message}");
            }

            return "";
        }
    }
}
