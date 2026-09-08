using employee_management_api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers();

// Add OpenAPI
builder.Services.AddOpenApi();

// Configure PostgreSQL
builder.Services.AddDbContext<EmployeeDbContext>(options =>
{
    var connectionString =
        builder.Configuration.GetConnectionString("EmployeeDatabase");

    options.UseNpgsql(connectionString);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Serve frontend files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// Map API controllers
app.MapControllers();

// Health endpoint
app.MapGet("/health", () =>
{
    return Results.Ok(new
    {
        status = "healthy",
        application = "employee_management_api",
        timestamp = DateTime.UtcNow
    });
});

app.Run();