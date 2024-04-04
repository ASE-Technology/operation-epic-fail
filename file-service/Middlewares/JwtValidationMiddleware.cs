using file_service.Models.Interfaces.Services;
using file_service.Models.Users;
using Newtonsoft.Json;
using System.Net;

namespace file_service.Middlewares
{
    public class JwtValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _authenticationServiceUrl;
        private readonly HttpClient _httpClient;

        public JwtValidationMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _authenticationServiceUrl = configuration["AuthenticationServiceUrl"];
            _httpClient = new HttpClient();
        }

        public async Task Invoke(HttpContext context, IAuthService authService)
        {
            var authorizationHeader = context.Request.Headers["Authorization"];

            if (!string.IsNullOrEmpty(authorizationHeader))
            {
                _httpClient.DefaultRequestHeaders.Authorization = System.Net.Http.Headers.AuthenticationHeaderValue.Parse(authorizationHeader);

                var response = await _httpClient.GetAsync($"{_authenticationServiceUrl}/profile");

                if (response.IsSuccessStatusCode)
                {
                    var userContent = await response.Content.ReadAsStringAsync();
                    var currentUser = JsonConvert.DeserializeObject<User>(userContent);

                    if (currentUser != null)
                    {
                        authService.SetCurrentUser(currentUser);

                        await _next(context);
                        return;
                    }
                }
            }

            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        }
    }
}