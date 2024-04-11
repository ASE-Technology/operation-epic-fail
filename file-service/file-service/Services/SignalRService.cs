using file_service.Hubs;
using file_service.Models.Interfaces.Services;
using Microsoft.AspNetCore.SignalR;

namespace file_service.Services
{
    public class SignalRService : ISignalRService
    {
        private readonly IHubContext<SignalRCommunication> _hub;

        public SignalRService(IHubContext<SignalRCommunication> hub)
        {
            _hub = hub;
        }

        public async Task BroadcastMethodData(string groupName, string method, object value) =>
            await _hub.Clients.Group(groupName).SendAsync(method, value);
    }
}
