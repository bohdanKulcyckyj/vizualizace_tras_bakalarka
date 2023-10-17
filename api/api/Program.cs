using api.DataAccess;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.Cosmos.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

var provider = builder.Services.BuildServiceProvider();
var configuration = provider.GetService<IConfiguration>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseCosmos(
        configuration.GetSection("CosmosDB:EndpointUri").Value,
        configuration.GetSection("CosmosDB:PrimaryKey").Value,
        configuration.GetSection("CosmosDB:DatabaseName").Value
        );
});
builder.Services.Configure<PostmarkSettings>(configuration.GetSection("PostmarkSettings"));
builder.Services.AddTransient<EmailSender>();
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(@"C:\Temp"))
    .SetDefaultKeyLifetime(TimeSpan.FromDays(7));
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Nastaven� hesla
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    // Dal�� nastaven�
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
    options.Lockout.MaxFailedAccessAttempts = 5;
})  
    .AddUserStore<ApplicationUserStore>()
    .AddRoleStore<ApplicationRoleStore>()
    .AddDefaultTokenProviders();

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
