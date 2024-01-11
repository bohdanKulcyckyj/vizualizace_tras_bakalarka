using api.Extensions;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.Security.Cryptography.Xml;

namespace api.Services
{
    public interface IBlobService
    {
        public Task<BlobDownloadInfo> GetBlobAsync(string name);
        public Task<IEnumerable<string>> ListBlobsAsync();
        public Task<Uri> UploadFileAsync(IFormFile file, string fileName);
        public Task DeleteBlobAsync(string blobName);
    }

    public class BlobServiceSettings
    {
      public string ConnectionString { get; set; }
      public string ContainerName { get; set; }
    }

    public class BlobService : IBlobService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly BlobContainerClient _containerClient;
        //private readonly BlobServiceSettings _settings;

        public BlobService(BlobServiceClient blobServiceClient/*, BlobServiceSettings settings*/)
        {
            _blobServiceClient = blobServiceClient;
            _containerClient = blobServiceClient.GetBlobContainerClient("wm3d-files");
            //_settings = settings;
        }

        public async Task DeleteBlobAsync(string blobName)
        {
            var blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.DeleteIfExistsAsync();
        }

        public async Task<BlobDownloadInfo> GetBlobAsync(string name)
        {

            var blobClient = _containerClient.GetBlobClient(name);
            var blobDownloadInfo = await blobClient.DownloadAsync();
            return blobDownloadInfo;
        }

        public async Task<IEnumerable<string>> ListBlobsAsync()
        {;
            var items = new List<string>();

            await foreach(var blobItem in _containerClient.GetBlobsAsync())
            {
                items.Add(blobItem.Name);
            }

            return items;
        }

        public async Task<Uri> UploadFileAsync(IFormFile file, string fileName)
        {
            var blobClient = _containerClient.GetBlobClient(fileName);

            // Nahrajte soubor do Blob Storage
            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, true);
            }

            return blobClient.Uri;
        }
    }
}
