using System.Text.Json.Serialization;

namespace Execution_Service.Models
{

    // Incoming request from API caller
    public record CodeExecutionRequest(
        string SourceCode,
        int LanguageId,
        string RoomId
    );

    // Standardized broadcast model sent over SignalR
    public record ExecutionResultDto(
        string RoomId,
        string Output,
        string Error,
        string Status
    );

    // Structure sent by Judge0 when hitting the webhook (HTTP PUT)
    public class Judge0CallbackPayload
    {
        public string Token { get; set; } = string.Empty;
        public string? Stdout { get; set; }
        public string? Stderr { get; set; }
        public string? Compile_Output { get; set; }
        public Judge0Status? Status { get; set; }
    }

    //public record Judge0Status(int Id, string Description);

    public class Judge0SubmissionRequest
    {
        [JsonPropertyName("source_code")]
        public string SourceCode { get; set; } = string.Empty;

        [JsonPropertyName("language_id")]
        public int LanguageId { get; set; }

        [JsonPropertyName("callback_url")]
        public string CallbackUrl { get; set; } = string.Empty;

        [JsonPropertyName("cpu_time_limit")]
        public double CpuTimeLimit { get; set; } = 5.0;

        [JsonPropertyName("wall_time_limit")]
        public double WallTimeLimit { get; set; } = 10.0;

        [JsonPropertyName("memory_limit")]
        public int MemoryLimit { get; set; } = 128000;

        [JsonPropertyName("max_processes_and_or_threads")]
        public int MaxProcessesAndOrThreads { get; set; } = 60;

        [JsonPropertyName("enable_network")]
        public bool EnableNetwork { get; set; } = false;
    }

    public class Judge0ResponsePayload
    {
        [JsonPropertyName("stdout")]
        public string? Stdout { get; set; }

        [JsonPropertyName("stderr")]
        public string? Stderr { get; set; }

        [JsonPropertyName("compile_output")]
        public string? CompileOutput { get; set; }

        [JsonPropertyName("status")]
        public Judge0Status? Status { get; set; }
    }

    public class Judge0Status
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;
    }

}
