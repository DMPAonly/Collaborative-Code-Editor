using Execution_Service.Models;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace Execution_Service.Services
{
    public class Judge0Client
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<Judge0Client> _logger;

        public Judge0Client(HttpClient httpClient, IConfiguration config, ILogger<Judge0Client> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;
        }

        public async Task<string?> SubmitCodeAsync(string sourceCode, int languageId, string callbackUrl)
        {
            var judge0BaseUrl = _config["Judge0:BaseUrl"];
            var authToken = _config["Judge0:AuthToken"];

            var requestPayload = new Judge0SubmissionRequest
            {
                SourceCode = sourceCode,
                LanguageId = languageId,
                CallbackUrl = callbackUrl
            };

            // Explicitly serialize to JSON string
            var jsonString = JsonSerializer.Serialize(requestPayload);

            // Log the EXACT payload being sent to help verify
            _logger.LogInformation("Sending JSON payload to Judge0: {Payload}", jsonString);

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post, $"{judge0BaseUrl}/submissions?base64_encoded=false")
                {
                    Content = new StringContent(jsonString, Encoding.UTF8, "application/json")
                };

                request.Headers.Add("X-Judge0-Key", authToken);

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var errorResponseBody = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Failed submission to Judge0. Status: {StatusCode}, Details: {Details}",
                        response.StatusCode, errorResponseBody);
                    return null;
                }

                using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
                return doc.RootElement.GetProperty("token").GetString();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "HTTP exception occurred while communicating with Judge0");
                return null;
            }
        }

        public async Task<ExecutionResultDto?> PollResultAsync(string token, string roomId)
        {
            var judge0BaseUrl = _config["Judge0:BaseUrl"];
            var authToken = _config["Judge0:AuthToken"];

            int maxAttempts = 10;
            int delayMs = 500; // Poll every 500ms

            for (int i = 0; i < maxAttempts; i++)
            {
                await Task.Delay(delayMs);

                var request = new HttpRequestMessage(HttpMethod.Get, $"{judge0BaseUrl}/submissions/{token}?base64_encoded=false");
                if (!string.IsNullOrEmpty(authToken))
                {
                    request.Headers.Add("X-Judge0-Key", authToken);
                }

                // Use the class's injected _httpClient instead of creating new instances
                var response = await _httpClient.SendAsync(request);
                if (!response.IsSuccessStatusCode) continue;

                var payload = await response.Content.ReadFromJsonAsync<Judge0ResponsePayload>();

                // Status ID > 2 means finished (3 = Accepted, 4 = Wrong Answer, 6 = Compile Error)
                if (payload?.Status != null && payload.Status.Id > 2)
                {
                    var output = payload.Stdout ?? string.Empty;

                    // Fixed property reference (CompileOutput matching Judge0ResponsePayload)
                    var error = !string.IsNullOrEmpty(payload.CompileOutput)
                        ? payload.CompileOutput
                        : (payload.Stderr ?? string.Empty);

                    // Fixed Record Constructor Instantiation
                    return new ExecutionResultDto(
                        RoomId: roomId,
                        Output: output,
                        Error: error,
                        Status: payload.Status.Description ?? "Completed"
                    );
                }
            }

            return null; // Timed out
        }
    }
}
