using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Azure.Cosmos;

namespace api.DataAccess
{
    public class ApplicationDbContext : DbContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _databaseName;
        private readonly string _containerName;
        private readonly string _cosmosDbEndpoint;
        private readonly string _cosmosDbPrimaryKey;
        private readonly CosmosClient _cosmosClient;

        public ApplicationDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _databaseName = _configuration["CosmosDb:DatabaseName"];
            _containerName = _configuration["CosmosDb:ContainerName"];
            _cosmosDbEndpoint = _configuration["CosmosDb:EndpointUri"];
            _cosmosDbPrimaryKey = _configuration["CosmosDb:PrimaryKey"];

            _cosmosClient = new CosmosClient(_cosmosDbEndpoint, _cosmosDbPrimaryKey);
        }

        public Container GetContainer()
        {
            var database = _cosmosClient.GetDatabase(_databaseName);
            return database.GetContainer(_containerName);
        }
    }
}
