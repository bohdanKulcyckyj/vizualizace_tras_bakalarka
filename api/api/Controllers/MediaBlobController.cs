using api.Models.Forms;
using api.Services;
using Azure.Storage.Blobs;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Constraints;

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
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("Invalid file");

                var generatedName = $"{Guid.NewGuid()}_{file.FileName}";

                var blobUri = await _blobService.UploadFileAsync(file, generatedName);

                return Ok(new { fileName = generatedName, uri = blobUri });
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
