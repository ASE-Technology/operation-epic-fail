using Newtonsoft.Json;
using System.Net;
using System.Text;

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

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].ToString();

            if (!string.IsNullOrEmpty(token))
            {
                var splitAuthorizationValue = token.Split(' ');
                if (splitAuthorizationValue.Length == 2)
                {
                    var body = new { token = splitAuthorizationValue[1] };
                    var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
                    var response = await _httpClient.PostAsync($"{_authenticationServiceUrl}/verify-token", content);

                    if (response.IsSuccessStatusCode)
                    {
                        await _next(context);
                        return;
                    }
                }                
            }

            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        }
    }
}