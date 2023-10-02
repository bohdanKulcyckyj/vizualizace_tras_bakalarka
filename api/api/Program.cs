using api.DataAccess;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//builder.Services.AddDbContext<ApplicationDbContext>();
// Pøidejte ApplicationDbContext jako službu s nastavením pro Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseCosmos(
        "https://wander-map-3d.documents.azure.com:443/",
        "ThxeaseQFCRGDTSlcn1139Er82Z9dNB6Iu6WdTUNZeT7sngcLJxLCl48wU34xGP3YGfQD6JrYLYNACDbztMsvQ==",
        "WanderMap3D");
});

//builder.Services.AddSingleton<ApplicationDbContext>();
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Nastavení hesla
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    // Další nastavení
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
    options.Lockout.MaxFailedAccessAttempts = 5;
})  
    .AddUserStore<ApplicationUserStore>()
    .AddRoleStore<ApplicationRoleStore>()
    .AddDefaultTokenProviders();


var provider = builder.Services.BuildServiceProvider();
var configuration = provider.GetService<IConfiguration>();
builder.Services.AddCors(options =>
{
    var frontendURL = configuration.GetValue<string>("AllowedHosts");
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(frontendURL).AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
