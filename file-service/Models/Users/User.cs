using System.Text.Json.Serialization;

namespace file_service.Models.Users
{
    public class User
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
