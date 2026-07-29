using Execution_Service.Hubs;
using Execution_Service.Models;
using Execution_Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;

namespace Execution_Service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExecutionController : ControllerBase
    {
        private readonly Judge0Client _judge0Client;
        private readonly IMemoryCache _cache;
        private readonly IHubContext<ExecutionHub> _hubContext;
        private readonly ILogger<ExecutionController> _logger;

        public ExecutionController(
            Judge0Client judge0Client,
            IMemoryCache cache,
            IHubContext<ExecutionHub> hubContext,
            ILogger<ExecutionController> logger)
        {
            _judge0Client = judge0Client;
            _cache = cache;
            _hubContext = hubContext;
            _logger = logger;
        }

        [HttpPost("submit")]
        [EnableRateLimiting("ExecutionPolicy")] // Protected by rate limiter
        public async Task<IActionResult> Submit([FromBody] CodeExecutionRequest request)
        {
            // Public endpoint Judge0 will call back
            var callbackUrl = $"https://{Request.Host}/api/execution/callback";

            //var callbackUrl = "https://8q7vtx8v-7213.inc1.devtunnels.ms/api/execution/callback";

            var token = await _judge0Client.SubmitCodeAsync(request.SourceCode, request.LanguageId, callbackUrl);

            if (string.IsNullOrEmpty(token))
            {
                return StatusCode(500, "Unable to dispatch request to execution engine.");
            }

            // Cache Token -> RoomId mapping for 10 mins
            _cache.Set(token, request.RoomId, TimeSpan.FromMinutes(10));

            return Ok(new { SubmissionToken = token, Status = "Queued" });
        }

        [HttpPut("callback")]
        public async Task<IActionResult> Callback([FromBody] Judge0CallbackPayload payload)
        {
            // Retrieve RoomId associated with this execution token
            if (!_cache.TryGetValue(payload.Token, out string? roomId) || string.IsNullOrEmpty(roomId))
            {
                _logger.LogWarning("Received Judge0 callback for unknown or expired token: {Token}", payload.Token);
                return Ok(); // Acknowledge Judge0 even if token expired
            }

            // Prevent double processing / clean up cache
            _cache.Remove(payload.Token);

            // Normalize output formatting
            var stdOutput = payload.Stdout ?? string.Empty;
            var stdError = !string.IsNullOrEmpty(payload.Compile_Output)
                ? payload.Compile_Output
                : (payload.Stderr ?? string.Empty);

            var resultDto = new ExecutionResultDto(
                RoomId: roomId,
                Output: stdOutput,
                Error: stdError,
                Status: payload.Status?.Description ?? "Completed"
            );

            // Push output via SignalR to room subscribers
            await _hubContext.Clients.Group(roomId).SendAsync("ReceiveExecutionResult", resultDto);

            return Ok();
        }
    }
}