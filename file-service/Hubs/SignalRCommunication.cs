using file_service.Helpers;
using file_service.Models.Interfaces.Services;
using Microsoft.AspNetCore.SignalR;

namespace file_service.Hubs
{
    public class SignalRCommunication : Hub
    {
        private readonly IAuthService _authService;
        private readonly string _authenticationServiceUrl;

        public SignalRCommunication(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _authenticationServiceUrl = configuration["AuthenticationServiceUrl"];
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var authorizationHeader = httpContext.Request.Headers["Authorization"];
            var currentUser = await AuthenticatedUserHelper.GetUserProfile(_authenticationServiceUrl, authorizationHeader);

            if (currentUser != null)
            {
                _authService.SetCurrentUser(currentUser);
                await Groups.AddToGroupAsync(Context.ConnectionId, _authService.UserId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, _authService.UserId);
            await base.OnDisconnectedAsync(ex);
        }
    }
}
