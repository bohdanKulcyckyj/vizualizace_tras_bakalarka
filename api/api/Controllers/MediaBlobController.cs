using api.Models.Forms;
using api.Services;
using Azure.Storage.Blobs;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Constraints;
using api.Utils;
using Dynastream.Fit;
using Newtonsoft.Json;

namespace api.Controllers
{
    [Route("api/blob")]
    [ApiController]
    [Authorize]
    public class MediaBlobController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IBlobService _blobService;

        public MediaBlobController(IConfiguration configuration, IBlobService blobService)
        {
            _configuration = configuration;
            _blobService = blobService;
        }
        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetFile(string fileName)
        {
            var data = await _blobService.GetBlobAsync(fileName);
            return File(data.Content, data.ContentType);
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllFiles()
        {
            return Ok(await _blobService.ListBlobsAsync());
        }
        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length <= 0)
            {
                return BadRequest("Invalid file");
            }

            try
            {
                string fitFileExtension = ".fit";
                var fileExtension = Path.GetExtension(file.FileName);
                bool hasFitExtension = string.Equals(fitFileExtension, fileExtension, StringComparison.OrdinalIgnoreCase);
                if (hasFitExtension)
                {
                    List<FitRecord> fitRecords = await FitParser.ParseFitFile(file);
                    string json = JsonConvert.SerializeObject(fitRecords);

                    using (var stream = new MemoryStream())
                    using (var writer = new StreamWriter(stream, leaveOpen: true))
                    {
                        writer.Write(json);
                        writer.Flush();
                        stream.Seek(0, SeekOrigin.Begin);

                        var generatedFitName = $"{Guid.NewGuid()}_fit_records.json";
                        var blobFitUri = await _blobService.UploadMemoryStreamAsync(stream, generatedFitName);

                        return Ok(new { file = blobFitUri });
                    }

                    // Potřebuju vytvořit json soubor a poslat ho do _blogService.UploadFileAsync
                }

                var generatedName = $"{Guid.NewGuid()}_{file.FileName}";
                var blobUri = await _blobService.UploadFileAsync(file, generatedName);

                return Ok(new { file = blobUri });
            }
            catch (RequestFailedException ex)
            {
                return StatusCode((int)ex.Status, ex.Message);
            }
        }
        [HttpDelete("{fileName}")]
        public async Task<IActionResult> DeleteFile(string fileName)
        {
            try
            {
                await _blobService.DeleteBlobAsync(fileName);
            } catch(Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok();
        }
    }
}
