using file_service.DAL;
using file_service.Extensions;
using file_service.Hubs;
using file_service.Models.Interfaces.Services;
using file_service.Services;
using file_service.Settings;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("http://localhost:4200", "http://localhost")
                .AllowAnyHeader()
                .WithMethods("GET", "POST")
                .AllowCredentials();
        });
});

// SignalR communication
builder.Services.AddSignalR();

builder.Services.AddHttpClient();

// Add services to the container.
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<ISignalRService, SignalRService>();

builder.Services.AddControllers();

builder.Services.AddSingleton(builder.Configuration.GetSection("Settings").Get<FileSettings>());

builder.Services.AddDbContext<DBContext>(
    options => options
        .UseNpgsql(builder.Configuration.GetConnectionString("PostGreDB"))
        .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking),
    ServiceLifetime.Scoped
);

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<FileService>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseJwtValidation();

app.UseHttpsRedirection();

app.UseAuthorization();

// SignalR communication
app.MapHub<SignalRCommunication>("/communication");

app.MapControllers();

using (var serviceScope = app.Services.GetService<IServiceScopeFactory>().CreateScope())
{
    var context = serviceScope.ServiceProvider.GetRequiredService<DBContext>();
    context.Database.Migrate();
}

app.Run();
