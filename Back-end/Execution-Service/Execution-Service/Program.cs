using Execution_Service.Hubs;
using Execution_Service.Services;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Microsoft.Extensions.Http.Resilience;

var builder = WebApplication.CreateBuilder(args);

var allowReactAppPolicy = "_allowReactApp";


builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddMemoryCache();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowReactAppPolicy,
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",                   // Local Vite dev server
                    "http://localhost:3000",                   // Local Create-React-App / Next.js
                    "https://cce-frontend-kappa.vercel.app"     // Add your frontend production domain here later
                  )
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Needed if sending credentials/cookies/SignalR
        });
});

// Register Typed HttpClient for Judge0
builder.Services.AddHttpClient<Judge0Client>()
    .AddStandardResilienceHandler(); // Built-in Polly retries & transient fault handling in .NET

// Configure Rate Limiting (Protects execution service from abuse)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("ExecutionPolicy", opt =>
    {
        opt.PermitLimit = 10;                     // 10 requests max
        opt.Window = TimeSpan.FromSeconds(10);    // Every 10 seconds per IP
        opt.QueueLimit = 2;                       // Max 2 queued requests
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });
});

var app = builder.Build();

app.UseCors(allowReactAppPolicy);
app.UseRouting();

// Apply Rate Limiting Middleware
app.UseRateLimiter();

app.MapControllers();
app.MapHub<ExecutionHub>("/executionHub");

app.Run();