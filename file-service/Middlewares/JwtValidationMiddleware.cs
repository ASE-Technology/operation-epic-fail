using file_service.Helpers;
using file_service.Models.Interfaces.Services;
using System.Net;

namespace file_service.Middlewares
{
    public class JwtValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _authenticationServiceUrl;

        public JwtValidationMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _authenticationServiceUrl = configuration["AuthenticationServiceUrl"];
        }

        public async Task Invoke(HttpContext context, IAuthService authService)
        {
            var authorizationHeader = context.Request.Headers["Authorization"];
            var currentUser = await AuthenticatedUserHelper.GetUserProfile(_authenticationServiceUrl, authorizationHeader);

            if (currentUser != null)
            {
                authService.SetCurrentUser(currentUser);

                await _next(context);
                return;
            }

            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        }
    }
}