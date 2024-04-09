using file_service.Extensions;
using file_service.Hubs;
using file_service.Models.Interfaces.Services;
using file_service.Services;

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
builder.Services.AddScoped<ISignalRService, SignalRService>();

builder.Services.AddControllers();
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

app.Run();
