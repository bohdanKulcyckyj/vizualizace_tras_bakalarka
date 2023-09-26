using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Azure.Cosmos;
using Microsoft.AspNetCore.Identity;

namespace api.DataAccess
{
    public class ApplicationDbContext : DbContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _databaseName;
        private readonly string _userContainerName;
        private readonly string _roleContainerName;
        private readonly string _cosmosDbEndpoint;
        private readonly string _cosmosDbPrimaryKey;
        private readonly CosmosClient _cosmosClient;

        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<IdentityRole> Roles { get; set; }
        public ApplicationDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _databaseName = _configuration["CosmosDb:DatabaseName"];
            _userContainerName = _configuration["CosmosDb:UserContainerName"];
            _roleContainerName = _configuration["CosmosDb:RoleContainerName"];
            _cosmosDbEndpoint = _configuration["CosmosDb:EndpointUri"];
            _cosmosDbPrimaryKey = _configuration["CosmosDb:PrimaryKey"];

            _cosmosClient = new CosmosClient(_cosmosDbEndpoint, _cosmosDbPrimaryKey);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ApplicationUser>().OwnsMany(p => p.Maps);
            modelBuilder.Entity<ApplicationUser>().HasPartitionKey(e => e.Id);
            modelBuilder.Entity<ApplicationUser>().ToContainer(_userContainerName);
            modelBuilder.Entity<IdentityRole>().ToContainer(_roleContainerName);

            base.OnModelCreating(modelBuilder);
        }

        public Container GetUserContainer()
        {
            var database = _cosmosClient.GetDatabase(_databaseName);
            return database.GetContainer(_userContainerName);
        }
        public Container GetRoleContainer()
        {
            var database = _cosmosClient.GetDatabase(_databaseName);
            return database.GetContainer(_roleContainerName);
        }
    }
}
