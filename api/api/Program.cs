using api.DataAccess;
using api.Models;
using api.Services;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var provider = builder.Services.BuildServiceProvider();
var configuration = provider.GetService<IConfiguration>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// adding Azure Cosmos DB
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseCosmos(
        configuration.GetSection("CosmosDB:EndpointUri").Value,
        configuration.GetSection("CosmosDB:PrimaryKey").Value,
        configuration.GetSection("CosmosDB:DatabaseName").Value
        );
});
//builder.Services.Configure<BlobServiceSettings>(configuration.GetSection("BlobServiceSettings"));
// adding Azure Blob storage
builder.Services.AddSingleton(_ =>
    new BlobServiceClient(configuration.GetSection("BlobServiceSettings:ConnectionString").Value)
);
builder.Services.AddSingleton<IBlobService, BlobService>();
// adding Email provider from Postmark
builder.Services.Configure<PostmarkSettings>(configuration.GetSection("PostmarkSettings"));
builder.Services.AddTransient<EmailSender>();
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(@"C:\Temp"))
    .SetDefaultKeyLifetime(TimeSpan.FromDays(7));

// adding identity framework
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
    options.Lockout.MaxFailedAccessAttempts = 5;
})
    .AddUserStore<ApplicationUserStore>()
    .AddRoleStore<ApplicationRoleStore>()
    .AddDefaultTokenProviders();


builder.Services.AddAuthorization();
// adding jwt tokens
builder.Services.AddAuthentication(x => {
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = configuration.GetSection("Jwt:Issuer").Value,
        ValidAudience = configuration.GetSection("Jwt:Audience").Value,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("Jwt:Key").Value))
    };
});

builder.Services.AddCors(options =>
{
    var frontendURL = configuration.GetValue<string>("FrontendUrl");
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(frontendURL)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
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

var fileProvider = new FileExtensionContentTypeProvider();
fileProvider.Mappings[".gpx"] = "application/gpx+xml";
fileProvider.Mappings[".gltf"] = "model/gltf+json";

app.UseStaticFiles(new StaticFileOptions()
{
    ContentTypeProvider = fileProvider
});

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
