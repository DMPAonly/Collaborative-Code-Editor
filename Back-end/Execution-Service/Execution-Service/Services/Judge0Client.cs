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
    }
}
