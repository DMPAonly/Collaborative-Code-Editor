using Microsoft.AspNetCore.SignalR;

namespace Execution_Service.Hubs
{
    public class ExecutionHub : Hub
    {
        // Clients join room group to scope real-time updates
        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        }

        public async Task LeaveRoom(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        }
    }
}