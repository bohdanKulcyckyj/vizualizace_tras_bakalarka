using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Cosmos;

namespace api.DataAccess
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<ApplicationUser> applicationUsers { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseCosmos(
                "https://wander-map-3d.documents.azure.com:443/",
                "ThxeaseQFCRGDTSlcn1139Er82Z9dNB6Iu6WdTUNZeT7sngcLJxLCl48wU34xGP3YGfQD6JrYLYNACDbztMsvQ==",
                "WanderMap3D"
            );
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ApplicationUser>()
                .ToContainer("Accounts")
                .HasKey(e => e.Id);
        }
    }
}
