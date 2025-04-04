using MessageThread.Data;
using MessageThread.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Handle circular references in JSON serialization
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Configure SQLite database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

// Register our message service as a scoped service (one instance per request)
builder.Services.AddScoped<MessageService>();

// Configure CORS for frontend access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Message Thread API",
        Version = "v1",
        Description = "A simple API for managing messages in a thread"
    });
});

var app = builder.Build();

// Ensure the database is created and migrations are applied
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Message Thread API v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI as the root page
    });
}

app.UseHttpsRedirection();

// Use CORS with the policy we defined
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();