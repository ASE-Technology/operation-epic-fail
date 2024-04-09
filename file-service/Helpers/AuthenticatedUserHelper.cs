using file_service.Models.Users;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

namespace file_service.Helpers
{
    public static class AuthenticatedUserHelper
    {
        public static async Task<User?> GetUserProfile(string authenticationServiceUrl, StringValues authorizationHeader) 
        {
            if (!string.IsNullOrEmpty(authorizationHeader))
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization = System.Net.Http.Headers.AuthenticationHeaderValue.Parse(authorizationHeader);

                    var response = await httpClient.GetAsync($"{authenticationServiceUrl}/profile");

                    if (response.IsSuccessStatusCode)
                    {
                        var userContent = await response.Content.ReadAsStringAsync();
                        return JsonConvert.DeserializeObject<User>(userContent);
                    }
                }
            }

            return null;
        }
    }
}
