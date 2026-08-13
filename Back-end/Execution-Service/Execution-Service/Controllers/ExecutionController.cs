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
        private readonly IHubContext<ExecutionHub> _hubContext;

        public ExecutionController(Judge0Client judge0Client, IHubContext<ExecutionHub> hubContext)
        {
            _judge0Client = judge0Client;
            _hubContext = hubContext;
        }

        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] CodeExecutionRequest request)
        {
            // 1. Submit code to Judge0 (no callback_url required)
            var token = await _judge0Client.SubmitCodeAsync(request.SourceCode, request.LanguageId, callbackUrl: null);

            if (string.IsNullOrEmpty(token))
                return StatusCode(500, "Failed to submit code to Judge0.");

            // 2. Poll Judge0 until execution completes
            var result = await _judge0Client.PollResultAsync(token, request.RoomId);

            if (result == null)
                return StatusCode(508, "Code execution timed out.");

            // 3. Broadcast to SignalR connected clients
            await _hubContext.Clients.Group(request.RoomId).SendAsync("ReceiveExecutionResult", result);

            // 4. Return result directly in HTTP response
            return Ok(result);
        }
    }
}